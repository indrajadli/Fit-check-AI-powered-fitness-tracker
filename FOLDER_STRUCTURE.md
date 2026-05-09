# Project Folder Structure Guide — FitCheck

This guide explains how the FitCheck project is organized and what each folder is responsible for.

---

## 1. Root Directory (`/FITCHECK`)
The main container for both the frontend and backend.
- **`/backend`**: The Spring Boot Java application (The Brain).
- **`/frontend`**: The React/Vite application (The Face).
- **`/data`**: Contains the `workoutdb.mv.db` file (The Memory).
- **`*.md`**: Documentation guides (Database, AI, Auth).

---

## 2. Backend Structure (`/backend`)
Follows standard Maven and Spring Boot patterns.

### `src/main/java/com/workout`
- **`/ai`**: Logic for communicating with Google Gemini/OpenAI.
- **`/auth`**: Security system, JWT handling, and User Login/Registration.
- **`/exercise`**: Management of the Exercise Library master data.
- **`/workout`**: Logic for sessions, sets, and volume calculations.
- **`/common`**: Shared utilities like Global Error Handling or DTOs.
- **`WorkoutTrackerApplication.java`**: The starting point of the server.

### `src/main/resources`
- **`application.yml`**: Main configuration (API Keys, DB connection, JWT secrets).
- **`data.sql`**: The seeding script that populates your initial exercise list.

---

## 3. Frontend Structure (`/frontend`)
Built with React, Vite, and Tailwind CSS.

### `src/`
- **`/pages`**: Full-screen views (Dashboard, Login, ExerciseDetail, Profile).
- **`/components`**: Reusable UI parts (Navbar, Sidebar, WorkoutCard, AI ChatBox).
- **`/api`**: Centralized Axios configuration for talking to the backend.
- **`/context`**: Global state management (e.g., `AuthContext` to keep you logged in).
- **`/hooks`**: Custom React logic (e.g., `useActiveWorkout`).
- **`/assets`**: Static images and icons.

### Key Files
- **`App.jsx`**: The main router that defines all the pages in the app.
- **`main.jsx`**: The entry point that renders the React app into the HTML.
- **`index.css`**: Global styles and Tailwind configuration.

---

## 4. Why this structure?
- **Separation of Concerns**: The frontend only handles the UI, and the backend only handles the data. This makes it easy to fix bugs in one without breaking the other.
- **Package by Feature**: In the backend, we group by "Feature" (e.g., all `ai` code is together). This makes it much easier to find logic compared to grouping by "Type" (putting all controllers in one folder).
- **Scalability**: This structure allows the project to grow. If we want to add a "Social" feature, we just create a new `/social` folder in both frontend and backend.
