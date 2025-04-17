/**
 * Test script to verify API connection
 * 
 * Run with: node test-api-connection.js
 */

// Import the fetch API for Node.js
const fetch = require('node-fetch');

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Test the health endpoint
async function testHealthEndpoint() {
  try {
    console.log(`Testing API health endpoint at ${API_BASE_URL}/api/health...`);
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Health check successful!');
    console.log('Response:', JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

// Test the scraping packages endpoint
async function testScrapingPackagesEndpoint() {
  try {
    console.log(`\nTesting scraping packages endpoint at ${API_BASE_URL}/api/scraping-packages...`);
    const response = await fetch(`${API_BASE_URL}/api/scraping-packages`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Scraping packages fetch successful!');
    console.log(`Found ${data.length} packages`);
    if (data.length > 0) {
      console.log('First package:', JSON.stringify(data[0], null, 2));
    }
    return true;
  } catch (error) {
    console.error('Scraping packages fetch failed:', error.message);
    return false;
  }
}

// Test the personas endpoint
async function testPersonasEndpoint() {
  try {
    console.log(`\nTesting personas endpoint at ${API_BASE_URL}/api/personas...`);
    const response = await fetch(`${API_BASE_URL}/api/personas`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Personas fetch successful!');
    console.log(`Found ${data.length} personas`);
    if (data.length > 0) {
      console.log('First persona:', JSON.stringify(data[0], null, 2));
    }
    return true;
  } catch (error) {
    console.error('Personas fetch failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== API Connection Test ===\n');
  
  const healthCheck = await testHealthEndpoint();
  const packagesCheck = await testScrapingPackagesEndpoint();
  const personasCheck = await testPersonasEndpoint();
  
  console.log('\n=== Test Summary ===');
  console.log(`Health Endpoint: ${healthCheck ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Scraping Packages Endpoint: ${packagesCheck ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Personas Endpoint: ${personasCheck ? '✅ PASS' : '❌ FAIL'}`);
  
  if (healthCheck && packagesCheck && personasCheck) {
    console.log('\n✅ All tests passed! API connection is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please check the API server and try again.');
  }
}

// Run the tests
runTests();
