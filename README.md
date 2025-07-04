# Events Application

This project is a full-stack events management application built with a Java (Spring Boot) backend and an Angular frontend.

## Project Structure

- **Backend:** Java (Spring Boot) - located in `src/main/java/com/example/eventsapp/`
- **Frontend:** Angular - located in `events-frontend/` and `src/app/`

## Features
- Event listing and details
- Category management
- Admin panel
- Real-time chat

## Prerequisites
- Java 17 or later
- Node.js (v16 or later recommended)
- npm (comes with Node.js)
- Angular CLI (install with `npm install -g @angular/cli`)

## Backend Setup (Spring Boot)

1. **Navigate to the project root:**
   ```sh
   cd /path/to/events-backend
   ```
2. **Build and run the backend:**
   ```sh
   ./mvnw spring-boot:run
   ```
   Or, if you have Maven installed globally:
   ```sh
   mvn spring-boot:run
   ```
3. The backend will start on [http://localhost:8080](http://localhost:8080) by default.

## Frontend Setup (Angular)

1. **Navigate to the frontend directory:**
   ```sh
   cd events-frontend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run the Angular app:**
   ```sh
   ng serve
   ```
4. The frontend will be available at [http://localhost:4200](http://localhost:4200) by default.

## Running Tests

- **Backend tests:**
  ```sh
  mvn test
  ```
- **Frontend tests:**
  ```sh
  cd events-frontend
  ng test
  ```

## Configuration
- Backend configuration: `src/main/resources/application.properties`
- Frontend configuration: `events-frontend/src/environments/`

## License

This project is licensed under the MIT License. 