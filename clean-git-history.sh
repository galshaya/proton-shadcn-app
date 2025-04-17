#!/bin/bash

# Make sure the script is executable
# chmod +x clean-git-history.sh

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Git History Cleaner ===${NC}"
echo -e "${BLUE}This script will help you remove sensitive information from your Git history${NC}"
echo ""

# Check if BFG is installed
if ! command -v bfg &> /dev/null; then
    echo -e "${RED}BFG Repo-Cleaner is not installed.${NC}"
    echo -e "${BLUE}You can install it using Homebrew:${NC}"
    echo -e "${BLUE}brew install bfg${NC}"
    exit 1
fi

# Create a backup of the repository
echo -e "${BLUE}Creating a backup of the repository...${NC}"
cd /Users/galshaya/Documents/GitHub
cp -r proton-shadcn-app proton-shadcn-app-backup
echo -e "${GREEN}Backup created at /Users/galshaya/Documents/GitHub/proton-shadcn-app-backup${NC}"
echo ""

# Create a file with patterns to replace
echo -e "${BLUE}Creating patterns file for sensitive information...${NC}"
cat > /Users/galshaya/Documents/GitHub/proton-shadcn-app/sensitive-patterns.txt << EOL
OPENAI_API_KEY=.*
CLAUDE_API_KEY=.*
MONGODB_URI=.*
EOL
echo -e "${GREEN}Patterns file created${NC}"
echo ""

# Run BFG to replace sensitive information
echo -e "${BLUE}Running BFG to replace sensitive information...${NC}"
cd /Users/galshaya/Documents/GitHub/proton-shadcn-app
bfg --replace-text sensitive-patterns.txt

# Clean up the repository
echo -e "${BLUE}Cleaning up the repository...${NC}"
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Remove the patterns file
echo -e "${BLUE}Removing patterns file...${NC}"
rm sensitive-patterns.txt

echo ""
echo -e "${GREEN}Git history cleaning completed!${NC}"
echo -e "${BLUE}Now you can try to push your changes again:${NC}"
echo -e "${BLUE}git push${NC}"
echo ""
echo -e "${RED}IMPORTANT: If you still encounter issues, you may need to force push:${NC}"
echo -e "${BLUE}git push --force-with-lease${NC}"
echo ""
echo -e "${RED}WARNING: Force pushing will overwrite the remote history. Make sure your team is aware of this.${NC}"
