# API Enhancement Request: Newsletter Data Model and Project Scheduling

## 1. Enhanced Newsletter Data Model

### Current Limitations
The current newsletter data model lacks comprehensive information about:
- Which persona was used to generate the newsletter
- Which recipients received the newsletter
- Detailed tracking and analytics data

### Requested Enhancements

#### Newsletter Schema Updates
Please update the newsletter schema to include the following fields:

```json
{
  "_id": "string",
  "project_id": "string",
  "title": "string",
  "subject": "string",
  "content": "string",
  "created_at": "datetime",
  "updated_at": "datetime",
  "sent_at": "datetime",
  "scheduled_for": "datetime",
  "status": "string", // "draft", "scheduled", "sending", "sent", "cancelled"
  
  // New fields
  "persona_id": "string",
  "persona_name": "string", // Denormalized for quick access
  "recipient_ids": ["string"], // Array of recipient IDs
  "recipient_count": "number", // Total count of recipients
  "documents": ["string"], // Array of document IDs used in generation
  "package_ids": ["string"], // Array of scraping package IDs used in generation
  "model": "string", // AI model used for generation
  "generation_params": {
    // Store all parameters used for generation
    "use_web_search": "boolean",
    "search_query": "string",
    "client_context": "string",
    "project_context": "string"
  },
  "stats": {
    "open_rate": "number",
    "click_rate": "number",
    "unique_opens": "number",
    "unique_clicks": "number",
    "delivery_rate": "number",
    "bounce_rate": "number",
    "unsubscribe_rate": "number"
  }
}
```

#### API Endpoints for Enhanced Newsletter Model

1. **Get Newsletter with Full Details**
   - `GET /api/newsletters/{id}/full`
   - Returns newsletter with all related data (persona, recipients, etc.)

2. **Get Newsletters by Persona**
   - `GET /api/personas/{id}/newsletters`
   - Returns all newsletters generated using a specific persona

3. **Get Newsletters by Recipient**
   - `GET /api/recipients/{id}/newsletters`
   - Returns all newsletters sent to a specific recipient

## 2. Project-Level Newsletter Scheduling

### Current Limitations
Currently, the system lacks robust project-level scheduling capabilities, including:
- Daily frequency option
- Flexible timing configuration
- Schedule management

### Requested Enhancements

#### Project Schema Updates
Please update the project schema to include scheduling information:

```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "created_at": "datetime",
  "updated_at": "datetime",
  
  // New scheduling fields
  "newsletter_schedule": {
    "frequency": "string", // "daily", "weekly", "monthly", "custom"
    "time": "string", // 24-hour format, e.g., "09:00"
    "days": ["string"], // For weekly: ["monday", "wednesday", "friday"], for monthly: ["1", "15"]
    "active": "boolean", // Whether automatic scheduling is enabled
    "next_scheduled_date": "datetime", // Next scheduled newsletter date/time
    "last_sent_date": "datetime" // Last sent newsletter date/time
  }
}
```

#### API Endpoints for Newsletter Scheduling

1. **Update Project Newsletter Schedule**
   - `PUT /api/projects/{id}/schedule`
   - Updates the newsletter schedule for a project

2. **Get Project Newsletter Schedule**
   - `GET /api/projects/{id}/schedule`
   - Returns the current newsletter schedule for a project

3. **Get Scheduled Newsletters**
   - `GET /api/projects/{id}/newsletters/scheduled`
   - Returns all scheduled newsletters for a project

4. **Cancel Scheduled Newsletter**
   - `POST /api/newsletters/{id}/cancel`
   - Cancels a scheduled newsletter

5. **Reschedule Newsletter**
   - `POST /api/newsletters/{id}/reschedule`
   - Reschedules a newsletter to a new date/time

## 3. Implementation Requirements

### Database Changes
- Update the newsletters collection schema
- Update the projects collection schema
- Create appropriate indexes for efficient querying

### Backend Logic
- Implement daily scheduling option in the scheduler
- Update newsletter generation to store persona and recipient information
- Create logic to manage and track newsletter schedules
- Implement automatic newsletter generation based on schedule

### API Implementation
- Implement all new endpoints
- Update existing endpoints to support the enhanced data models
- Ensure backward compatibility with existing frontend code

## 4. Expected Response Format

Please provide the following information in your response:
1. Confirmation of which requested features can be implemented
2. Estimated timeline for implementation
3. Any suggested modifications to the proposed schemas
4. API documentation for the new/updated endpoints
5. Any additional information the frontend team should be aware of

## 5. Priority
This enhancement is high priority as it enables critical functionality for tracking newsletter performance and automating newsletter delivery.

Thank you for your assistance with this request.
