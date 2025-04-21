/**
 * API Test Utility
 *
 * This module provides functions for directly testing the API endpoints
 * without going through the UI. It's useful for debugging API issues.
 */

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Test creating a scraping package
 */
export async function testCreatePackage() {
  try {
    console.log('Testing API: Create Package');

    const testData = {
      name: `Test Package ${new Date().toISOString().slice(0, 16)}`,
      description: 'This is a test package created via API test',
      status: 'active',
      schedule_interval: '1h',
      max_articles_per_run: 10,
      calculate_embeddings: true,
      extract_entities: true,
      summarize: true,
      rss_feeds: [
        {
          name: 'Test Feed',
          url: 'https://example.com/rss',
          type: 'rss'
        }
      ]
    };

    console.log('Sending data:', testData);

    // Log the request details
    console.log('Request URL:', `${API_BASE_URL}/api/scraping-packages`);
    console.log('Request method:', 'POST');
    console.log('Request headers:', { 'Content-Type': 'application/json' });
    console.log('Request body:', JSON.stringify(testData, null, 2));

    const response = await fetch(`${API_BASE_URL}/api/scraping-packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);

      // Check for error messages in the response
      if (data.error) {
        console.error('API returned an error:', data.error);
      }
    } catch (e) {
      console.log('Could not parse response as JSON');
    }

    return {
      success: response.ok,
      status: response.status,
      data: data || responseText
    };
  } catch (error) {
    console.error('API test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test updating a scraping package
 */
export async function testUpdatePackage(id) {
  try {
    console.log(`Testing API: Update Package ${id}`);

    const testData = {
      name: `Updated Package ${new Date().toISOString().slice(0, 16)}`,
      description: 'This package was updated via API test',
      status: 'active',
      schedule_interval: '1h',
      max_articles_per_run: 10,
      calculate_embeddings: true,
      extract_entities: true,
      summarize: true,
      rss_feeds: [
        {
          name: 'Updated Feed',
          url: 'https://example.com/updated-rss',
          type: 'rss'
        }
      ]
    };

    console.log('Sending data:', testData);

    const response = await fetch(`${API_BASE_URL}/api/scraping-packages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (e) {
      console.log('Could not parse response as JSON');
    }

    return {
      success: response.ok,
      status: response.status,
      data: data || responseText
    };
  } catch (error) {
    console.error('API test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test deleting a scraping package
 */
export async function testDeletePackage(id) {
  try {
    console.log(`Testing API: Delete Package ${id}`);

    const response = await fetch(`${API_BASE_URL}/api/scraping-packages/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (e) {
      console.log('Could not parse response as JSON');
    }

    return {
      success: response.ok,
      status: response.status,
      data: data || responseText
    };
  } catch (error) {
    console.error('API test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test getting all scraping packages
 */
export async function testGetPackages() {
  try {
    console.log('Testing API: Get All Packages');

    const response = await fetch(`${API_BASE_URL}/api/scraping-packages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Found', data.length, 'packages');
    } catch (e) {
      console.log('Could not parse response as JSON');
    }

    return {
      success: response.ok,
      status: response.status,
      data: data || responseText
    };
  } catch (error) {
    console.error('API test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
