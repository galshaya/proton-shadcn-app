# Frontend Development Prompt for Newsletter Generation System

## Project Overview

You are tasked with developing a frontend application that connects to a local API for a newsletter generation system. The system uses an agent to query a MongoDB vector database (replacing a previous RAG approach) to generate newsletters based on user-defined parameters.

## API Details

### Base URL
The API is running locally at: `http://localhost:5001`

### Authentication
No authentication is required for local development.

### Core API Endpoints

#### Health Check
- `GET /api/health` - Check if the API is running

#### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/{id}` - Update a project
- `DELETE /api/projects/{id}` - Delete a project

Project object structure:
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

#### Documents
- `GET /api/projects/{id}/documents` - Get all documents for a project
- `GET /api/documents/{id}` - Get a specific document
- `POST /api/projects/{id}/documents` - Upload a document to a project
- `GET /api/documents/{id}/download` - Download a document

Document object structure:
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

#### Newsletters
- `GET /api/projects/{id}/newsletters` - Get all newsletters for a project
- `GET /api/newsletters/{id}` - Get a specific newsletter
- `POST /api/projects/{id}/newsletters` - Create a newsletter for a project
- `PUT /api/newsletters/{id}` - Update a newsletter
- `DELETE /api/newsletters/{id}` - Delete a newsletter

Newsletter object structure:
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

#### Recipients
- `GET /api/projects/{id}/recipients` - Get all recipients for a project
- `GET /api/recipients/{id}` - Get a specific recipient
- `POST /api/projects/{id}/recipients` - Create a recipient for a project
- `PUT /api/recipients/{id}` - Update a recipient
- `DELETE /api/recipients/{id}` - Delete a recipient

Recipient object structure:
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

#### Scraping Packages
- `GET /api/scraping-packages` - Get all scraping packages
- `GET /api/scraping-packages/{id}` - Get a specific scraping package

#### Personas
- `GET /api/personas` - Get all personas
- `GET /api/personas/{id}` - Get a specific persona

## Streaming Functionality

A key requirement is implementing streaming functionality to display the agent's progress in real-time. The API provides a streaming endpoint for newsletter generation:

- `POST /api/projects/{id}/newsletters/generate-stream` - Generate a newsletter with streaming updates

The streaming functionality should:
1. Display text with proper line breaks for better readability
2. Include a section showing the context/articles pulled from the database
3. Allow downloading a JSON file containing all inputs and the generated newsletter output

### Streaming Implementation

The system uses Server-Sent Events (SSE) to stream the agent's thoughts and the generated newsletter in real-time:

1. The client makes a POST request to start the generation process
2. The client then connects to the streaming endpoint using EventSource
3. The server sends updates as they happen
4. The client displays these updates in real-time

Example JavaScript for connecting to the stream:

```javascript
// First send the form data to start the generation process
fetch('/api/projects/{id}/newsletters/generate', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    if (data.error) {
        alert('Error: ' + data.error);
        return;
    }

    // Connect to the streaming endpoint
    const eventSource = new EventSource('/api/projects/{id}/newsletters/stream');
    
    eventSource.onmessage = function(event) {
        if (event.data === "[DONE]") {
            eventSource.close();
            // Handle completion
        } else {
            // Update UI with streamed content
            // Note: The server replaces newlines with \n, so we need to convert them back
            const message = event.data.replace(/\\n/g, '\n');
            // Append message to the UI
        }
    };
    
    eventSource.onerror = function(event) {
        console.error("EventSource error:", event);
        eventSource.close();
    };
});
```

## UI Requirements

### Core Pages

1. **Dashboard**
   - Overview of projects
   - Quick access to create new projects or newsletters

2. **Projects List**
   - List of all projects with key details
   - Actions to view, edit, or delete projects

3. **Project Detail**
   - Project information
   - Tabs for:
     - Documents
     - Newsletters
     - Recipients

4. **Newsletter Generation**
   - Form to input newsletter parameters:
     - Project selection
     - Scraping package selection
     - Date range
     - Search query
     - Client context
     - Project context
     - Prompt
   - Streaming output display with:
     - Agent thoughts/progress
     - Context/articles section
     - Generated newsletter content
   - Download button for JSON output

5. **Newsletter Detail**
   - View generated newsletter
   - Edit capabilities
   - Send to recipients option

### UI Components

1. **Navigation**
   - Main navigation with links to Dashboard, Projects, etc.
   - Breadcrumb navigation for deeper pages

2. **Project Card**
   - Display project name, description, status
   - Quick action buttons

3. **Newsletter Generator Form**
   - Input fields for all parameters
   - Submit button
   - Loading indicator

4. **Streaming Output Display**
   - Split view with:
     - Agent thoughts/progress panel
     - Context/articles panel
     - Generated content panel
   - Auto-scrolling with option to pause
   - Proper formatting of markdown content

5. **Document Upload**
   - Drag and drop area
   - File type restrictions
   - Upload progress indicator

## Technical Requirements

1. **Framework**
   - Use React for the frontend
   - Use a component library like Material-UI or Tailwind CSS

2. **State Management**
   - Use React Context or Redux for global state
   - Implement proper loading states

3. **API Integration**
   - Create a service layer for API calls
   - Implement error handling
   - Use proper data typing

4. **Streaming**
   - Implement Server-Sent Events (SSE) for real-time updates
   - Handle connection errors and reconnection
   - Properly format streamed content

5. **Responsive Design**
   - Ensure the UI works on desktop and tablet
   - Implement mobile-friendly views

6. **Data Download**
   - Implement JSON download functionality
   - Include all inputs and outputs

## Development Process

1. Set up the project structure
2. Create API service layer
3. Implement core pages and components
4. Add streaming functionality
5. Implement responsive design
6. Add error handling and loading states
7. Test all functionality

## Additional Notes

- Focus on making the streaming interface intuitive and readable
- Ensure proper error handling for API calls
- Implement proper loading states for all async operations
- Make sure the UI is responsive and works well on different screen sizes
- Prioritize the newsletter generation workflow as it's the core functionality
