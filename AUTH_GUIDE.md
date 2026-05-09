# Authentication Guide — FitCheck

This guide explains how security and user authentication work in the FitCheck project using **Spring Security** and **JSON Web Tokens (JWT)**.

## 1. Overview
FitCheck uses **Stateless Authentication**. This means the server does not store "sessions" in memory. Instead, every request from the frontend must include a valid **JWT (Token)** to prove who the user is.

---

## 2. Key Components (The Security Team)

### `SecurityConfig.java` (The Gatekeeper)
Located in `com.workout.auth.config`.
- Defines which URLs are public (e.g., `/api/auth/**`, `/h2-console/**`).
- Defines which URLs require a login (e.g., `/api/workouts/**`, `/api/exercises/**`).
- Disables CSRF (since we use tokens) and sets the session policy to `STATELESS`.

### `JwtUtil.java` (The Locksmith)
Located in `com.workout.auth.service`.
- **Generates Tokens**: Creates a long string (the JWT) containing the user's username and an expiration date.
- **Validates Tokens**: Checks if a token is tampered with or expired using a secret key.
- **Extracts Info**: Pulls the username out of a token so the app knows who is making the request.

### `JwtAuthenticationFilter.java` (The Guard)
Located in `com.workout.auth.filter`.
- This filter intercepts **every single request** sent to the backend.
- It looks for a header called `Authorization: Bearer <TOKEN>`.
- If a valid token is found, it "authenticates" the user for that specific request.

### `CustomUserDetailsService.java` (The Librarian)
- Connects Spring Security to your database.
- It looks up a user in the `USERS` table by their username and returns their password (hash) and roles.

---

## 3. The Login Flow (Step-by-Step)

1. **User Submits Form**: User enters username and password in the React frontend.
2. **Backend Validation**: `AuthService` checks if the username exists and if the password matches using **BCrypt** (a secure hashing algorithm).
3. **Token Creation**: If valid, `JwtUtil` generates a JWT.
4. **Response**: The server sends the JWT back to the browser.
5. **Storage**: The React app saves this token in `localStorage`.

---

## 4. The Protected Request Flow (After Login)

Whenever you try to start a workout or see your history:

1. **Frontend Sends Token**: The app adds the token to the header:
   `Authorization: Bearer eyJhbGci...`
2. **Filter Intercepts**: `JwtAuthenticationFilter` reads the token and asks `JwtUtil` if it's valid.
3. **Security Context**: If valid, the user is placed into the "Spring Security Context".
4. **Controller Access**: The backend controller (like `WorkoutController`) can now see who the user is using the `@AuthenticationPrincipal` annotation:
   ```java
   @PostMapping("/start")
   public ResponseEntity<WorkoutSession> startSession(@AuthenticationPrincipal User user) {
       // 'user' now contains the authenticated user from the DB!
   }
   ```

---

## 5. Security Best Practices Used
- **Password Hashing**: We never store plain-text passwords. We use **BCrypt**. Even if the database is stolen, passwords cannot be easily read.
- **Token Expiration**: Tokens expire after a set time (e.g., 15 minutes or 24 hours), forcing a re-login for safety.
- **Secret Keys**: Tokens are signed with a complex secret key defined in `application.yml`. Without this key, no one can forge a token.
