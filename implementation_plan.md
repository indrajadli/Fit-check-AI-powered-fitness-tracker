# 🏋️ AI-Powered Workout Tracker — Product Requirements Document (PRD)

> **Version:** 1.0.0 | **Date:** 2026-05-06 | **Status:** Draft

---

## 1. Executive Summary

An intelligent, full-stack workout tracking application that enables users to log active workout sessions in real-time (sets, reps, rest timers), browse exercises by body part, and receive personalized coaching tips powered by an AI LLM backend. The system uses a stateless JWT-secured REST API (Spring Boot 3.4 + Java 21) and a fast, reactive frontend (React + Vite + Tailwind CSS).

---

## 2. Problem Statement

Most workout apps are either too complex (gym management suites) or too simple (basic loggers). There is a clear gap for a focused, real-time active-workout tracker that also educates users with AI-generated coaching, all without requiring a heavyweight cloud DB in early development.

---

## 3. Goals & Success Metrics

| Goal | KPI |
|------|-----|
| Real-time workout logging | Session completion rate ≥ 80% |
| AI coaching adoption | ≥ 60% of users view coach tips per session |
| Performance | API p95 latency < 300ms |
| Security | Zero unauthenticated data access incidents |
| Developer velocity | MVP in 8 weeks with phased delivery |

---

## 4. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend Runtime** | Java 21 (Virtual Threads) |
| **Backend Framework** | Spring Boot 3.4 |
| **Security** | Spring Security + JWT (stateless) |
| **AI Integration** | Spring AI (OpenAI/Ollama adapter) or LangChain4j |
| **Database** | H2 (file-based, dev) → PostgreSQL (prod-ready) |
| **ORM** | Spring Data JPA + Hibernate |
| **Build** | Maven 3.9+ |
| **Frontend Framework** | React 18 + Vite 5 |
| **Styling** | Tailwind CSS v3 |
| **State / Data Fetching** | TanStack Query (React Query v5) |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios |
| **Containerization** | Docker + Docker Compose (Phase 4) |

---

## 5. Core Features

### 5.1 Authentication
- User registration & login
- JWT access token + refresh token
- Protected routes (frontend) and secured endpoints (backend)

### 5.2 Exercise Library
- Pre-seeded exercises organized by **body part** (Chest, Back, Legs, Shoulders, Arms, Core, Cardio)
- Each exercise has: name, description, muscle groups, difficulty, equipment needed
- AI Coach endpoint: generates how-to instructions + tips on demand

### 5.3 Active Workout Session
- Create a workout session (named, timestamped)
- Add exercises from the library to the session
- For each exercise, log multiple **sets** with: reps, weight (kg/lbs), rest timer
- Built-in **countdown rest timer** (configurable seconds)
- Mark individual sets ✅ and mark workout as **Done** to complete the session
- Session summary on completion (total volume, duration, exercises)

### 5.4 Workout History
- List of past completed sessions
- Drill-down to see sets/reps logged per session
- Basic progress chart (volume over time)

### 5.5 AI Coach
- Per-exercise AI coaching card: "How to perform", "Common mistakes", "Pro tips"
- Powered by Spring AI → LLM (OpenAI GPT-4o / local Ollama)
- Responses are cached (Redis in prod, in-memory in dev)

---

## 6. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    React + Vite                     │
│   Pages: Auth | Dashboard | Workout | History       │
│   TanStack Query ←→ Axios HTTP Client               │
└──────────────────────┬──────────────────────────────┘
                       │ REST / JSON (JWT Bearer)
┌──────────────────────▼──────────────────────────────┐
│              Spring Boot 3.4 API                    │
│  Controllers → Services → Repositories              │
│  Spring Security (JWT Filter Chain)                 │
│  Spring AI / LangChain4j (AI Coach Service)         │
└──────────┬─────────────────────────┬────────────────┘
           │                         │
    ┌──────▼──────┐           ┌──────▼──────┐
    │  H2 DB      │           │  LLM API    │
    │ (file mode) │           │ (OpenAI /   │
    │             │           │  Ollama)    │
    └─────────────┘           └─────────────┘
```

---

## 7. Data Models

### User
```
id, username, email, password_hash, created_at, roles[]
```

### Exercise
```
id, name, description, body_part (enum), muscle_groups[], difficulty (BEGINNER|INTERMEDIATE|ADVANCED), equipment, video_url
```

### WorkoutSession
```
id, user_id, name, started_at, completed_at, status (ACTIVE|COMPLETED)
```

### SessionExercise
```
id, session_id, exercise_id, order_index
```

### WorkoutSet
```
id, session_exercise_id, set_number, reps, weight_kg, rest_seconds, completed (boolean), logged_at
```

---

## 8. API Endpoints (REST)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Exercises
- `GET /api/exercises` — all exercises (filterable by body_part)
- `GET /api/exercises/{id}`
- `GET /api/exercises/{id}/coach` — AI coaching tips

### Workout Sessions
- `POST /api/sessions` — start new session
- `GET /api/sessions` — user's session history
- `GET /api/sessions/{id}`
- `PATCH /api/sessions/{id}/complete` — mark done
- `POST /api/sessions/{id}/exercises` — add exercise to session
- `POST /api/sessions/{sessionId}/exercises/{exerciseId}/sets` — log a set
- `PATCH /api/sessions/{sessionId}/exercises/{exerciseId}/sets/{setId}` — update/complete set

---

## 9. Frontend Pages & Components

| Page | Key Components |
|------|---------------|
| `/login`, `/register` | AuthForm, JWT storage |
| `/dashboard` | ActiveSessionCard, QuickStartButton, BodyPartGrid |
| `/workout/new` | ExercisePicker (by body part), SessionBuilder |
| `/workout/:id` | ExerciseList, SetLogger, RestTimer, CompleteButton |
| `/exercises` | ExerciseCard, BodyPartFilter |
| `/exercises/:id` | ExerciseDetail, AICoachPanel |
| `/history` | SessionList, SessionDetailModal, VolumeChart |

---

## 10. Phased Implementation Plan

---

## PHASE 1 — Foundation & Auth (Week 1–2)

### Backend Microsteps

- [ ] **1.1** Scaffold Spring Boot project via [start.spring.io](https://start.spring.io) with dependencies: Web, Security, JPA, H2, Lombok, Validation, Spring AI
- [ ] **1.2** Configure `application.yml` — H2 file-based datasource, JPA ddl-auto=update, server port 8080
- [ ] **1.3** Create `User` entity + `Role` enum (USER, ADMIN)
- [ ] **1.4** Create `UserRepository` extending `JpaRepository`
- [ ] **1.5** Add `JwtUtil` service: generate access token (15 min), refresh token (7 days), validate, extract claims
- [ ] **1.6** Implement `JwtAuthenticationFilter` extending `OncePerRequestFilter`
- [ ] **1.7** Configure `SecurityFilterChain` — permit `/api/auth/**`, secure all others
- [ ] **1.8** Create `AuthController` with `/register` and `/login` endpoints
- [ ] **1.9** Create `AuthService` with BCrypt password hashing
- [ ] **1.10** Add global `@RestControllerAdvice` exception handler
- [ ] **1.11** Add CORS config to allow `http://localhost:5173`
- [ ] **1.12** Write integration tests for register + login flows

### Frontend Microsteps

- [ ] **1.13** Scaffold Vite + React project: `npm create vite@latest workout-tracker -- --template react`
- [ ] **1.14** Install dependencies: `tailwindcss`, `axios`, `@tanstack/react-query`, `react-router-dom`
- [ ] **1.15** Configure Tailwind CSS (`tailwind.config.js`, `index.css`)
- [ ] **1.16** Set up React Router with `BrowserRouter`, define route skeleton
- [ ] **1.17** Create `authService.js` — axios instance with base URL, interceptors for JWT bearer header
- [ ] **1.18** Create `useAuth` context + hook — login, logout, token storage (localStorage)
- [ ] **1.19** Build `LoginPage` and `RegisterPage` with form validation
- [ ] **1.20** Build `ProtectedRoute` component
- [ ] **1.21** Configure TanStack Query `QueryClient` in `main.jsx`

---

## PHASE 2 — Exercise Library (Week 3)

### Backend Microsteps

- [ ] **2.1** Create `Exercise` entity with fields: name, description, bodyPart (enum), muscleGroups, difficulty, equipment
- [ ] **2.2** Create `BodyPart` enum: CHEST, BACK, LEGS, SHOULDERS, ARMS, CORE, CARDIO
- [ ] **2.3** Create `ExerciseRepository` with custom query `findByBodyPart`
- [ ] **2.4** Create `ExerciseService` with CRUD + filter methods
- [ ] **2.5** Create `ExerciseController` — `GET /api/exercises?bodyPart=CHEST`
- [ ] **2.6** Create `data.sql` seed file with 50+ exercises (7 body parts × ~7 exercises each)
- [ ] **2.7** Configure Spring Boot to run `data.sql` on startup (`spring.sql.init.mode=always`)
- [ ] **2.8** Write unit tests for ExerciseService filter logic

### Frontend Microsteps

- [ ] **2.9** Create `exerciseService.js` — API calls for exercises
- [ ] **2.10** Build `ExercisesPage` with body part tabs/filter buttons
- [ ] **2.11** Build `ExerciseCard` component (name, muscle groups, difficulty badge)
- [ ] **2.12** Build `ExerciseDetailPage` — full info display
- [ ] **2.13** Add navigation links in sidebar/navbar
- [ ] **2.14** Add loading skeletons and error states with TanStack Query

---

## PHASE 3 — Active Workout Tracker (Week 4–5)

### Backend Microsteps

- [ ] **3.1** Create `WorkoutSession` entity (user, name, startedAt, completedAt, status enum)
- [ ] **3.2** Create `SessionExercise` entity (session, exercise, orderIndex)
- [ ] **3.3** Create `WorkoutSet` entity (sessionExercise, setNumber, reps, weightKg, restSeconds, completed, loggedAt)
- [ ] **3.4** Create repositories for all three entities
- [ ] **3.5** Create `WorkoutSessionService` — startSession, addExercise, logSet, completeSession
- [ ] **3.6** Create `WorkoutSessionController` with all REST endpoints listed in §8
- [ ] **3.7** Add `SessionSummaryDTO` — total volume, duration, set count, exercise count
- [ ] **3.8** Validate: only session owner can modify/view their session (authorization check in service)
- [ ] **3.9** Write integration tests for full workout flow: start → add exercise → log sets → complete

### Frontend Microsteps

- [ ] **3.10** Create `sessionService.js` — all API calls for sessions
- [ ] **3.11** Build `DashboardPage` — show active session (if any) + "Start Workout" CTA
- [ ] **3.12** Build `NewWorkoutPage` — name input + exercise picker (by body part)
- [ ] **3.13** Build `ExercisePicker` modal — searchable list, multi-select, body part filter
- [ ] **3.14** Build `ActiveWorkoutPage` (`/workout/:id`)
  - [ ] **3.14a** Display session name, elapsed timer (counting up)
  - [ ] **3.14b** List of added exercises, expandable
  - [ ] **3.14c** Per-exercise: "+ Add Set" button, set rows (reps, weight inputs)
  - [ ] **3.14d** Per-set: "✅ Done" toggle to mark complete
  - [ ] **3.14e** Rest Timer: configurable countdown (30s/60s/90s/custom), visual progress ring
  - [ ] **3.14f** "Complete Workout" button → confirmation → call PATCH endpoint → navigate to summary
- [ ] **3.15** Build `WorkoutSummaryPage` — session stats display
- [ ] **3.16** Build `HistoryPage` — list of past sessions, click to view detail
- [ ] **3.17** Persist active session ID in localStorage so browser refresh doesn't lose session

---

## PHASE 4 — AI Coach Integration (Week 6)

### Backend Microsteps

- [ ] **4.1** Add Spring AI dependency to `pom.xml` (spring-ai-openai-spring-boot-starter)
- [ ] **4.2** Configure `application.yml` with `spring.ai.openai.api-key` (from env var)
- [ ] **4.3** Create `AICoachService` with method `getCoachingTips(Exercise exercise) → CoachingResponse`
- [ ] **4.4** Build prompt template: include exercise name, body part, muscle groups, difficulty
- [ ] **4.5** Parse LLM response into structured `CoachingResponse` DTO (howToPerform, commonMistakes, proTips, breathingTip)
- [ ] **4.6** Add `GET /api/exercises/{id}/coach` endpoint in `ExerciseController`
- [ ] **4.7** Add in-memory caching (`@Cacheable`) on coaching responses to reduce LLM calls
- [ ] **4.8** Add Ollama fallback config for local/offline mode
- [ ] **4.9** Write test with mocked LLM response

### Frontend Microsteps

- [ ] **4.10** Build `AICoachPanel` component — expandable card on `ExerciseDetailPage`
- [ ] **4.11** Add "🤖 Ask AI Coach" button with loading spinner
- [ ] **4.12** Display coaching sections: How To Perform, Common Mistakes, Pro Tips, Breathing
- [ ] **4.13** Add "Ask Coach" shortcut button on `ActiveWorkoutPage` per exercise
- [ ] **4.14** Show coach panel in a slide-over/drawer on mobile

---

## PHASE 5 — Polish, Charts & Responsive UI (Week 7)

### Microsteps

- [ ] **5.1** Install `recharts` for progress visualization
- [ ] **5.2** Build `VolumeChart` on HistoryPage — weekly volume (kg lifted) line chart
- [ ] **5.3** Build personal records (PR) tracker — highlight when a new max weight is hit
- [ ] **5.4** Add dark mode toggle (Tailwind `dark:` classes + localStorage preference)
- [ ] **5.5** Implement full responsive layout (mobile-first breakpoints)
- [ ] **5.6** Add PWA manifest + service worker for installable app experience
- [ ] **5.7** Add toast notifications (react-hot-toast) for actions: set logged, workout complete, errors
- [ ] **5.8** Accessibility audit: aria-labels, keyboard nav, focus rings
- [ ] **5.9** Add loading skeletons for all data-fetching states
- [ ] **5.10** Performance: lazy-load routes with `React.lazy()` + `Suspense`

---

## PHASE 6 — Containerization & Deployment Prep (Week 8)

### Microsteps

- [ ] **6.1** Write `Dockerfile` for Spring Boot backend (multi-stage: build → JRE 21 slim)
- [ ] **6.2** Write `Dockerfile` for React frontend (Vite build → nginx serve)
- [ ] **6.3** Write `docker-compose.yml` orchestrating backend + frontend + optional PostgreSQL
- [ ] **6.4** Add environment variable documentation in `.env.example`
- [ ] **6.5** Switch DB profile: `application-prod.yml` with PostgreSQL datasource
- [ ] **6.6** Add GitHub Actions CI workflow: build + test on PR
- [ ] **6.7** Configure nginx reverse proxy (`/api` → backend, `/` → frontend)
- [ ] **6.8** Add README with local dev setup, Docker instructions, env var reference
- [ ] **6.9** Final end-to-end test: register → workout → AI coach → complete → history

---

## 11. Directory Structure

```
workout-tracker/
├── backend/                          # Spring Boot Maven project
│   ├── src/main/java/com/workout/
│   │   ├── auth/                     # JWT, SecurityConfig, AuthController
│   │   ├── exercise/                 # Exercise entity, service, controller
│   │   ├── session/                  # WorkoutSession, SessionExercise, WorkoutSet
│   │   ├── ai/                       # AICoachService, CoachingResponse DTO
│   │   └── common/                   # GlobalExceptionHandler, BaseEntity
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── data.sql                  # Exercise seed data
│   └── pom.xml
│
├── frontend/                         # React + Vite project
│   ├── src/
│   │   ├── api/                      # authService, exerciseService, sessionService
│   │   ├── components/               # Reusable UI components
│   │   ├── pages/                    # Route-level page components
│   │   ├── hooks/                    # useAuth, useTimer, useRestTimer
│   │   ├── context/                  # AuthContext
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 12. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| LLM API rate limits | Medium | High | Cache responses, add retry with backoff |
| H2 data loss on restart | Low | Medium | Use file-based H2 (`jdbc:h2:file:./data/workoutdb`) |
| JWT token theft | Low | High | HttpOnly cookies for refresh token in prod |
| Complex set/rep state mgmt | Medium | Medium | Use TanStack Query optimistic updates |
| Vite/Tailwind version conflicts | Low | Low | Pin exact versions in package.json |

---

## 13. Open Questions

> [!IMPORTANT]
> **Q1**: Should the AI coach use **OpenAI GPT-4o** (requires API key + cost) or **local Ollama** (free, runs locally)? This affects Phase 4 setup.

> [!IMPORTANT]
> **Q2**: Do you want **user-created custom exercises** in addition to the pre-seeded library?

> [!NOTE]
> **Q3**: Should workout plans (pre-defined routines like "Push Day", "Pull Day") be in MVP or post-MVP?

> [!NOTE]
> **Q4**: Target deployment: **local only** for now, or do you need a cloud deploy guide (Railway, Render, Fly.io)?
