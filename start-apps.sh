#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Events Application...${NC}"
echo -e "${YELLOW}This will start both Spring Boot backend and Angular frontend${NC}"
echo ""

# Function to cleanup background processes on script exit
cleanup() {
    echo -e "\n${YELLOW}Stopping all applications...${NC}"
    kill $SPRING_PID $ANGULAR_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start Spring Boot application in background
echo -e "${GREEN}Starting Spring Boot backend...${NC}"
mvn spring-boot:run > spring-boot.log 2>&1 &
SPRING_PID=$!

# Wait a moment for Spring Boot to start
sleep 5

# Start Angular application in background
echo -e "${GREEN}Starting Angular frontend...${NC}"
ng serve > angular.log 2>&1 &
ANGULAR_PID=$!

echo ""
echo -e "${GREEN}Applications are starting...${NC}"
echo -e "${BLUE}Spring Boot backend:${NC} http://localhost:8080"
echo -e "${BLUE}Angular frontend:${NC} http://localhost:4200"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both applications${NC}"
echo ""

# Wait for both processes
wait $SPRING_PID $ANGULAR_PID 