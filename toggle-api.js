#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define API URLs
const LOCAL_API_URL = 'http://localhost:5001';
const REMOTE_API_URL = 'https://proton-api-3k6g.onrender.com';

// Path to .env.local file
const envFilePath = path.join(process.cwd(), '.env.local');

// Read the current .env.local file
fs.readFile(envFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading .env.local file:', err);
    return;
  }

  // Check which URL is currently in use
  const isUsingLocalAPI = data.includes(`NEXT_PUBLIC_API_URL=${LOCAL_API_URL}`);
  
  // Prepare the new content
  let newContent;
  if (isUsingLocalAPI) {
    // Switch to remote API
    newContent = data.replace(`NEXT_PUBLIC_API_URL=${LOCAL_API_URL}`, `NEXT_PUBLIC_API_URL=${REMOTE_API_URL}`);
    console.log(`Switching to REMOTE API: ${REMOTE_API_URL}`);
  } else {
    // Switch to local API
    newContent = data.replace(`NEXT_PUBLIC_API_URL=${REMOTE_API_URL}`, `NEXT_PUBLIC_API_URL=${LOCAL_API_URL}`);
    console.log(`Switching to LOCAL API: ${LOCAL_API_URL}`);
  }

  // Write the updated content back to the file
  fs.writeFile(envFilePath, newContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to .env.local file:', err);
      return;
    }
    console.log('API URL updated successfully!');
    console.log('Restart your Next.js server for changes to take effect.');
  });
});
