/**
 * Proton API Client
 *
 * This module provides functions for interacting with the Proton API.
 */

// Base URL for API requests - updated to use the deployed API on Render.com
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://proton-api-3k6g.onrender.com';

/**
 * Normalize MongoDB objects by ensuring consistent ID access
 * @param {Object|Array} data - Data to normalize (single object or array of objects)
 * @returns {Object|Array} - Normalized data
 */
function normalizeIds(data) {
  // If data is null or undefined, return it as is
  if (data == null) return data;

  // If data is an array, normalize each item
  if (Array.isArray(data)) {
    return data.map(item => normalizeIds(item));
  }

  // If data is an object with _id, add id property
  if (typeof data === 'object' && data._id) {
    // Create a new object to avoid mutating the original
    return {
      ...data,
      // Keep _id for React keys and add id for consistent access
      id: data.id || data._id
    };
  }

  // Return other data types as is
  return data;
}

/**
 * Check API health
 * @returns {Promise<boolean>} - True if API is healthy
 */
async function checkApiHealth() {
  try {
    const url = `${API_BASE_URL}/api/health`;
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      return data.status === 'ok' || data.status === 'healthy';
    }
    return false;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

/**
 * Poll API health until it's healthy or max attempts reached
 * @param {number} maxAttempts - Maximum number of polling attempts
 * @param {number} interval - Polling interval in milliseconds
 * @returns {Promise<boolean>} - True if API becomes healthy
 */
async function pollApiHealth(maxAttempts = 5, interval = 2000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    console.log(`Health check attempt ${attempt + 1}/${maxAttempts}...`);
    const isHealthy = await checkApiHealth();

    if (isHealthy) {
      console.log('API is now healthy');
      return true;
    }

    // Wait before next attempt
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  console.log('Max health check attempts reached, API still unhealthy');
  return false;
}

/**
 * Make a request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    console.log(`Making ${options.method || 'GET'} request to ${url}`);
    if (options.body) {
      console.log('Request body:', options.body);
    }

    // Use mode: 'cors' for cross-origin requests
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
    });

    // Try to parse response as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, get text
      const text = await response.text();
      console.log('Non-JSON response:', text);
      data = { message: text };
    }

    console.log('Response status:', response.status);
    console.log('Response data:', data);

    // Handle 503 Service Unavailable specifically
    if (response.status === 503) {
      console.log('Database appears to be offline (503), polling health endpoint...');
      // Start polling health endpoint in the background
      pollApiHealth().then(isHealthy => {
        if (isHealthy) {
          console.log('Database is back online');
          // Could dispatch an event or update global state here
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('api-health-restored'));
          }
        }
      });

      throw new Error('Database is currently offline. Please try again in a few moments.');
    }

    // Check for error response
    if (!response.ok) {
      throw new Error(data.error || data.message || `API error: ${response.status}`);
    }

    // Normalize IDs in the response data
    const normalizedData = normalizeIds(data);

    // For list endpoints, check if the result is empty
    if (Array.isArray(normalizedData) && normalizedData.length === 0) {
      console.log('API returned an empty list');
    }

    return normalizedData;
  } catch (error) {
    // Handle CORS errors specifically
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      console.error(`CORS or network error: ${error.message}`);

      // Check if we're using the remote API
      const isRemoteApi = API_BASE_URL.includes('render.com') || !API_BASE_URL.includes('localhost');

      if (isRemoteApi) {
        console.error(`
          CORS issue detected with remote API.
          Try switching to the local API by running:
          npm run use-local-api
        `);
      } else {
        console.error(`
          Network error with local API.
          Make sure your local API server is running on ${API_BASE_URL}.
          Or switch to the remote API by running:
          npm run use-remote-api
        `);
      }

      throw new Error(`API connection error: ${error.message}. Check if the API server is running and accessible.`);
    }

    console.error(`API request failed: ${error.message}`);
    throw error;
  }
}

/**
 * Scraping Packages API
 */
export const scrapingPackagesApi = {
  /**
   * Get all scraping packages
   * @returns {Promise<Array>} - List of scraping packages
   */
  getAll: async () => {
    try {
      const packages = await apiRequest('/api/scraping-packages');

      // Check if we got an empty list
      if (Array.isArray(packages) && packages.length === 0) {
        console.log('No scraping packages found');
      }

      return packages; // Already normalized by apiRequest
    } catch (error) {
      console.error('Failed to fetch scraping packages:', error);
      // Re-throw to let the component handle the error
      throw error;
    }
  },

  /**
   * Get a specific scraping package
   * @param {string} id - Package ID
   * @returns {Promise<Object>} - Scraping package
   */
  getById: async (id) => {
    try {
      return await apiRequest(`/api/scraping-packages/${id}`);
    } catch (error) {
      console.error(`Failed to fetch scraping package ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new scraping package
   * @param {Object} data - Package data
   * @returns {Promise<Object>} - Created package
   */
  create: async (data) => {
    // Log the data being sent
    console.log('Creating package with data:', data);

    // Ensure both sources and rss_feeds are included for compatibility
    const apiData = {
      ...data,
      sources: data.sources || data.rss_feeds || [],
      rss_feeds: data.sources || data.rss_feeds || []
    };

    console.log('Transformed API data for new package:', apiData);

    try {
      const newPackage = await apiRequest('/api/scraping-packages', {
        method: 'POST',
        body: JSON.stringify(apiData),
      });

      console.log('Successfully created package:', newPackage);
      return newPackage;
    } catch (error) {
      console.error('Failed to create scraping package:', error);
      throw error;
    }
  },

  /**
   * Update a scraping package
   * @param {string} id - Package ID
   * @param {Object} data - Package data
   * @returns {Promise<Object>} - Updated package
   */
  update: async (id, data) => {
    // Log the data being sent
    console.log(`Updating package ${id} with data:`, data);

    // Ensure both sources and rss_feeds are included for compatibility
    const apiData = {
      ...data,
      sources: data.sources || data.rss_feeds || [],
      rss_feeds: data.sources || data.rss_feeds || []
    };

    console.log(`Transformed API data for package ${id}:`, apiData);

    try {
      const updatedPackage = await apiRequest(`/api/scraping-packages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(apiData),
      });

      console.log('Successfully updated package:', updatedPackage);
      return updatedPackage;
    } catch (error) {
      console.error(`Failed to update scraping package ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a scraping package
   * @param {string} id - Package ID
   * @returns {Promise<Object>} - Response
   */
  delete: async (id) => {
    // Log the delete operation
    console.log(`Deleting package ${id}`);

    try {
      const result = await apiRequest(`/api/scraping-packages/${id}`, {
        method: 'DELETE',
      });

      console.log(`Successfully deleted package ${id}`);
      return result;
    } catch (error) {
      console.error(`Failed to delete scraping package ${id}:`, error);
      throw error;
    }
  },
};

/**
 * Personas API
 */
export const personasApi = {
  /**
   * Get all personas
   * @returns {Promise<Array>} - List of personas
   */
  getAll: async () => {
    try {
      const personas = await apiRequest('/api/personas');

      // Check if we got an empty list
      if (Array.isArray(personas) && personas.length === 0) {
        console.log('No personas found');
      }

      return personas; // Already normalized by apiRequest
    } catch (error) {
      console.error('Failed to fetch personas:', error);
      // Re-throw to let the component handle the error
      throw error;
    }
  },

  /**
   * Get a specific persona
   * @param {string} id - Persona ID
   * @returns {Promise<Object>} - Persona
   */
  getById: async (id) => {
    try {
      return await apiRequest(`/api/personas/${id}`);
    } catch (error) {
      console.error(`Failed to fetch persona ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new persona
   * @param {Object} data - Persona data
   * @returns {Promise<Object>} - Created persona
   */
  create: async (data) => {
    // Handle both old and new schema
    const apiData = {
      name: data.name,
      description: data.description,
      // Include documents array if present
      ...(data.documents ? { documents: data.documents } : {}),
      // If using new schema with inputs
      ...(data.inputs ? { inputs: data.inputs } : { prompt: data.prompt })
    };

    console.log('Creating persona with data:', JSON.stringify(apiData, null, 2));

    try {
      const newPersona = await apiRequest('/api/personas', {
        method: 'POST',
        body: JSON.stringify(apiData),
      });

      console.log('Successfully created persona:', newPersona);
      return newPersona;
    } catch (error) {
      console.error('Failed to create persona:', error);
      throw error;
    }
  },

  /**
   * Update a persona
   * @param {string} id - Persona ID
   * @param {Object} data - Persona data
   * @returns {Promise<Object>} - Updated persona
   */
  update: async (id, data) => {
    // Handle both old and new schema
    const apiData = {
      name: data.name,
      description: data.description,
      // Include documents array if present
      ...(data.documents ? { documents: data.documents } : {}),
      // If using new schema with inputs
      ...(data.inputs ? { inputs: data.inputs } : { prompt: data.prompt })
    };

    console.log(`Updating persona ${id} with data:`, JSON.stringify(apiData, null, 2));

    try {
      const updatedPersona = await apiRequest(`/api/personas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(apiData),
      });

      console.log('Successfully updated persona:', updatedPersona);
      return updatedPersona;
    } catch (error) {
      console.error(`Failed to update persona ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a persona
   * @param {string} id - Persona ID
   * @returns {Promise<Object>} - Response
   */
  delete: async (id) => {
    console.log(`Deleting persona ${id}`);

    try {
      const result = await apiRequest(`/api/personas/${id}`, {
        method: 'DELETE',
      });

      console.log(`Successfully deleted persona ${id}`);
      return result;
    } catch (error) {
      console.error(`Failed to delete persona ${id}:`, error);
      throw error;
    }
  },
};

/**
 * Newsletter API
 */
export const newsletterApi = {
  /**
   * Generate a newsletter
   * @param {Object} data - Newsletter generation parameters
   * @returns {Promise<Object>} - Generated newsletter
   */
  generate: async (data) => {
    // Prepare the request data based on the model
    const requestData = { ...data };

    // Log the model being used
    console.log(`Using ${requestData.model || 'default'} model for generation`);

    // Add required parameters for web search with compatible models
    const webSearchCompatibleModels = ['gpt-4.1', 'gpt-4o', 'o3', 'o4-mini'];

    // Extract use_web_search from inputs and remove inputs from requestData
    const useWebSearch = requestData.inputs?.use_web_search || false;
    delete requestData.inputs;

    if (webSearchCompatibleModels.includes(requestData.model) && useWebSearch) {
      requestData.use_responses_api = true;
      requestData.use_web_search = true;
      requestData.web_search_preview = true;
      console.log(`Enabling web search for ${requestData.model}`);
    }

    // Add required parameter for Claude models
    if (requestData.model && requestData.model.includes('claude')) {
      requestData.use_anthropic = true;

      // Map newer Claude model IDs to the format that the backend expects
      // Store the original model name for logging
      const originalModel = requestData.model;

      // Map model names to the correct format
      if (requestData.model === 'claude-3-7-sonnet-20250219') {
        requestData.model = 'claude-3-sonnet-20240229'; // Use the compatible model name
      } else if (requestData.model === 'claude-3-5-sonnet-20241022') {
        requestData.model = 'claude-3-opus-20240229'; // Use the compatible model name
      }

      console.log(`Enabling Anthropic API: mapped ${originalModel} to ${requestData.model}`);
    }

    console.log('Generating newsletter with data:', JSON.stringify(requestData, null, 2));

    return apiRequest('/api/newsletter/generate', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
};

/**
 * Health API
 */
export const healthApi = {
  /**
   * Check API health
   * @returns {Promise<Object>} - Health status
   */
  check: () => apiRequest('/api/health'),
};

/**
 * Documents API
 */
export const documentsApi = {
  /**
   * Get all documents
   * @returns {Promise<Array>} - List of documents
   */
  getAll: async () => {
    try {
      const documents = await apiRequest('/api/documents');

      // Check if we got an empty list
      if (Array.isArray(documents) && documents.length === 0) {
        console.log('No documents found');
      }

      return documents; // Already normalized by apiRequest
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      // Re-throw to let the component handle the error
      throw error;
    }
  },

  /**
   * Get a specific document
   * @param {string} id - Document ID
   * @returns {Promise<Object>} - Document metadata
   */
  getById: async (id) => {
    try {
      return await apiRequest(`/api/documents/${id}`);
    } catch (error) {
      console.error(`Failed to fetch document ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get document content
   * @param {string} id - Document ID
   * @returns {Promise<Object>} - Document content
   */
  getContent: async (id) => {
    try {
      return await apiRequest(`/api/documents/${id}/content`);
    } catch (error) {
      console.error(`Failed to fetch content for document ${id}:`, error);
      throw error;
    }
  },

  /**
   * Download document
   * @param {string} id - Document ID
   * @returns {string} - Document download URL
   */
  download: (id) => {
    const url = `${API_BASE_URL}/api/documents/${id}/download`;
    // This returns the URL that can be used in an <a> tag or window.open()
    return url;
  },

  /**
   * Upload a document
   * @param {File} file - File to upload
   * @param {string} projectId - Optional project ID
   * @returns {Promise<Object>} - Uploaded document
   */
  upload: async (file, projectId = null) => {
    const formData = new FormData();
    formData.append('file', file);

    if (projectId) {
      formData.append('project_id', projectId);
    }

    const url = `${API_BASE_URL}/api/documents`;
    console.log(`Uploading document to ${url}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Parse the response
      const documentData = await response.json();

      // Normalize the document data
      const normalizedDocument = normalizeIds(documentData);

      console.log('Successfully uploaded document:', normalizedDocument);
      return normalizedDocument;
    } catch (error) {
      console.error(`Document upload failed: ${error.message}`);
      throw error;
    }
  },

  /**
   * Delete a document
   * @param {string} id - Document ID
   * @returns {Promise<Object>} - Response
   */
  delete: async (id) => {
    console.log(`Deleting document ${id}`);

    try {
      const result = await apiRequest(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      console.log(`Successfully deleted document ${id}`);
      return result;
    } catch (error) {
      console.error(`Failed to delete document ${id}:`, error);
      throw error;
    }
  },
};

/**
 * Enhanced Newsletter API with document support
 */
export const enhancedNewsletterApi = {
  /**
   * Generate a newsletter with documents
   * @param {Object} params - Generation parameters
   * @param {string} params.prompt - Prompt text
   * @param {Array<string>} params.documentIds - Document IDs to include
   * @param {string} params.model - Model to use (default: gpt-4o)
   * @param {string} params.personaId - Optional persona ID
   * @param {string} params.searchQuery - Optional search query for web search
   * @param {string} params.clientContext - Optional client context
   * @param {string} params.projectContext - Optional project context
   * @returns {Promise<Object>} - Generated newsletter
   */
  generateWithDocuments: async (params) => {
    const {
      prompt,
      documentIds,
      personaId,
      model = 'gpt-4o',
      searchQuery,
      clientContext,
      projectContext,
      useWebSearch = false
    } = params;

    // Create request object with all necessary parameters
    const requestData = {
      model,
      // The backend expects 'documents' not 'document_ids'
      documents: documentIds,
      prompt,
      search_query: searchQuery,
      client_context: clientContext,
      project_context: projectContext
    };

    if (personaId) {
      requestData.persona_id = personaId;
    }

    // Log the model being used
    console.log(`Using ${model || 'default'} model for generation with documents`);

    // Add required parameters for web search with compatible models
    const webSearchCompatibleModels = ['gpt-4.1', 'gpt-4o', 'o3', 'o4-mini'];

    if (webSearchCompatibleModels.includes(model) && useWebSearch) {
      requestData.use_responses_api = true;
      requestData.use_web_search = true;
      requestData.web_search_preview = true;
      console.log(`Enabling web search for ${model}`);
    }

    // Add required parameter for Claude models
    if (model && model.includes('claude')) {
      requestData.use_anthropic = true;

      // Map newer Claude model IDs to the format that the backend expects
      // Store the original model name for logging
      const originalModel = model;

      // Map model names to the correct format
      if (model === 'claude-3-7-sonnet-20250219') {
        requestData.model = 'claude-3-sonnet-20240229'; // Use the compatible model name
      } else if (model === 'claude-3-5-sonnet-20241022') {
        requestData.model = 'claude-3-opus-20240229'; // Use the compatible model name
      } else {
        requestData.model = model; // Keep the original model name
      }

      console.log(`Enabling Anthropic API: mapped ${originalModel} to ${requestData.model}`);
    }

    console.log('Generating newsletter with documents:', JSON.stringify(requestData, null, 2));

    return apiRequest('/api/newsletter/generate', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
};

/**
 * Chat API
 */
export const chatApi = {
  /**
   * Send a chat message
   * @param {Object} params - Chat parameters
   * @param {string} params.message - User message
   * @param {Array<string>} params.documentIds - Document IDs to include in context
   * @param {Array<string>} params.packageIds - Scraping package IDs to include in context
   * @param {string} params.model - Model to use (default: gpt-4o)
   * @param {string} params.clientContext - Optional client context
   * @param {string} params.projectContext - Optional project context
   * @param {boolean} params.useWebSearch - Whether to use web search (for compatible models)
   * @returns {Promise<Object>} - AI response
   */
  sendMessage: async (params) => {
    const {
      message,
      documentIds = [],
      packageIds = [],
      model = 'gpt-4o',
      clientContext = '',
      projectContext = '',
      useWebSearch = false
    } = params;

    // Create request object with all necessary parameters
    const requestData = {
      model,
      // The backend doesn't accept document_ids for the newsletter/generate endpoint
      // Only include document_ids if there are any to avoid the error
      ...(documentIds && documentIds.length > 0 ? { documents: documentIds } : {}),
      package_ids: packageIds, // This is the correct field name for the API
      prompt: message,
      client_context: clientContext,
      project_context: projectContext
    };

    // Log the actual request data that will be sent
    console.log('Request data being prepared:', requestData);

    // Debug log for package IDs in API client
    console.log('Chat API received package IDs:', packageIds);

    // Ensure package_ids is an array
    if (packageIds && !Array.isArray(packageIds)) {
      console.error('packageIds is not an array:', packageIds);
      requestData.package_ids = [];
    } else if (packageIds && packageIds.length > 0) {
      console.log('Using package IDs in request:', packageIds);

      // Verify that package IDs are strings, not objects
      if (packageIds.some(id => typeof id === 'object')) {
        console.warn('Found object in package IDs array, normalizing to string IDs');
        requestData.package_ids = packageIds.map(id => {
          if (typeof id === 'object' && id !== null) {
            return id._id || id.id;
          }
          return id;
        });
        console.log('Normalized package IDs:', requestData.package_ids);
      }
    }

    // Log the model being used
    console.log(`Using ${model || 'default'} model for chat`);

    // Add required parameters for web search with compatible models
    const webSearchCompatibleModels = ['gpt-4.1', 'gpt-4o', 'o3', 'o4-mini'];

    if (webSearchCompatibleModels.includes(model) && useWebSearch) {
      requestData.use_responses_api = true;
      requestData.use_web_search = true;
      requestData.web_search_preview = true;
      console.log(`Enabling web search for ${model}`);
    }

    // Add required parameter for Claude models
    if (model && model.includes('claude')) {
      requestData.use_anthropic = true;

      // Map newer Claude model IDs to the format that the backend expects
      // Store the original model name for logging
      const originalModel = model;

      // Map model names to the correct format
      if (model === 'claude-3-7-sonnet-20250219') {
        requestData.model = 'claude-3-sonnet-20240229'; // Use the compatible model name
      } else if (model === 'claude-3-5-sonnet-20241022') {
        requestData.model = 'claude-3-opus-20240229'; // Use the compatible model name
      } else {
        requestData.model = model; // Keep the original model name
      }

      console.log(`Enabling Anthropic API: mapped ${originalModel} to ${requestData.model}`);
    }

    // Final check of package_ids before sending
    console.log('Final package_ids in request:', requestData.package_ids);

    console.log('Sending chat message:', JSON.stringify(requestData, null, 2));

    try {
      // Use the same endpoint as newsletter generation since the backend
      // doesn't have a dedicated chat endpoint yet
      const finalRequestBody = JSON.stringify(requestData);
      console.log('Final request body as string:', finalRequestBody);

      const response = await apiRequest('/api/newsletter/generate', {
        method: 'POST',
        body: finalRequestBody,
      });

      console.log('Chat response received:', response);

      // Check if the response indicates no content was retrieved
      if (response.articles_count === 0 && requestData.package_ids && requestData.package_ids.length > 0) {
        console.warn('No articles were retrieved from the specified packages. This might indicate a retrieval issue.');
      }

      return response;
    } catch (error) {
      console.error('Chat request failed:', error);

      // Check if this is a 503 error (database offline)
      if (error.message.includes('Database is currently offline')) {
        // The apiRequest function already handles polling the health endpoint
        throw new Error('The database is currently offline. Please try again in a few moments.');
      }

      // For other errors, provide a more helpful message
      throw new Error(`Failed to generate chat response: ${error.message}`);
    }
  }
};

// Extend the newsletter API with the enhanced methods
Object.assign(newsletterApi, enhancedNewsletterApi);

/**
 * Projects API
 */
export const projectsApi = {
  /**
   * Get all projects
   * @returns {Promise<Array>} - List of projects
   */
  getAll: async () => {
    try {
      const projects = await apiRequest('/api/projects');

      // Check if we got an empty list
      if (Array.isArray(projects) && projects.length === 0) {
        console.log('No projects found');
      }

      return projects; // Already normalized by apiRequest
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Re-throw to let the component handle the error
      throw error;
    }
  },

  /**
   * Get a specific project
   * @param {string} id - Project ID
   * @returns {Promise<Object>} - Project
   */
  getById: async (id) => {
    try {
      return await apiRequest(`/api/projects/${id}`);
    } catch (error) {
      console.error(`Failed to fetch project ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new project
   * @param {Object} data - Project data
   * @returns {Promise<Object>} - Created project
   */
  create: async (data) => {
    console.log('Creating project with data:', data);

    try {
      const newProject = await apiRequest('/api/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      console.log('Successfully created project:', newProject);
      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  },

  /**
   * Update a project
   * @param {string} id - Project ID
   * @param {Object} data - Project data
   * @returns {Promise<Object>} - Updated project
   */
  update: async (id, data) => {
    console.log(`Updating project ${id} with data:`, data);

    try {
      const updatedProject = await apiRequest(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      console.log('Successfully updated project:', updatedProject);
      return updatedProject;
    } catch (error) {
      console.error(`Failed to update project ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a project
   * @param {string} id - Project ID
   * @returns {Promise<Object>} - Response
   */
  delete: async (id) => {
    console.log(`Deleting project ${id}`);

    try {
      const result = await apiRequest(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      console.log(`Successfully deleted project ${id}`);
      return result;
    } catch (error) {
      console.error(`Failed to delete project ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get project newsletter schedule
   * @param {string} id - Project ID
   * @returns {Promise<Object>} - Newsletter schedule
   */
  getSchedule: async (id) => {
    console.log(`Getting schedule for project ${id}`);

    try {
      const schedule = await apiRequest(`/api/projects/${id}/schedule`);
      console.log(`Successfully retrieved schedule for project ${id}:`, schedule);
      return schedule;
    } catch (error) {
      console.error(`Failed to get schedule for project ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update project newsletter schedule
   * @param {string} id - Project ID
   * @param {Object} data - Schedule data
   * @param {string} data.frequency - Schedule frequency (daily, weekly, monthly, custom)
   * @param {string} data.time - Schedule time (24-hour format, e.g., "09:00")
   * @param {Array<string>} data.days - Days for weekly/monthly schedules
   * @param {boolean} data.active - Whether scheduling is active
   * @returns {Promise<Object>} - Updated schedule
   */
  updateSchedule: async (id, data) => {
    console.log(`Updating schedule for project ${id} with data:`, data);

    try {
      const updatedSchedule = await apiRequest(`/api/projects/${id}/schedule`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      console.log(`Successfully updated schedule for project ${id}:`, updatedSchedule);
      return updatedSchedule;
    } catch (error) {
      console.error(`Failed to update schedule for project ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update project with newsletter schedule
   * @param {string} id - Project ID
   * @param {Object} data - Project data with newsletter_schedule
   * @returns {Promise<Object>} - Updated project
   */
  updateWithSchedule: async (id, data) => {
    console.log(`Updating project ${id} with schedule data:`, data);

    try {
      const updatedProject = await apiRequest(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      console.log(`Successfully updated project ${id} with schedule:`, updatedProject);
      return updatedProject;
    } catch (error) {
      console.error(`Failed to update project ${id} with schedule:`, error);
      throw error;
    }
  }
};

/**
 * Recipients API
 */
export const recipientsApi = {
  /**
   * Get all recipients for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} - List of recipients
   */
  getAll: async (projectId) => {
    try {
      const recipients = await apiRequest(`/api/projects/${projectId}/recipients`);

      // Check if we got an empty list
      if (Array.isArray(recipients) && recipients.length === 0) {
        console.log(`No recipients found for project ${projectId}`);
      }

      return recipients; // Already normalized by apiRequest
    } catch (error) {
      console.error(`Failed to fetch recipients for project ${projectId}:`, error);
      // Re-throw to let the component handle the error
      throw error;
    }
  },

  /**
   * Get a specific recipient
   * @param {string} id - Recipient ID
   * @returns {Promise<Object>} - Recipient
   */
  getById: async (id) => {
    try {
      return await apiRequest(`/api/recipients/${id}`);
    } catch (error) {
      console.error(`Failed to fetch recipient ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new recipient
   * @param {string} projectId - Project ID
   * @param {Object} data - Recipient data
   * @returns {Promise<Object>} - Created recipient
   */
  create: async (projectId, data) => {
    console.log(`Creating recipient for project ${projectId} with data:`, data);

    try {
      const newRecipient = await apiRequest(`/api/projects/${projectId}/recipients`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      console.log('Successfully created recipient:', newRecipient);
      return newRecipient;
    } catch (error) {
      console.error(`Failed to create recipient for project ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Update a recipient
   * @param {string} id - Recipient ID
   * @param {Object} data - Recipient data
   * @returns {Promise<Object>} - Updated recipient
   */
  update: async (id, data) => {
    console.log(`Updating recipient ${id} with data:`, data);

    try {
      const updatedRecipient = await apiRequest(`/api/recipients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      console.log('Successfully updated recipient:', updatedRecipient);
      return updatedRecipient;
    } catch (error) {
      console.error(`Failed to update recipient ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a recipient
   * @param {string} id - Recipient ID
   * @returns {Promise<Object>} - Response
   */
  delete: async (id) => {
    console.log(`Deleting recipient ${id}`);

    try {
      const result = await apiRequest(`/api/recipients/${id}`, {
        method: 'DELETE',
      });

      console.log(`Successfully deleted recipient ${id}`);
      return result;
    } catch (error) {
      console.error(`Failed to delete recipient ${id}:`, error);
      throw error;
    }
  },
};

/**
 * Newsletters Archive API
 */
export const newslettersArchiveApi = {
  /**
   * Get all newsletters for a project
   * @param {string} projectId - Project ID
   * @param {Object} options - Filter options
   * @param {string} options.personaId - Filter by persona ID
   * @param {string} options.recipientId - Filter by recipient ID
   * @param {string} options.status - Filter by status
   * @param {boolean} options.scheduled - Filter for scheduled newsletters
   * @returns {Promise<Array>} - List of newsletters
   */
  getAll: async (projectId, options = {}) => {
    try {
      // Build query parameters for filtering
      const queryParams = new URLSearchParams();
      if (options.personaId) queryParams.append('persona_id', options.personaId);
      if (options.recipientId) queryParams.append('recipient_id', options.recipientId);
      if (options.status) queryParams.append('status', options.status);
      if (options.scheduled) queryParams.append('scheduled', 'true');

      const queryString = queryParams.toString();
      const url = queryString
        ? `${API_BASE_URL}/api/projects/${projectId}/newsletters?${queryString}`
        : `${API_BASE_URL}/api/projects/${projectId}/newsletters`;

      console.log(`Fetching newsletters for project ${projectId} with filters:`, options);

      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch newsletters: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const newsletters = await response.json();

      // Check if we got an empty list
      if (Array.isArray(newsletters) && newsletters.length === 0) {
        console.log(`No newsletters found for project ${projectId} with filters:`, options);
      }

      return normalizeIds(newsletters);
    } catch (error) {
      console.error(`Failed to fetch newsletters for project ${projectId}:`, error);
      // Re-throw to let the component handle the error
      throw error;
    }
  },

  /**
   * Get a specific newsletter
   * @param {string} id - Newsletter ID
   * @param {boolean} full - Whether to get full details including persona and recipients
   * @returns {Promise<Object>} - Newsletter
   */
  getById: async (id, full = false) => {
    try {
      const url = full
        ? `${API_BASE_URL}/api/newsletters/${id}?full=true`
        : `${API_BASE_URL}/api/newsletters/${id}`;

      console.log(`Fetching newsletter ${id} with full=${full}`);

      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch newsletter: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const newsletter = await response.json();
      return normalizeIds(newsletter);
    } catch (error) {
      console.error(`Failed to fetch newsletter ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new newsletter
   * @param {string} projectId - Project ID
   * @param {Object} data - Newsletter data
   * @returns {Promise<Object>} - Created newsletter
   */
  create: async (projectId, data) => {
    console.log(`Creating newsletter for project ${projectId} with data:`, data);

    try {
      const newNewsletter = await apiRequest(`/api/projects/${projectId}/newsletters`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      console.log('Successfully created newsletter:', newNewsletter);
      return newNewsletter;
    } catch (error) {
      console.error(`Failed to create newsletter for project ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Update a newsletter
   * @param {string} id - Newsletter ID
   * @param {Object} data - Newsletter data
   * @returns {Promise<Object>} - Updated newsletter
   */
  update: async (id, data) => {
    console.log(`Updating newsletter ${id} with data:`, data);

    try {
      const updatedNewsletter = await apiRequest(`/api/newsletters/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      console.log('Successfully updated newsletter:', updatedNewsletter);
      return updatedNewsletter;
    } catch (error) {
      console.error(`Failed to update newsletter ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a newsletter
   * @param {string} id - Newsletter ID
   * @returns {Promise<Object>} - Response
   */
  delete: async (id) => {
    console.log(`Deleting newsletter ${id}`);

    try {
      const result = await apiRequest(`/api/newsletters/${id}`, {
        method: 'DELETE',
      });

      console.log(`Successfully deleted newsletter ${id}`);
      return result;
    } catch (error) {
      console.error(`Failed to delete newsletter ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get scheduled newsletters for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} - List of scheduled newsletters
   */
  getScheduled: async (projectId) => {
    try {
      const newsletters = await apiRequest(`/api/projects/${projectId}/newsletters/scheduled`);

      // Check if we got an empty list
      if (Array.isArray(newsletters) && newsletters.length === 0) {
        console.log(`No scheduled newsletters found for project ${projectId}`);
      }

      return newsletters; // Already normalized by apiRequest
    } catch (error) {
      console.error(`Failed to fetch scheduled newsletters for project ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Cancel a scheduled newsletter
   * @param {string} id - Newsletter ID
   * @returns {Promise<Object>} - Cancelled newsletter
   */
  cancel: async (id) => {
    console.log(`Cancelling newsletter ${id}`);

    try {
      const result = await apiRequest(`/api/newsletters/${id}/cancel`, {
        method: 'POST',
      });

      console.log(`Successfully cancelled newsletter ${id}`);
      return result;
    } catch (error) {
      console.error(`Failed to cancel newsletter ${id}:`, error);
      throw error;
    }
  },

  /**
   * Reschedule a newsletter
   * @param {string} id - Newsletter ID
   * @param {Object} data - Reschedule data
   * @param {string} data.scheduled_for - New scheduled date/time
   * @returns {Promise<Object>} - Rescheduled newsletter
   */
  reschedule: async (id, data) => {
    console.log(`Rescheduling newsletter ${id} to ${data.scheduled_for}`);

    try {
      const result = await apiRequest(`/api/newsletters/${id}/reschedule`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      console.log(`Successfully rescheduled newsletter ${id}`);
      return result;
    } catch (error) {
      console.error(`Failed to reschedule newsletter ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get newsletters by persona
   * @param {string} personaId - Persona ID
   * @returns {Promise<Array>} - List of newsletters
   */
  getByPersona: async (personaId) => {
    try {
      const newsletters = await apiRequest(`/api/personas/${personaId}/newsletters`);

      // Check if we got an empty list
      if (Array.isArray(newsletters) && newsletters.length === 0) {
        console.log(`No newsletters found for persona ${personaId}`);
      }

      return newsletters; // Already normalized by apiRequest
    } catch (error) {
      console.error(`Failed to fetch newsletters for persona ${personaId}:`, error);
      throw error;
    }
  },

  /**
   * Get newsletters by recipient
   * @param {string} recipientId - Recipient ID
   * @returns {Promise<Array>} - List of newsletters
   */
  getByRecipient: async (recipientId) => {
    try {
      const newsletters = await apiRequest(`/api/recipients/${recipientId}/newsletters`);

      // Check if we got an empty list
      if (Array.isArray(newsletters) && newsletters.length === 0) {
        console.log(`No newsletters found for recipient ${recipientId}`);
      }

      return newsletters; // Already normalized by apiRequest
    } catch (error) {
      console.error(`Failed to fetch newsletters for recipient ${recipientId}:`, error);
      throw error;
    }
  }
};

// Export all APIs
export default {
  scrapingPackages: scrapingPackagesApi,
  personas: personasApi,
  newsletter: newsletterApi,
  documents: documentsApi,
  health: healthApi,
  chat: chatApi,
  projects: projectsApi,
  recipients: recipientsApi,
  newslettersArchive: newslettersArchiveApi,
};
