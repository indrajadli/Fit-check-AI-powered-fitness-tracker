# Database Architecture Guide — FitCheck

This document provides a detailed overview of the database used in the FitCheck project, including table structures, relationships, and the technical rationale for the chosen stack.

## 1. Database Overview
- **Type**: **H2 Database** (Relational)
- **Mode**: **File-based Persistence**
- **Location**: `/backend/data/workoutdb.mv.db`
- **ORM**: **Hibernate / Spring Data JPA**

### Why H2?
1. **Zero Configuration**: No external database installation (like MySQL or Postgres) is required to run the project.
2. **Persistence**: Unlike in-memory databases, we use the `file:` protocol, ensuring your workout history survives restarts.
3. **Performance**: Extremely fast for local development and high-frequency updates (like adding sets during a workout).
4. **Tooling**: Comes with a built-in web-based console for easy inspection.

---

## 2. Table Schemas

### `USERS`
Stores authentication credentials and personal physical metrics.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Unique identifier. |
| `username` | VARCHAR | User's unique handle. |
| `password` | VARCHAR | BCrypt encoded hash. |
| `first_name` | VARCHAR | User's legal first name. |
| `height_cm` | DOUBLE | Physical metric for BMI/coaching. |
| `weight_kg` | DOUBLE | Physical metric for volume calculation. |
| `bio` | TEXT | Optional user biography. |

### `EXERCISES` (Master Data)
The core library of movements available in the app.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Unique identifier. |
| `name` | VARCHAR | e.g., "Bench Press". |
| `body_part` | ENUM | CHEST, BACK, LEGS, etc. |
| `video_url` | VARCHAR | YouTube tutorial link. |
| `difficulty` | ENUM | BEGINNER, INTERMEDIATE, ADVANCED. |

### `WORKOUT_SESSIONS` (Transactional)
Groups multiple sets together into a single "workout event".
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Unique identifier. |
| `user_id` | BIGINT (FK) | Reference to the user who performed it. |
| `start_time` | TIMESTAMP | When the "Start Workout" button was clicked. |
| `status` | ENUM | ACTIVE, FINISHED. |
| `total_volume` | DOUBLE | Calculated sum: $\sum (weight \times reps)$. |

### `WORKOUT_SETS` (Transactional)
The granular data for every lift performed.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Unique identifier. |
| `session_id` | BIGINT (FK) | Links the set to a specific workout session. |
| `exercise_id` | BIGINT (FK) | Links the set to a specific movement. |
| `weight` | DOUBLE | Resistance used. |
| `reps` | INT | Number of repetitions. |
| `completed` | BOOLEAN | Whether the set was successfully finished. |

---

## 3. Data Flow & Logic

### Workout Persistence
1. When a user clicks **"Start Workout"**, a new row is created in `WORKOUT_SESSIONS` with status `ACTIVE`.
2. Every time a set is added, a row is created in `WORKOUT_SETS` and the `total_volume` in the parent session is updated live.
3. When **"Finish Workout"** is clicked, the session status changes to `FINISHED` and the `end_time` is recorded.

### Seeding (Master Data)
Master data (Exercises) is managed via `backend/src/main/resources/data.sql`. 
- **Important**: To protect your workout history, automatic SQL initialization is disabled by default in production-like states (`spring.sql.init.mode: never`).

---

## 4. How to Inspect Live Data
You can query these tables directly while the app is running:

1. Go to: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
2. **JDBC URL**: `jdbc:h2:file:./data/workoutdb`
3. **User**: `sa` | **Password**: *(Empty)*

Run this query to see your progress:
```sql
SELECT s.start_time, e.name, st.weight, st.reps 
FROM workout_sessions s
JOIN workout_sets st ON s.id = st.session_id
JOIN exercises e ON st.exercise_id = e.id
ORDER BY s.start_time DESC;
```
