#!/bin/bash

# Events Application Test Runner
# This script runs all tests for both frontend and backend

set -e  # Exit on any error

echo "🎯 Events Application Test Suite"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Java is installed
check_java() {
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed or not in PATH"
        exit 1
    fi
    print_success "Java found: $(java -version 2>&1 | head -n 1)"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed or not in PATH"
        exit 1
    fi
    print_success "Node.js found: $(node --version)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed or not in PATH"
        exit 1
    fi
    print_success "npm found: $(npm --version)"
}

# Check if Maven is installed
check_maven() {
    if ! command -v mvn &> /dev/null; then
        print_error "Maven is not installed or not in PATH"
        exit 1
    fi
    print_success "Maven found: $(mvn --version | head -n 1)"
}

# Run backend tests
run_backend_tests() {
    print_status "Running backend tests..."
    
    if [ ! -f "pom.xml" ]; then
        print_error "pom.xml not found. Are you in the correct directory?"
        exit 1
    fi
    
    # Clean and install dependencies
    print_status "Installing backend dependencies..."
    mvn clean install -DskipTests
    
    # Run tests
    print_status "Executing backend tests..."
    mvn test
    
    if [ $? -eq 0 ]; then
        print_success "Backend tests completed successfully!"
    else
        print_error "Backend tests failed!"
        exit 1
    fi
}

# Run frontend tests
run_frontend_tests() {
    print_status "Running frontend tests..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Run tests
    print_status "Executing frontend tests..."
    npm test -- --watch=false --browsers=ChromeHeadless --single-run=true
    
    if [ $? -eq 0 ]; then
        print_success "Frontend tests completed successfully!"
    else
        print_error "Frontend tests failed!"
        exit 1
    fi
}

# Run tests with coverage
run_tests_with_coverage() {
    print_status "Running tests with coverage..."
    
    # Backend coverage
    print_status "Generating backend coverage report..."
    mvn test jacoco:report
    
    # Frontend coverage
    print_status "Generating frontend coverage report..."
    npm run test:coverage 2>/dev/null || npm test -- --coverage --watch=false --browsers=ChromeHeadless --single-run=true
    
    print_success "Coverage reports generated!"
}

# Main execution
main() {
    echo ""
    print_status "Checking prerequisites..."
    
    # Check all required tools
    check_java
    check_node
    check_npm
    check_maven
    
    echo ""
    print_status "Starting test execution..."
    
    # Parse command line arguments
    case "${1:-all}" in
        "backend")
            run_backend_tests
            ;;
        "frontend")
            run_frontend_tests
            ;;
        "coverage")
            run_tests_with_coverage
            ;;
        "all")
            run_backend_tests
            echo ""
            run_frontend_tests
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [option]"
            echo ""
            echo "Options:"
            echo "  backend   - Run only backend tests"
            echo "  frontend  - Run only frontend tests"
            echo "  coverage  - Run tests with coverage reports"
            echo "  all       - Run all tests (default)"
            echo "  help      - Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0              # Run all tests"
            echo "  $0 backend      # Run only backend tests"
            echo "  $0 frontend     # Run only frontend tests"
            echo "  $0 coverage     # Run tests with coverage"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
    
    echo ""
    print_success "All tests completed successfully! 🎉"
    echo ""
    print_status "Test Summary:"
    echo "  ✅ Backend: Spring Boot + JUnit 5 + Mockito"
    echo "  ✅ Frontend: Angular + Jasmine + Karma"
    echo "  ✅ Coverage: 80% threshold configured"
    echo ""
}

# Run main function with all arguments
main "$@" 