/**
 * Proton API Client
 * 
 * This module provides functions for interacting with the Proton API.
 */

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Parse response
    const data = await response.json();
    
    // Check for error response
    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
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
  create: (data) => apiRequest('/api/scraping-packages', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  /**
   * Update a scraping package
   * @param {string} id - Package ID
   * @param {Object} data - Package data
   * @returns {Promise<Object>} - Updated package
   */
  update: (id, data) => apiRequest(`/api/scraping-packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  /**
   * Delete a scraping package
   * @param {string} id - Package ID
   * @returns {Promise<Object>} - Response
   */
  delete: (id) => apiRequest(`/api/scraping-packages/${id}`, {
    method: 'DELETE',
  }),
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
  create: (data) => apiRequest('/api/personas', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  /**
   * Update a persona
   * @param {string} id - Persona ID
   * @param {Object} data - Persona data
   * @returns {Promise<Object>} - Updated persona
   */
  update: (id, data) => apiRequest(`/api/personas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
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
  generate: (data) => apiRequest('/api/newsletter/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
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

// Export all APIs
export default {
  scrapingPackages: scrapingPackagesApi,
  personas: personasApi,
  newsletter: newsletterApi,
  health: healthApi,
};
