"""
Proton API Server

This is the main entry point for the Proton API server.
It initializes the Flask application and registers the API blueprint.
"""

import os
import logging
from flask import Flask, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Import API blueprint
from api import api_bp

# Create Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Set secret key
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev_key_for_testing')

# Register API blueprint
app.register_blueprint(api_bp)

# Root route
@app.route('/')
def index():
    """Root route"""
    return jsonify({
        "name": "Proton API",
        "version": "1.0.0",
        "description": "API for Proton CRM system",
        "endpoints": [
            "/api/scraping-packages",
            "/api/personas",
            "/api/newsletter/generate",
            "/api/health"
        ]
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
