#!/bin/bash

# Make sure the script is executable
# chmod +x test-api-connection.sh

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Proton Frontend API Connection Test ===${NC}"
echo -e "${BLUE}Testing connection to API at http://localhost:5000${NC}"
echo ""

# Check if the API is running
echo -e "${BLUE}Checking if API is running...${NC}"
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo -e "${GREEN}API is running!${NC}"
else
    echo -e "${RED}API is not running. Please start the API server first.${NC}"
    echo -e "${BLUE}Run: cd /Users/galshaya/Documents/GitHub/proton_backend && python app.py${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Installing node-fetch if needed...${NC}"
npm install --no-save node-fetch@2 > /dev/null 2>&1

echo ""
echo -e "${BLUE}Running API connection test...${NC}"
echo ""

# Run the Node.js test script
node test-api-connection.js

# Check if the test script succeeded
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}Test completed!${NC}"
    echo ""
    echo -e "${BLUE}You can now run the Next.js app:${NC}"
    echo -e "${BLUE}npm run dev${NC}"
else
    echo ""
    echo -e "${RED}Test failed.${NC}"
    echo -e "${BLUE}Please check the output above for details.${NC}"
    exit 1
fi
