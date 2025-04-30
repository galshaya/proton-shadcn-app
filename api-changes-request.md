# API Changes for Document Management

## Current Issues
1. Documents disappear from the library after being added to a persona
2. Personas don't properly retain document associations
3. Document IDs aren't being properly stored or retrieved

## Required API Changes

### 1. Document Association Model
The API should implement a "many-to-many" relationship between personas and documents:
- A document can be associated with multiple personas
- A persona can have multiple associated documents
- Adding a document to a persona should not remove it from the available documents list

### 2. Persona Schema Update
Update the persona schema to properly store document associations:

```javascript
// Persona Schema
{
  _id: ObjectId,
  name: String,
  description: String,
  inputs: {
    model_name: String,
    date_range: String,
    search_query: String,
    client_context: String,
    project_context: String,
    prompt: String,
    package_ids: [String],
    document_ids: [String]  // Array of document IDs
  },
  documents: [  // Array of document objects for UI display
    {
      id: String,
      name: String,
      type: String,
      uploadedAt: Date
    }
  ]
}
```

### 3. API Endpoints Update

#### GET /api/personas/:id
Should return the complete persona object including document_ids and documents array.

#### PUT /api/personas/:id
Should accept and store both document_ids and documents array.

#### POST /api/personas
Should accept and store both document_ids and documents array.

#### GET /api/documents
Should return all documents, regardless of whether they're associated with personas.

### 4. Document Association Logic
When a document is associated with a persona:
1. Add the document ID to the persona's document_ids array
2. Add the document object to the persona's documents array
3. Do NOT remove the document from the available documents collection

### 5. Document Retrieval Logic
When fetching documents for the document library:
1. Return ALL documents from the documents collection
2. Do not filter out documents that are associated with personas

## Implementation Notes
- The frontend is already set up to handle these relationships correctly
- The issue is in how the API manages document associations
- No changes to the document upload functionality are needed
- The main change is ensuring documents remain available after being associated with a persona
