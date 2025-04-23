# API Updates for Persona and Newsletter Generation

## Persona Schema

### Old Schema (Still Supported)
```json
{
  "name": "Persona Name",
  "description": "Persona description",
  "prompt": "Prompt text"
}
```

### New Schema
```json
{
  "name": "Persona Name",
  "description": "Persona description",
  "inputs": {
    "model_name": "gpt-4o",
    "date_range": "all time",
    "search_query": "AI, MCP, A2A, Agents, Protocols",
    "client_context": "Client context information",
    "project_context": "Project context information",
    "prompt": "Detailed prompt for the newsletter",
    "package_ids": ["package-id-1", "package-id-2"]
  }
}
```

## Newsletter Generation

### Old Request Format (Still Supported)
```json
{
  "model": "gpt-4o",
  "date_range": "30days",
  "package_ids": ["package-id-1", "package-id-2"],
  "search_query": "artificial intelligence",
  "client_context": "Client context",
  "project_context": "Project context",
  "prompt": "Newsletter prompt",
  "article_limit": 10,
  "persona_id": "optional-persona-id"
}
```

### New Request Format
```json
{
  "inputs": {
    "model_name": "gpt-4o",
    "date_range": "all time",
    "search_query": "AI, MCP, A2A, Agents, Protocols",
    "client_context": "Client context information",
    "project_context": "Project context information",
    "prompt": "Detailed prompt for the newsletter",
    "package_ids": ["package-id-1", "package-id-2"],
    "persona_id": "optional-persona-id"
  }
}
```

### New Response Format
```json
{
  "inputs": {
    "model_name": "gpt-4o",
    "date_range": "all time",
    "search_query": "AI, MCP, A2A, Agents, Protocols",
    "client_context": "Client context information",
    "project_context": "Project context information",
    "prompt": "Detailed prompt for the newsletter",
    "package_ids": ["package-id-1", "package-id-2"]
  },
  "outputs": {
    "content": "Generated newsletter content",
    "context_used": "Context information used for generation",
    "articles_count": 5,
    "timestamp": "2025-04-22T19:49:34.584Z"
  }
}
```

## Implementation Notes

1. **Backward Compatibility**: Both old and new schemas are supported.

2. **Model Names**: Use full model names for Claude models (e.g., `claude-3-7-sonnet-20250219`).

3. **Persona Integration**: When a user selects a persona, populate the form with the persona's inputs.

4. **JSON Import**: Implement functionality to import JSON data to populate the newsletter generation form.

5. **Package Selection**: Default to all packages selected (ON) instead of all unselected (OFF).

6. **Response Handling**: Handle both old and new response formats in your UI.

7. **Field Mapping**:
   - Old `model` → New `inputs.model_name`
   - Old `date_range` → New `inputs.date_range`
   - Old `search_query` → New `inputs.search_query`
   - Old `client_context` → New `inputs.client_context`
   - Old `project_context` → New `inputs.project_context`
   - Old `prompt` → New `inputs.prompt`
   - Old `package_ids` → New `inputs.package_ids`
   - Old `persona_id` → New `inputs.persona_id`
   - Old `generated_content` → New `outputs.content`
   - Old `context_used` → New `outputs.context_used`
   - Old `articles_count` → New `outputs.articles_count`
```
