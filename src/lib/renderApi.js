/**
 * Render.com API Client
 * 
 * This module provides functions for interacting with the Render.com API.
 */

// API key should be stored in environment variables
const RENDER_API_KEY = process.env.NEXT_PUBLIC_RENDER_API_KEY;

/**
 * Trigger a manual deploy of a service
 * @param {string} serviceId - The ID of the service to deploy
 * @returns {Promise<Object>} - Response from the API
 */
export async function triggerDeploy(serviceId) {
  if (!RENDER_API_KEY) {
    throw new Error('Render API key is not configured');
  }

  if (!serviceId) {
    throw new Error('Service ID is required');
  }

  try {
    const response = await fetch(`https://api.render.com/v1/services/${serviceId}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to trigger deploy: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error triggering Render deploy:', error);
    throw error;
  }
}

/**
 * Trigger a cron job service on Render.com
 * This is a simplified approach that just triggers a new deploy of the service
 * @param {string} serviceId - The ID of the cron job service
 * @returns {Promise<Object>} - Response from the API
 */
export async function triggerCronJob(serviceId) {
  return triggerDeploy(serviceId);
}
