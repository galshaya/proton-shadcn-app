/**
 * Proton API Client
 *
 * This module provides functions for interacting with the Proton API.
 */

// Base URL for API requests - updated to use the deployed API on Render.com
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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

    // Check for error response
    if (!response.ok) {
      throw new Error(data.error || data.message || `API error: ${response.status}`);
    }

    return data;
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
  getAll: () => apiRequest('/api/scraping-packages'),

  /**
   * Get a specific scraping package
   * @param {string} id - Package ID
   * @returns {Promise<Object>} - Scraping package
   */
  getById: (id) => apiRequest(`/api/scraping-packages/${id}`),

  /**
   * Create a new scraping package
   * @param {Object} data - Package data
   * @returns {Promise<Object>} - Created package
   */
  create: (data) => {
    // Log the data being sent
    console.log('Creating package with data:', data);

    // Ensure both sources and rss_feeds are included for compatibility
    const apiData = {
      ...data,
      sources: data.sources || data.rss_feeds || [],
      rss_feeds: data.sources || data.rss_feeds || []
    };

    console.log('Transformed API data for new package:', apiData);

    return apiRequest('/api/scraping-packages', {
      method: 'POST',
      body: JSON.stringify(apiData),
    });
  },

  /**
   * Update a scraping package
   * @param {string} id - Package ID
   * @param {Object} data - Package data
   * @returns {Promise<Object>} - Updated package
   */
  update: (id, data) => {
    // Log the data being sent
    console.log(`Updating package ${id} with data:`, data);

    // Ensure both sources and rss_feeds are included for compatibility
    const apiData = {
      ...data,
      sources: data.sources || data.rss_feeds || [],
      rss_feeds: data.sources || data.rss_feeds || []
    };

    console.log(`Transformed API data for package ${id}:`, apiData);

    return apiRequest(`/api/scraping-packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apiData),
    });
  },

  /**
   * Delete a scraping package
   * @param {string} id - Package ID
   * @returns {Promise<Object>} - Response
   */
  delete: (id) => {
    // Log the delete operation
    console.log(`Deleting package ${id}`);

    return apiRequest(`/api/scraping-packages/${id}`, {
      method: 'DELETE',
    });
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
  getAll: () => apiRequest('/api/personas'),

  /**
   * Get a specific persona
   * @param {string} id - Persona ID
   * @returns {Promise<Object>} - Persona
   */
  getById: (id) => apiRequest(`/api/personas/${id}`),

  /**
   * Create a new persona
   * @param {Object} data - Persona data
   * @returns {Promise<Object>} - Created persona
   */
  create: (data) => {
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

    return apiRequest('/api/personas', {
      method: 'POST',
      body: JSON.stringify(apiData),
    });
  },

  /**
   * Update a persona
   * @param {string} id - Persona ID
   * @param {Object} data - Persona data
   * @returns {Promise<Object>} - Updated persona
   */
  update: (id, data) => {
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

    return apiRequest(`/api/personas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apiData),
    });
  },

  /**
   * Delete a persona
   * @param {string} id - Persona ID
   * @returns {Promise<Object>} - Response
   */
  delete: (id) => {
    console.log(`Deleting persona ${id}`);

    return apiRequest(`/api/personas/${id}`, {
      method: 'DELETE',
    });
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
      if (requestData.model === 'claude-3-7-sonnet-20250219') {
        // Try the latest model first, but provide a fallback
        try {
          console.log('Trying latest Claude 3.7 Sonnet model');
          requestData.claude_model = 'claude-3-7-sonnet-20250219';
        } catch (error) {
          console.log('Falling back to Claude 3 Sonnet');
          requestData.model = 'claude-3-sonnet-20240229';
        }
      } else if (requestData.model === 'claude-3-5-sonnet-20241022') {
        // Try the latest model first, but provide a fallback
        try {
          console.log('Trying latest Claude 3.5 Sonnet model');
          requestData.claude_model = 'claude-3-5-sonnet-20241022';
        } catch (error) {
          console.log('Falling back to Claude 3 Opus');
          requestData.model = 'claude-3-opus-20240229';
        }
      }

      console.log('Enabling Anthropic API for Claude model:', requestData.model);
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
  getAll: () => apiRequest('/api/documents'),

  /**
   * Get a specific document
   * @param {string} id - Document ID
   * @returns {Promise<Object>} - Document metadata
   */
  getById: (id) => apiRequest(`/api/documents/${id}`),

  /**
   * Get document content
   * @param {string} id - Document ID
   * @returns {Promise<Object>} - Document content
   */
  getContent: (id) => apiRequest(`/api/documents/${id}/content`),

  /**
   * Download document
   * @param {string} id - Document ID
   * @returns {Promise<Object>} - Document binary data
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

      return await response.json();
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
  delete: (id) => apiRequest(`/api/documents/${id}`, {
    method: 'DELETE',
  }),
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
      document_ids: documentIds,
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
      if (model === 'claude-3-7-sonnet-20250219') {
        // Try the latest model first, but provide a fallback
        try {
          console.log('Trying latest Claude 3.7 Sonnet model');
          requestData.claude_model = 'claude-3-7-sonnet-20250219';
        } catch (error) {
          console.log('Falling back to Claude 3 Sonnet');
          requestData.model = 'claude-3-sonnet-20240229';
        }
      } else if (model === 'claude-3-5-sonnet-20241022') {
        // Try the latest model first, but provide a fallback
        try {
          console.log('Trying latest Claude 3.5 Sonnet model');
          requestData.claude_model = 'claude-3-5-sonnet-20241022';
        } catch (error) {
          console.log('Falling back to Claude 3 Opus');
          requestData.model = 'claude-3-opus-20240229';
        }
      }

      console.log('Enabling Anthropic API for Claude model:', requestData.model);
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
      document_ids: documentIds,
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
      if (model === 'claude-3-7-sonnet-20250219') {
        // Try the latest model first, but provide a fallback
        try {
          console.log('Trying latest Claude 3.7 Sonnet model');
          requestData.claude_model = 'claude-3-7-sonnet-20250219';
        } catch (error) {
          console.log('Falling back to Claude 3 Sonnet');
          requestData.model = 'claude-3-sonnet-20240229';
        }
      } else if (model === 'claude-3-5-sonnet-20241022') {
        // Try the latest model first, but provide a fallback
        try {
          console.log('Trying latest Claude 3.5 Sonnet model');
          requestData.claude_model = 'claude-3-5-sonnet-20241022';
        } catch (error) {
          console.log('Falling back to Claude 3 Opus');
          requestData.model = 'claude-3-opus-20240229';
        }
      }

      console.log('Enabling Anthropic API for Claude model:', requestData.model);
    }

    // Final check of package_ids before sending
    console.log('Final package_ids in request:', requestData.package_ids);

    console.log('Sending chat message:', JSON.stringify(requestData, null, 2));

    // Use the same endpoint as newsletter generation since the backend
    // doesn't have a dedicated chat endpoint yet
    const finalRequestBody = JSON.stringify(requestData);
    console.log('Final request body as string:', finalRequestBody);

    return apiRequest('/api/newsletter/generate', {
      method: 'POST',
      body: finalRequestBody,
    });
  }
};

// Extend the newsletter API with the enhanced methods
Object.assign(newsletterApi, enhancedNewsletterApi);

// Export all APIs
export default {
  scrapingPackages: scrapingPackagesApi,
  personas: personasApi,
  newsletter: newsletterApi,
  documents: documentsApi,
  health: healthApi,
  chat: chatApi,
};
