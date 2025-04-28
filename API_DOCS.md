# API Documentation for Newsletter Generation System

This document provides comprehensive documentation for all API endpoints available in the Newsletter Generation System. The frontend application should use these endpoints to interact with the backend services.

## Base URL

All API endpoints are accessible at:

```
http://localhost:5001/api
```

## Authentication

No authentication is required for local development.

## Response Format

All API responses are in JSON format. Successful responses typically include the requested data, while error responses include an `error` field with a description of the error.

Example error response:
```json
{
  "error": "Resource not found"
}
```

## Common Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## API Endpoints

### Health Check

#### Check API Health
```
GET /health
```

Returns the current health status of the API.

**Response Example:**
```json
{
  "status": "ok",
  "timestamp": "2025-04-16T16:04:58.851Z",
  "database": "connected",
  "version": "1.0.0"
}
```

### Projects

#### Get All Projects
```
GET /projects
```

Returns a list of all projects.

**Response Example:**
```json
[
  {
    "_id": "68000e53d33ddcc89a51928b",
    "name": "Tech Newsletter",
    "description": "Weekly newsletter about technology trends",
    "status": "active",
    "created_at": "2025-04-16T16:08:52.083Z",
    "updated_at": "2025-04-16T16:09:07.995Z"
  }
]
```

#### Get Project by ID
```
GET /projects/{project_id}
```

Returns a specific project by ID.

**Response Example:**
```json
{
  "_id": "68000e53d33ddcc89a51928b",
  "name": "Tech Newsletter",
  "description": "Weekly newsletter about technology trends",
  "status": "active",
  "created_at": "2025-04-16T16:08:52.083Z",
  "updated_at": "2025-04-16T16:09:07.995Z"
}
```

#### Create Project
```
POST /projects
```

Creates a new project.

**Request Body:**
```json
{
  "name": "Tech Newsletter",
  "description": "Weekly newsletter about technology trends"
}
```

**Required Fields:**
- `name`: Project name
- `description`: Project description

**Response Example:**
```json
{
  "_id": "68000e53d33ddcc89a51928b",
  "name": "Tech Newsletter",
  "description": "Weekly newsletter about technology trends",
  "status": "active",
  "created_at": "2025-04-16T16:08:52.083Z",
  "updated_at": "2025-04-16T16:08:52.083Z"
}
```

#### Update Project
```
PUT /projects/{project_id}
```

Updates an existing project.

**Request Body:**
```json
{
  "name": "Updated Tech Newsletter",
  "description": "Updated weekly newsletter about technology trends",
  "status": "inactive"
}
```

**Response Example:**
```json
{
  "_id": "68000e53d33ddcc89a51928b",
  "name": "Updated Tech Newsletter",
  "description": "Updated weekly newsletter about technology trends",
  "status": "inactive",
  "created_at": "2025-04-16T16:08:52.083Z",
  "updated_at": "2025-04-16T16:09:07.995Z"
}
```

#### Delete Project
```
DELETE /projects/{project_id}
```

Deletes a project.

**Response Example:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Documents

#### Get All Documents for a Project
```
GET /projects/{project_id}/documents
```

Returns all documents for a specific project.

**Response Example:**
```json
[
  {
    "_id": "68000e77d33ddcc89a51928c",
    "project_id": "68000e53d33ddcc89a51928b",
    "document_name": "research.txt",
    "document_type": "text/plain",
    "uploaded_at": "2025-04-16T16:09:27.307Z",
    "status": "active"
  }
]
```

#### Get Document by ID
```
GET /documents/{document_id}
```

Returns a specific document by ID.

**Response Example:**
```json
{
  "_id": "68000e77d33ddcc89a51928c",
  "project_id": "68000e53d33ddcc89a51928b",
  "document_name": "research.txt",
  "document_type": "text/plain",
  "uploaded_at": "2025-04-16T16:09:27.307Z",
  "status": "active"
}
```

#### Upload Document
```
POST /projects/{project_id}/documents
```

Uploads a document to a project.

**Request Format:**
- Content-Type: `multipart/form-data`
- Form field: `file` (the document file)

**Response Example:**
```json
{
  "_id": "68000e77d33ddcc89a51928c",
  "project_id": "68000e53d33ddcc89a51928b",
  "document_name": "research.txt",
  "document_type": "text/plain",
  "uploaded_at": "2025-04-16T16:09:27.307Z",
  "status": "active"
}
```

#### Download Document
```
GET /documents/{document_id}/download
```

Downloads a document.

**Response:**
The document file as an attachment.

### Newsletters

#### Get All Newsletters for a Project
```
GET /projects/{project_id}/newsletters
```

Returns all newsletters for a specific project.

**Response Example:**
```json
[
  {
    "_id": "68000fbdd33ddcc89a51928f",
    "project_id": "68000e53d33ddcc89a51928b",
    "title": "Tech Newsletter - April 2025",
    "content": "# Tech Newsletter\n\n## Latest Trends\n...",
    "created_at": "2025-04-16T16:14:53.534Z",
    "updated_at": "2025-04-16T16:14:53.534Z",
    "status": "draft"
  }
]
```

#### Get Newsletter by ID
```
GET /newsletters/{newsletter_id}
```

Returns a specific newsletter by ID.

**Response Example:**
```json
{
  "_id": "68000fbdd33ddcc89a51928f",
  "project_id": "68000e53d33ddcc89a51928b",
  "title": "Tech Newsletter - April 2025",
  "content": "# Tech Newsletter\n\n## Latest Trends\n...",
  "created_at": "2025-04-16T16:14:53.534Z",
  "updated_at": "2025-04-16T16:14:53.534Z",
  "status": "draft"
}
```

#### Create Newsletter
```
POST /projects/{project_id}/newsletters
```

Creates a new newsletter for a project.

**Request Body:**
```json
{
  "title": "Tech Newsletter - April 2025",
  "content": "# Tech Newsletter\n\n## Latest Trends\n..."
}
```

**Required Fields:**
- `title`: Newsletter title
- `content`: Newsletter content (Markdown format)

**Response Example:**
```json
{
  "_id": "68000fbdd33ddcc89a51928f",
  "project_id": "68000e53d33ddcc89a51928b",
  "title": "Tech Newsletter - April 2025",
  "content": "# Tech Newsletter\n\n## Latest Trends\n...",
  "created_at": "2025-04-16T16:14:53.534Z",
  "updated_at": "2025-04-16T16:14:53.534Z",
  "status": "draft"
}
```

#### Update Newsletter
```
PUT /newsletters/{newsletter_id}
```

Updates an existing newsletter.

**Request Body:**
```json
{
  "title": "Updated Tech Newsletter - April 2025",
  "content": "# Updated Tech Newsletter\n\n## Latest Trends\n...",
  "status": "published"
}
```

**Response Example:**
```json
{
  "_id": "68000fbdd33ddcc89a51928f",
  "project_id": "68000e53d33ddcc89a51928b",
  "title": "Updated Tech Newsletter - April 2025",
  "content": "# Updated Tech Newsletter\n\n## Latest Trends\n...",
  "created_at": "2025-04-16T16:14:53.534Z",
  "updated_at": "2025-04-16T16:15:05.389Z",
  "status": "published"
}
```

#### Delete Newsletter
```
DELETE /newsletters/{newsletter_id}
```

Deletes a newsletter.

**Response Example:**
```json
{
  "success": true,
  "message": "Newsletter deleted successfully"
}
```

### Recipients

#### Get All Recipients for a Project
```
GET /projects/{project_id}/recipients
```

Returns all recipients for a specific project.

**Response Example:**
```json
[
  {
    "_id": "68000ec2d33ddcc89a51928e",
    "project_id": "68000e53d33ddcc89a51928b",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2025-04-16T16:10:42.272Z",
    "updated_at": "2025-04-16T16:12:34.277Z",
    "status": "active"
  }
]
```

#### Get Recipient by ID
```
GET /recipients/{recipient_id}
```

Returns a specific recipient by ID.

**Response Example:**
```json
{
  "_id": "68000ec2d33ddcc89a51928e",
  "project_id": "68000e53d33ddcc89a51928b",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "created_at": "2025-04-16T16:10:42.272Z",
  "updated_at": "2025-04-16T16:12:34.277Z",
  "status": "active"
}
```

#### Create Recipient
```
POST /projects/{project_id}/recipients
```

Creates a new recipient for a project.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Required Fields:**
- `name`: Recipient name
- `email`: Recipient email

**Response Example:**
```json
{
  "_id": "68000ec2d33ddcc89a51928e",
  "project_id": "68000e53d33ddcc89a51928b",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "created_at": "2025-04-16T16:10:42.272Z",
  "updated_at": "2025-04-16T16:10:42.272Z",
  "status": "active"
}
```

#### Update Recipient
```
PUT /recipients/{recipient_id}
```

Updates an existing recipient.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "status": "inactive"
}
```

**Response Example:**
```json
{
  "_id": "68000ec2d33ddcc89a51928e",
  "project_id": "68000e53d33ddcc89a51928b",
  "name": "John Smith",
  "email": "john.smith@example.com",
  "created_at": "2025-04-16T16:10:42.272Z",
  "updated_at": "2025-04-16T16:12:34.277Z",
  "status": "inactive"
}
```

#### Delete Recipient
```
DELETE /recipients/{recipient_id}
```

Deletes a recipient.

**Response Example:**
```json
{
  "success": true,
  "message": "Recipient deleted successfully"
}
```

### Scraping Packages

#### Get All Scraping Packages
```
GET /scraping-packages
```

Returns a list of all scraping packages.

**Response Example:**
```json
[
  {
    "_id": "67f9e1a3d33ddcc89a51928a",
    "name": "Tech News",
    "description": "Technology news from various sources",
    "sources": [
      {
        "url": "https://techcrunch.com/feed/",
        "type": "rss"
      }
    ],
    "created_at": "2025-04-15T10:30:27.307Z",
    "updated_at": "2025-04-15T10:30:27.307Z"
  }
]
```

#### Get Scraping Package by ID
```
GET /scraping-packages/{package_id}
```

Returns a specific scraping package by ID.

**Response Example:**
```json
{
  "_id": "67f9e1a3d33ddcc89a51928a",
  "name": "Tech News",
  "description": "Technology news from various sources",
  "sources": [
    {
      "url": "https://techcrunch.com/feed/",
      "type": "rss"
    }
  ],
  "created_at": "2025-04-15T10:30:27.307Z",
  "updated_at": "2025-04-15T10:30:27.307Z"
}
```

#### Run All Scraping Packages
```
POST /scraping-packages/run
```

Runs all active scraping packages to fetch new articles.

**Response Example:**
```json
{
  "message": "Ran 3 packages, processed 42 articles",
  "packages_run": 3,
  "articles_processed": 42,
  "results": [
    {
      "package_id": "67f9e1a3d33ddcc89a51928a",
      "package_name": "Tech News",
      "articles_processed": 15,
      "success": true
    }
  ]
}
```

#### Run Specific Scraping Package
```
POST /scraping-packages/{package_id}/run
```

Runs a specific scraping package to fetch new articles.

**Response Example:**
```json
{
  "message": "Ran package 'Tech News', processed 15 articles",
  "package_id": "67f9e1a3d33ddcc89a51928a",
  "package_name": "Tech News",
  "articles_processed": 15,
  "success": true
}
```

### Personas

#### Get All Personas
```
GET /personas
```

Returns a list of all personas.

**Response Example:**
```json
[
  {
    "_id": "68000e9ed33ddcc89a51928d",
    "name": "Tech Expert",
    "description": "Technology expert with deep knowledge of AI and machine learning",
    "prompt": "You are a technology expert with deep knowledge of AI and machine learning...",
    "created_at": "2025-04-16T16:10:06.306Z",
    "updated_at": "2025-04-16T16:10:23.291Z"
  }
]
```

#### Get Persona by ID
```
GET /personas/{persona_id}
```

Returns a specific persona by ID.

**Response Example:**
```json
{
  "_id": "68000e9ed33ddcc89a51928d",
  "name": "Tech Expert",
  "description": "Technology expert with deep knowledge of AI and machine learning",
  "prompt": "You are a technology expert with deep knowledge of AI and machine learning...",
  "created_at": "2025-04-16T16:10:06.306Z",
  "updated_at": "2025-04-16T16:10:23.291Z"
}
```

#### Create Persona
```
POST /personas
```

Creates a new persona.

**Request Body:**
```json
{
  "name": "Tech Expert",
  "description": "Technology expert with deep knowledge of AI and machine learning",
  "prompt": "You are a technology expert with deep knowledge of AI and machine learning..."
}
```

**Required Fields:**
- `name`: Persona name
- `description`: Persona description
- `prompt`: Persona prompt for the AI model

**Response Example:**
```json
{
  "_id": "68000e9ed33ddcc89a51928d",
  "name": "Tech Expert",
  "description": "Technology expert with deep knowledge of AI and machine learning",
  "prompt": "You are a technology expert with deep knowledge of AI and machine learning...",
  "created_at": "2025-04-16T16:10:06.306Z",
  "updated_at": "2025-04-16T16:10:06.306Z"
}
```

#### Update Persona
```
PUT /personas/{persona_id}
```

Updates an existing persona.

**Request Body:**
```json
{
  "name": "AI Expert",
  "description": "AI expert with deep knowledge of machine learning and neural networks",
  "prompt": "You are an AI expert with deep knowledge of machine learning and neural networks..."
}
```

**Response Example:**
```json
{
  "_id": "68000e9ed33ddcc89a51928d",
  "name": "AI Expert",
  "description": "AI expert with deep knowledge of machine learning and neural networks",
  "prompt": "You are an AI expert with deep knowledge of machine learning and neural networks...",
  "created_at": "2025-04-16T16:10:06.306Z",
  "updated_at": "2025-04-16T16:10:23.291Z"
}
```

## Newsletter Generation with Streaming

The system supports generating newsletters with real-time streaming of the agent's progress. This is implemented using Server-Sent Events (SSE).

### Generate Newsletter (Non-Streaming)
```
POST /newsletter/generate
```

Generates a newsletter using the agent.

**Request Body:**
```json
{
  "model": "gpt-4o",
  "date_range": "30days",
  "package_ids": ["67f9e1a3d33ddcc89a51928a"],
  "search_query": "artificial intelligence",
  "client_context": "Tech startup focused on AI solutions",
  "project_context": "Monthly newsletter highlighting AI advancements",
  "prompt": "Create a newsletter with 3-4 sections covering recent AI developments. Include a brief introduction and conclusion.",
  "article_limit": 5
}
```

**Parameters:**
- `model`: AI model to use (e.g., "gpt-4o", "claude-3-opus-20240229")
- `date_range`: Date range for articles ("7days", "30days", "90days", "all")
- `package_ids`: Array of scraping package IDs to include
- `search_query`: Search query for finding relevant articles
- `client_context`: Context about the client
- `project_context`: Context about the project
- `prompt`: Specific instructions for the newsletter
- `article_limit`: Maximum number of articles to include (default: 10)

**Response Example:**
```json
{
  "generated_content": "# AI Developments Newsletter\n\n## Introduction\n...",
  "context_used": "PROJECT CONTEXT:\nMonthly newsletter highlighting AI advancements\n\nRELEVANT ARTICLES:\n[1] Article Title\nSource: Source Name\n...",
  "articles_count": 5
}
```

### Generate Newsletter with Streaming

To implement streaming for newsletter generation, follow these steps:

1. First, make a POST request to start the generation process:

```javascript
// Step 1: Start the generation process
fetch('/api/projects/{project_id}/newsletters', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "title": "AI Newsletter - April 2025",
        "content": "",
        "generation_params": {
            "model": "gpt-4o",
            "date_range": "30days",
            "package_ids": ["67f9e1a3d33ddcc89a51928a"],
            "search_query": "artificial intelligence",
            "client_context": "Tech startup focused on AI solutions",
            "project_context": "Monthly newsletter highlighting AI advancements",
            "prompt": "Create a newsletter with 3-4 sections covering recent AI developments. Include a brief introduction and conclusion.",
            "article_limit": 5
        }
    })
})
.then(response => response.json())
.then(data => {
    if (data.error) {
        console.error('Error:', data.error);
        return;
    }
    
    // Step 2: Connect to the streaming endpoint
    const newsletterId = data._id;
    const eventSource = new EventSource(`/api/newsletters/${newsletterId}/stream`);
    
    eventSource.onmessage = function(event) {
        if (event.data === "[DONE]") {
            eventSource.close();
            // Handle completion
            console.log("Newsletter generation complete");
        } else {
            // Update UI with streamed content
            // Note: The server replaces newlines with \n, so we need to convert them back
            const message = event.data.replace(/\\n/g, '\n');
            console.log("Received update:", message);
            // Append message to the UI
        }
    };
    
    eventSource.onerror = function(event) {
        console.error("EventSource error:", event);
        eventSource.close();
    };
})
.catch(error => {
    console.error('Error:', error);
});
```

2. The server will process the request and start generating the newsletter in the background.

3. The client will receive real-time updates through the SSE connection.

4. When the generation is complete, the server will send a `[DONE]` message.

5. The client can then fetch the complete newsletter using the `GET /newsletters/{newsletter_id}` endpoint.

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages in case of failure. The frontend should handle these errors gracefully and display appropriate messages to the user.

Common error scenarios:
- Invalid input parameters (400 Bad Request)
- Resource not found (404 Not Found)
- Server-side errors (500 Internal Server Error)

Example error handling:

```javascript
fetch('/api/projects')
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Unknown error occurred');
            });
        }
        return response.json();
    })
    .then(data => {
        // Handle successful response
        console.log('Projects:', data);
    })
    .catch(error => {
        // Handle error
        console.error('Error fetching projects:', error.message);
        // Display error message to user
    });
```

## Data Models

### Project
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Document
```json
{
  "_id": "string",
  "project_id": "string",
  "document_name": "string",
  "document_type": "string",
  "uploaded_at": "datetime",
  "status": "string"
}
```

### Newsletter
```json
{
  "_id": "string",
  "project_id": "string",
  "title": "string",
  "content": "string",
  "created_at": "datetime",
  "updated_at": "datetime",
  "status": "string"
}
```

### Recipient
```json
{
  "_id": "string",
  "project_id": "string",
  "name": "string",
  "email": "string",
  "created_at": "datetime",
  "updated_at": "datetime",
  "status": "string"
}
```

### Scraping Package
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "sources": [
    {
      "url": "string",
      "type": "string"
    }
  ],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Persona
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "prompt": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```
