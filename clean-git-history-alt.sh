#!/bin/bash

# Make sure the script is executable
# chmod +x clean-git-history-alt.sh

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Git History Cleaner (Alternative Method) ===${NC}"
echo -e "${BLUE}This script will help you remove sensitive information from your Git history${NC}"
echo ""

# Create a backup of the repository
echo -e "${BLUE}Creating a backup of the repository...${NC}"
cd /Users/galshaya/Documents/GitHub
cp -r proton-shadcn-app proton-shadcn-app-backup
echo -e "${GREEN}Backup created at /Users/galshaya/Documents/GitHub/proton-shadcn-app-backup${NC}"
echo ""

# Run Git filter-branch to remove .env file from history
echo -e "${BLUE}Running Git filter-branch to remove .env file from history...${NC}"
cd /Users/galshaya/Documents/GitHub/proton-shadcn-app
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up the repository
echo -e "${BLUE}Cleaning up the repository...${NC}"
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo -e "${GREEN}Git history cleaning completed!${NC}"
echo -e "${BLUE}Now you can try to push your changes again:${NC}"
echo -e "${BLUE}git push${NC}"
echo ""
echo -e "${RED}IMPORTANT: If you still encounter issues, you may need to force push:${NC}"
echo -e "${BLUE}git push --force-with-lease${NC}"
echo ""
echo -e "${RED}WARNING: Force pushing will overwrite the remote history. Make sure your team is aware of this.${NC}"
