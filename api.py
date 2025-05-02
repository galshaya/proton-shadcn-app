"""
Proton API Layer

This module provides RESTful API endpoints for the Proton CRM system.
It handles requests from the frontend for scraping packages, personas,
and newsletter generation.
"""

import os
import logging
import datetime
import sys
from flask import Flask, request, jsonify, Blueprint
from bson.objectid import ObjectId
from dotenv import load_dotenv
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get the path to the backend repository from environment variable
BACKEND_REPO_PATH = os.environ.get('BACKEND_REPO_PATH', '')

# If the backend repo path is provided, add it to the Python path
if BACKEND_REPO_PATH and os.path.exists(BACKEND_REPO_PATH):
    logger.info(f"Adding backend repo path to Python path: {BACKEND_REPO_PATH}")
    sys.path.insert(0, BACKEND_REPO_PATH)
else:
    logger.warning("BACKEND_REPO_PATH environment variable not set or path does not exist")
    logger.warning("Make sure to set BACKEND_REPO_PATH in .env file to point to the backend repository")

# Try to import ProtonDB from different possible locations
try:
    # Try direct import first (if in same directory)
    from proton_db_setup import ProtonDB
    logger.info("Imported ProtonDB from current directory")
except ImportError:
    try:
        # Try import from deploy/scraping_package_gui
        from deploy.scraping_package_gui.proton_db_setup import ProtonDB
        logger.info("Imported ProtonDB from deploy/scraping_package_gui")
    except ImportError:
        try:
            # Try import with absolute path if BACKEND_REPO_PATH is set
            if BACKEND_REPO_PATH:
                sys.path.insert(0, os.path.join(BACKEND_REPO_PATH, 'deploy', 'scraping_package_gui'))
                from proton_db_setup import ProtonDB
                logger.info("Imported ProtonDB using absolute path")
            else:
                raise ImportError("BACKEND_REPO_PATH not set")
        except ImportError:
            logger.error("Failed to import ProtonDB. Make sure the module is in your PYTHONPATH.")
            logger.error("You can set BACKEND_REPO_PATH in .env file to point to the backend repository")

            # Define a mock ProtonDB class for testing
            class ProtonDB:
                def __init__(self):
                    self.db = None
                    logger.warning("Using mock ProtonDB class. Database operations will not work.")

                def close(self):
                    pass

# Create Blueprint for API routes
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Initialize database connection
db = None

def init_db():
    """Initialize database connection"""
    global db
    try:
        db = ProtonDB()
        logger.info("Connected to MongoDB database")
        return True
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        return False

# Helper function to convert MongoDB ObjectId to string
def serialize_objectid(obj):
    """Convert ObjectId to string in a dictionary or list"""
    if isinstance(obj, dict):
        for key in obj:
            if isinstance(obj[key], ObjectId):
                obj[key] = str(obj[key])
            elif isinstance(obj[key], (dict, list)):
                obj[key] = serialize_objectid(obj[key])
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            if isinstance(item, ObjectId):
                obj[i] = str(item)
            elif isinstance(item, (dict, list)):
                obj[i] = serialize_objectid(item)
    return obj

# Helper function to format dates in a dictionary or list
def serialize_dates(obj):
    """Convert datetime objects to ISO format strings in a dictionary or list"""
    if isinstance(obj, dict):
        for key in obj:
            if isinstance(obj[key], datetime.datetime):
                obj[key] = obj[key].isoformat()
            elif isinstance(obj[key], (dict, list)):
                obj[key] = serialize_dates(obj[key])
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            if isinstance(item, datetime.datetime):
                obj[i] = item.isoformat()
            elif isinstance(item, (dict, list)):
                obj[i] = serialize_dates(item)
    return obj

# Helper function to serialize MongoDB documents for JSON response
def serialize_document(doc):
    """Serialize a MongoDB document for JSON response"""
    if doc is None:
        return None

    # Convert ObjectId to string
    doc = serialize_objectid(doc)

    # Convert datetime objects to ISO format strings
    doc = serialize_dates(doc)

    return doc

# Error handling
@api_bp.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Resource not found"}), 404

@api_bp.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({"error": "Internal server error"}), 500

# API Routes for Scraping Packages
@api_bp.route('/scraping-packages', methods=['GET'])
def get_scraping_packages():
    """Get all scraping packages"""
    global db

    if db is None and not init_db():
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Get all scraping packages
        packages = list(db.db.scraping_packages.find())

        # Serialize for JSON response
        packages = [serialize_document(package) for package in packages]

        return jsonify(packages)
    except Exception as e:
        logger.error(f"Error getting scraping packages: {e}")
        return jsonify({"error": str(e)}), 500

@api_bp.route('/scraping-packages/<package_id>', methods=['GET'])
def get_scraping_package(package_id):
    """Get a specific scraping package by ID"""
    global db

    if db is None and not init_db():
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Convert string ID to ObjectId
        try:
            obj_id = ObjectId(package_id)
        except Exception:
            return jsonify({"error": "Invalid package ID format"}), 400

        # Get the package
        package = db.db.scraping_packages.find_one({"_id": obj_id})

        if package is None:
            return jsonify({"error": "Package not found"}), 404

        # Serialize for JSON response
        package = serialize_document(package)

        return jsonify(package)
    except Exception as e:
        logger.error(f"Error getting scraping package: {e}")
        return jsonify({"error": str(e)}), 500

@api_bp.route('/scraping-packages', methods=['POST'])
def create_scraping_package():
    """Create a new scraping package"""
    global db

    if db is None and not init_db():
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Get request data
        data = request.json

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Validate required fields
        required_fields = ["name", "description"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Check for either sources or rss_feeds
        if "sources" not in data and "rss_feeds" not in data:
            return jsonify({"error": "Missing required field: sources or rss_feeds"}), 400

        # Normalize data: if rss_feeds is provided but sources is not, copy rss_feeds to sources
        if "rss_feeds" in data and "sources" not in data:
            data["sources"] = data["rss_feeds"]

        # Add creation timestamp
        data["created_at"] = datetime.datetime.utcnow()
        data["updated_at"] = datetime.datetime.utcnow()

        # Insert into database
        result = db.db.scraping_packages.insert_one(data)

        # Return the created package
        package = db.db.scraping_packages.find_one({"_id": result.inserted_id})
        package = serialize_document(package)

        return jsonify(package), 201
    except Exception as e:
        logger.error(f"Error creating scraping package: {e}")
        return jsonify({"error": str(e)}), 500

@api_bp.route('/scraping-packages/<package_id>', methods=['PUT'])
def update_scraping_package(package_id):
    """Update a scraping package"""
    global db

    if db is None and not init_db():
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Get request data
        data = request.json

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Convert string ID to ObjectId
        try:
            obj_id = ObjectId(package_id)
        except Exception:
            return jsonify({"error": "Invalid package ID format"}), 400

        # Check if package exists
        package = db.db.scraping_packages.find_one({"_id": obj_id})
        if package is None:
            return jsonify({"error": "Package not found"}), 404

        # Check for either sources or rss_feeds
        if "rss_feeds" in data and "sources" not in data:
            data["sources"] = data["rss_feeds"]

        # Update timestamp
        data["updated_at"] = datetime.datetime.utcnow()

        # Update in database
        db.db.scraping_packages.update_one({"_id": obj_id}, {"$set": data})

        # Return the updated package
        updated_package = db.db.scraping_packages.find_one({"_id": obj_id})
        updated_package = serialize_document(updated_package)

        return jsonify(updated_package)
    except Exception as e:
        logger.error(f"Error updating scraping package: {e}")
        return jsonify({"error": str(e)}), 500

@api_bp.route('/scraping-packages/<package_id>', methods=['DELETE'])
def delete_scraping_package(package_id):
    """Delete a scraping package"""
    global db

    if db is None and not init_db():
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Convert string ID to ObjectId
        try:
            obj_id = ObjectId(package_id)
        except Exception:
            return jsonify({"error": "Invalid package ID format"}), 400

        # Check if package exists
        package = db.db.scraping_packages.find_one({"_id": obj_id})
        if package is None:
            return jsonify({"error": "Package not found"}), 404

        # Delete from database
        db.db.scraping_packages.delete_one({"_id": obj_id})

        return jsonify({"message": "Package deleted successfully"})
    except Exception as e:
        logger.error(f"Error deleting scraping package: {e}")
        return jsonify({"error": str(e)}), 500

# API Routes for Personas
@api_bp.route('/personas', methods=['GET'])
def get_personas():
    """Get all personas"""
    global db

    if db is None and not init_db():
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Create personas collection if it doesn't exist
        if "personas" not in db.db.list_collection_names():
            db.db.create_collection("personas")
            logger.info("Created personas collection")

        # Get all personas
        personas = list(db.db.personas.find())

        # Serialize for JSON response
        personas = [serialize_document(persona) for persona in personas]

        return jsonify(personas)
    except Exception as e:
        logger.error(f"Error getting personas: {e}")
        return jsonify({"error": str(e)}), 500

@api_bp.route('/personas/<persona_id>', methods=['GET'])
def get_persona(persona_id):
    """Get a specific persona by ID"""
    global db

    if db is None and not init_db():
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Convert string ID to ObjectId
        try:
            obj_id = ObjectId(persona_id)
        except Exception:
            return jsonify({"error": "Invalid persona ID format"}), 400

        # Get the persona
        persona = db.db.personas.find_one({"_id": obj_id})

        if persona is None:
            return jsonify({"error": "Persona not found"}), 404

        # Serialize for JSON response
        persona = serialize_document(persona)

        return jsonify(persona)
    except Exception as e:
        logger.error(f"Error getting persona: {e}")
        return jsonify({"error": str(e)}), 500

@api_bp.route('/personas', methods=['POST'])
def create_persona():
    """Create a new persona"""
    global db

    if db is None and not init_db():
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Get request data
        data = request.json

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Validate required fields
        required_fields = ["name", "description"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Check for either prompt or inputs.prompt
        if "prompt" not in data and ("inputs" not in data or "prompt" not in data["inputs"]):
            return jsonify({"error": "Missing required field: prompt or inputs.prompt"}), 400

        # Add creation timestamp
        data["created_at"] = datetime.datetime.utcnow()

        # Create personas collection if it doesn't exist
        if "personas" not in db.db.list_collection_names():
            db.db.create_collection("personas")
            logger.info("Created personas collection")

        # Insert into database
        result = db.db.personas.insert_one(data)

        # Return the created persona
        persona = db.db.personas.find_one({"_id": result.inserted_id})
        persona = serialize_document(persona)

        return jsonify(persona), 201
    except Exception as e:
        logger.error(f"Error creating persona: {e}")
        return jsonify({"error": str(e)}), 500

@api_bp.route('/personas/<persona_id>', methods=['PUT'])
def update_persona(persona_id):
    """Update a persona"""
    global db

    if db is None and not init_db():
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Get request data
        data = request.json

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Convert string ID to ObjectId
        try:
            obj_id = ObjectId(persona_id)
        except Exception:
            return jsonify({"error": "Invalid persona ID format"}), 400

        # Check if persona exists
        persona = db.db.personas.find_one({"_id": obj_id})
        if persona is None:
            return jsonify({"error": "Persona not found"}), 404

        # Update in database
        db.db.personas.update_one({"_id": obj_id}, {"$set": data})

        # Return the updated persona
        updated_persona = db.db.personas.find_one({"_id": obj_id})
        updated_persona = serialize_document(updated_persona)

        return jsonify(updated_persona)
    except Exception as e:
        logger.error(f"Error updating persona: {e}")
        return jsonify({"error": str(e)}), 500

# API Route for Newsletter Generation
@api_bp.route('/newsletter/generate', methods=['POST'])
def generate_newsletter():
    """Generate a newsletter using the agent"""
    global db

    if db is None and not init_db():
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Get request data
        data = request.json

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Validate required fields
        required_fields = ["model", "prompt"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Import the newsletter agent
        try:
            # Try direct import first
            from deploy.newsletter_agent.agent_newsletter_generator import NewsletterAgent
            logger.info("Imported NewsletterAgent from deploy/newsletter_agent")
        except ImportError:
            try:
                # Try import with absolute path if BACKEND_REPO_PATH is set
                if BACKEND_REPO_PATH:
                    newsletter_agent_path = os.path.join(BACKEND_REPO_PATH, 'deploy', 'newsletter_agent')
                    sys.path.insert(0, newsletter_agent_path)
                    from agent_newsletter_generator import NewsletterAgent
                    logger.info(f"Imported NewsletterAgent from {newsletter_agent_path}")
                else:
                    raise ImportError("BACKEND_REPO_PATH not set")
            except ImportError:
                logger.error("Failed to import NewsletterAgent. Make sure the module is in your PYTHONPATH.")
                return jsonify({"error": "Failed to import NewsletterAgent. Backend integration not available."}), 500

        # Initialize the agent
        try:
            agent = NewsletterAgent()
        except Exception as e:
            logger.error(f"Failed to initialize NewsletterAgent: {e}")
            return jsonify({"error": f"Failed to initialize NewsletterAgent: {str(e)}"}), 500

        # Extract parameters
        model = data.get("model", "gpt-4o")
        date_range = data.get("date_range", "all")
        package_ids = data.get("package_ids", [])
        search_query = data.get("search_query", "")
        client_context = data.get("client_context", "")
        project_context = data.get("project_context", "")
        prompt = data.get("prompt", "")
        uploaded_context = data.get("uploaded_context", "")
        article_limit = data.get("article_limit", 10)

        # Get persona if provided
        persona_context = ""
        if "persona_id" in data:
            try:
                persona_id = ObjectId(data["persona_id"])
                persona = db.db.personas.find_one({"_id": persona_id})
                if persona:
                    persona_context = f"Persona: {persona.get('name')}\n"
                    persona_context += f"Description: {persona.get('description')}\n"
                    persona_context += f"Prompt: {persona.get('prompt')}\n\n"
            except Exception as e:
                logger.warning(f"Error getting persona: {e}")

        # Run the agent
        result = agent.run_agent_with_query(
            search_query=search_query,
            date_range=date_range,
            package_ids=package_ids,
            client_context=client_context,
            project_context=project_context,
            prompt=prompt + "\n" + persona_context,
            uploaded_context=uploaded_context,
            model=model,
            article_limit=article_limit
        )

        return jsonify(result)
    except Exception as e:
        logger.error(f"Error generating newsletter: {e}")
        return jsonify({"error": str(e)}), 500

# Health check endpoint
@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    global db

    db_status = "connected" if db is not None else "disconnected"

    return jsonify({
        "status": "ok",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "database": db_status,
        "version": "1.0.0"
    })

# Initialize database on module import
init_db()
