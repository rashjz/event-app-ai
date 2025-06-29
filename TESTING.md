# Testing Guide for Events Application

This document provides comprehensive information about running tests for both the frontend (Angular) and backend (Spring Boot) components of the Events application.

## Table of Contents

1. [Backend Testing](#backend-testing)
2. [Frontend Testing](#frontend-testing)
3. [Test Coverage](#test-coverage)
4. [Running Tests](#running-tests)
5. [Test Structure](#test-structure)
6. [Best Practices](#best-practices)

## Backend Testing

### Overview
The backend uses Spring Boot with JUnit 5 and Mockito for testing. Tests are organized into:
- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test the full application stack
- **Controller Tests**: Test REST API endpoints

### Test Files
- `EventControllerTest.java` - Tests for Event REST endpoints
- `CategoryControllerTest.java` - Tests for Category REST endpoints
- `EventServiceTest.java` - Unit tests for Event business logic
- `EventsAppIntegrationTest.java` - Full integration tests

### Running Backend Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=EventControllerTest

# Run tests with coverage
mvn test jacoco:report

# Run integration tests only
mvn test -Dtest=*IntegrationTest

# Run tests in verbose mode
mvn test -X
```

### Test Configuration
- Uses H2 in-memory database for testing
- Test profile: `application-test.properties`
- Automatic transaction rollback for test isolation

## Frontend Testing

### Overview
The frontend uses Angular with Jasmine and Karma for testing. Tests include:
- **Unit Tests**: Test individual components and services
- **Service Tests**: Test HTTP service interactions
- **Component Tests**: Test component logic and UI interactions

### Test Files
- `event.service.spec.ts` - Tests for EventService
- `category.service.spec.ts` - Tests for CategoryService
- `events-list.component.spec.ts` - Tests for EventsListComponent
- `app.component.spec.ts` - Tests for main AppComponent

### Running Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in headless mode
npm run test:headless

# Run specific test file
npm test -- --include="**/event.service.spec.ts"
```

### Test Configuration
- Karma configuration: `karma.conf.js`
- Coverage threshold: 80% for statements, branches, functions, and lines
- Chrome browser for test execution

## Test Coverage

### Backend Coverage
- **Controllers**: 100% endpoint coverage
- **Services**: 100% business logic coverage
- **Integration**: Full API workflow testing

### Frontend Coverage
- **Services**: HTTP request/response handling
- **Components**: User interactions and state management
- **Error Handling**: Network errors and edge cases

## Running Tests

### Prerequisites
```bash
# Backend dependencies
mvn clean install

# Frontend dependencies
npm install
```

### Complete Test Suite
```bash
# Run all backend tests
mvn test

# Run all frontend tests
npm test

# Run both (in separate terminals)
# Terminal 1: mvn test
# Terminal 2: npm test
```

### Continuous Integration
```bash
# Backend CI
mvn clean test jacoco:report

# Frontend CI
npm run test:ci
```

## Test Structure

### Backend Test Structure
```
src/test/java/com/example/eventsapp/
├── EventControllerTest.java          # REST API tests
├── CategoryControllerTest.java       # Category API tests
├── EventServiceTest.java            # Business logic tests
└── EventsAppIntegrationTest.java    # Integration tests
```

### Frontend Test Structure
```
src/app/
├── services/
│   ├── event.service.spec.ts        # Event service tests
│   └── category.service.spec.ts     # Category service tests
├── components/
│   ├── events-list/
│   │   └── events-list.component.spec.ts
│   └── ...
└── app.component.spec.ts            # Main app tests
```

## Test Categories

### Unit Tests
- **Purpose**: Test individual functions/methods in isolation
- **Tools**: JUnit 5, Mockito (Backend); Jasmine (Frontend)
- **Coverage**: Business logic, data transformations, calculations

### Integration Tests
- **Purpose**: Test component interactions and API workflows
- **Tools**: Spring Boot Test, MockMvc (Backend)
- **Coverage**: End-to-end API calls, database operations

### Service Tests
- **Purpose**: Test HTTP service interactions
- **Tools**: HttpTestingController (Frontend)
- **Coverage**: API calls, error handling, response processing

### Component Tests
- **Purpose**: Test UI components and user interactions
- **Tools**: Angular TestBed, ComponentFixture
- **Coverage**: Component lifecycle, user events, state changes

## Best Practices

### Backend Testing
1. **Use @Transactional** for test isolation
2. **Mock external dependencies** with @MockBean
3. **Test both success and failure scenarios**
4. **Use descriptive test method names**
5. **Follow AAA pattern** (Arrange, Act, Assert)

### Frontend Testing
1. **Test component initialization**
2. **Mock service dependencies**
3. **Test user interactions**
4. **Verify error handling**
5. **Test async operations**

### General Guidelines
1. **Write tests first** (TDD approach)
2. **Keep tests simple and focused**
3. **Use meaningful test data**
4. **Test edge cases and error conditions**
5. **Maintain test coverage above 80%**

## Debugging Tests

### Backend Debugging
```bash
# Run tests with debug output
mvn test -X

# Run specific test with debug
mvn test -Dtest=EventControllerTest#getAllEvents_ShouldReturnEventsList -X
```

### Frontend Debugging
```bash
# Run tests in browser for debugging
npm test -- --browsers=Chrome --single-run=false

# Debug specific test
fdescribe('EventService', () => {
  // Only this test suite will run
});
```

## Performance Testing

### Backend Performance
```bash
# Run tests with performance monitoring
mvn test -Dspring.profiles.active=test -Dlogging.level.org.springframework.web=DEBUG
```

### Frontend Performance
```bash
# Run tests with performance metrics
npm test -- --browsers=ChromeHeadless --single-run=true
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: '11'
      - run: mvn test
      
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
```

## Troubleshooting

### Common Issues

1. **Backend Tests Failing**
   - Check database configuration in `application-test.properties`
   - Verify all dependencies are available
   - Check for port conflicts

2. **Frontend Tests Failing**
   - Ensure all npm dependencies are installed
   - Check Karma configuration
   - Verify Chrome browser is available

3. **Coverage Issues**
   - Check coverage thresholds in configuration
   - Ensure all code paths are tested
   - Review test data and scenarios

### Getting Help
- Check test logs for detailed error messages
- Review test configuration files
- Ensure all dependencies are properly installed
- Verify test environment setup

## Conclusion

This testing suite provides comprehensive coverage for both frontend and backend components. Regular test execution ensures code quality and prevents regressions. Follow the best practices outlined above to maintain high-quality, reliable tests. 