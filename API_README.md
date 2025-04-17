# Proton API

This is the API layer for the Proton CRM system. It provides RESTful endpoints for managing scraping packages, personas, and newsletter generation.

## Setup

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and fill in the required values:
   ```
   cp .env.example .env
   ```
5. Run the server:
   ```
   python app.py
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| MONGODB_URI | MongoDB connection string | Yes |
| MONGODB_DB_NAME | MongoDB database name | Yes |
| LOCAL | Use DNS resolver for MongoDB Atlas (True/False) | No |
| OPENAI_API_KEY | OpenAI API key | Yes |
| ANTHROPIC_API_KEY | Anthropic API key | No |
| FLASK_SECRET_KEY | Secret key for Flask sessions | Yes |
| PORT | Port to run the application on | No |
| CORS_ORIGINS | Comma-separated list of allowed origins for CORS | No |

## API Endpoints

### Scraping Packages

- `GET /api/scraping-packages` - Get all scraping packages
- `GET /api/scraping-packages/:id` - Get a specific scraping package
- `POST /api/scraping-packages` - Create a new scraping package
- `PUT /api/scraping-packages/:id` - Update a scraping package
- `DELETE /api/scraping-packages/:id` - Delete a scraping package

### Personas

- `GET /api/personas` - Get all personas
- `GET /api/personas/:id` - Get a specific persona
- `POST /api/personas` - Create a new persona
- `PUT /api/personas/:id` - Update a persona

### Newsletter Generation

- `POST /api/newsletter/generate` - Generate a newsletter

### Health Check

- `GET /api/health` - Check the health of the API

## Request/Response Examples

### Create a Scraping Package

**Request:**
```http
POST /api/scraping-packages
Content-Type: application/json

{
  "name": "Tech News",
  "description": "Latest technology news",
  "sources": [
    {
      "url": "https://techcrunch.com/feed/",
      "type": "rss"
    },
    {
      "url": "https://www.theverge.com/rss/index.xml",
      "type": "rss"
    }
  ],
  "keywords": ["AI", "machine learning", "technology"],
  "schedule": {
    "frequency": "daily",
    "time": "08:00"
  }
}
```

**Response:**
```json
{
  "_id": "60f7b0b3e6b3f3b3e3b3b3b3",
  "name": "Tech News",
  "description": "Latest technology news",
  "sources": [
    {
      "url": "https://techcrunch.com/feed/",
      "type": "rss"
    },
    {
      "url": "https://www.theverge.com/rss/index.xml",
      "type": "rss"
    }
  ],
  "keywords": ["AI", "machine learning", "technology"],
  "schedule": {
    "frequency": "daily",
    "time": "08:00"
  },
  "created_at": "2023-07-21T12:00:00.000Z",
  "updated_at": "2023-07-21T12:00:00.000Z"
}
```

### Create a Persona

**Request:**
```http
POST /api/personas
Content-Type: application/json

{
  "name": "Growth Marketer",
  "description": "High-level overview focused on trends",
  "prompt": "Summarize key industry shifts with a growth marketing focus"
}
```

**Response:**
```json
{
  "_id": "60f7b0b3e6b3f3b3e3b3b3b4",
  "name": "Growth Marketer",
  "description": "High-level overview focused on trends",
  "prompt": "Summarize key industry shifts with a growth marketing focus",
  "created_at": "2023-07-21T12:00:00.000Z"
}
```

### Generate a Newsletter

**Request:**
```http
POST /api/newsletter/generate
Content-Type: application/json

{
  "model": "gpt-4o",
  "date_range": "30days",
  "package_ids": ["60f7b0b3e6b3f3b3e3b3b3b3"],
  "search_query": "artificial intelligence",
  "client_context": "Tech startup focused on AI solutions for healthcare",
  "project_context": "Monthly newsletter highlighting AI advancements in healthcare",
  "prompt": "Create a newsletter with 3-4 sections covering recent AI developments in healthcare. Include a brief introduction and conclusion.",
  "persona_id": "60f7b0b3e6b3f3b3e3b3b3b4",
  "article_limit": 10
}
```

**Response:**
```json
{
  "generated_content": "# AI in Healthcare: Monthly Insights\n\n## Introduction\n\nWelcome to this month's AI in Healthcare newsletter...",
  "context_used": "Context information used to generate the newsletter...",
  "articles_count": 8
}
```

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages in case of failure:

- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Example error response:
```json
{
  "error": "Missing required field: name"
}
```

## Troubleshooting

### MongoDB Connection Issues

If you encounter DNS resolution issues with MongoDB Atlas, set `LOCAL=True` in your `.env` file. This enables a custom DNS resolver that uses Google's DNS servers (8.8.8.8 and 1.1.1.1).

### API Key Issues

Make sure your OpenAI API key is valid and has sufficient quota. The Anthropic API key is optional but recommended for using Claude models.

## Development

To run the server in development mode:

```
python app.py
```

The server will run on port 5000 by default. You can change this by setting the `PORT` environment variable.
