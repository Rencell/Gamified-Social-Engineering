# Database Integration and Gamification Strategy

This document outlines a plan for integrating a backend database to store user progress and manage gamification elements like achievements, badges, coins, and levels.

## 1. Core Concept: Decoupling Frontend and Backend

The frontend should not contain any sensitive logic for awarding achievements or currency. Its role is to report user actions (e.g., "module completed") to the backend. The backend will be the single source of truth for all user data, progress, and rewards.

## 2. Database Schema Design

A relational database (like PostgreSQL or MySQL) or a NoSQL database (like MongoDB) can be used. Here is a potential schema using a relational model approach.

**Table: `Users`**
- `id` (Primary Key)
- `username`
- `email`
- `password_hash`
- `created_at`

**Table: `UserProfiles`**
- `user_id` (Foreign Key to `Users.id`)
- `xp` (Experience Points, Integer, default: 0)
- `level` (Integer, default: 1)
- `coins` (Integer, default: 0)

**Table: `Lessons`** (Can be pre-populated from your frontend data)
- `id` (e.g., 'phishing', Primary Key)
- `title`

**Table: `Modules`** (Can be pre-populated)
- `id` (e.g., 'phishing-intro', Primary Key)
- `lesson_id` (Foreign Key to `Lessons.id`)
- `title`

**Table: `UserModuleProgress`**
- `user_id` (Foreign Key to `Users.id`)
- `module_id` (Foreign Key to `Modules.id`)
- `completed_at` (Timestamp)
- Primary Key (`user_id`, `module_id`)

**Table: `Achievements`** (Static table defining all possible achievements)
- `id` (Primary Key)
- `name` (e.g., "Phishing Novice")
- `description` (e.g., "Complete the Phishing lesson.")
- `reward_coins` (Integer)
- `reward_xp` (Integer)

**Table: `UserAchievements`** (Links users to their unlocked achievements)
- `user_id` (Foreign Key to `Users.id`)
- `achievement_id` (Foreign Key to `Achievements.id`)
- `unlocked_at` (Timestamp)
- Primary Key (`user_id`, `achievement_id`)

**Table: `Badges`**
- This can be a simplified version of `Achievements` or a separate table if badges have different logic (e.g., purely visual, not tied to rewards).

## 3. API Endpoint Strategy (Backend)

The backend should expose a RESTful API for the frontend to consume.

- **`POST /api/auth/register`**: Create a new user.
- **`POST /api/auth/login`**: Authenticate a user and return a JWT.

- **`GET /api/user/profile`**: Get the logged-in user's profile (level, XP, coins, achievements).
- **`GET /api/user/progress/:lessonId`**: Get the user's completion status for all modules in a specific lesson.

- **`POST /api/progress/complete`**: The most critical endpoint. The frontend sends a payload like `{ "moduleId": "phishing-intro" }`.

## 4. Backend Logic for `POST /api/progress/complete`

When this endpoint is hit, the backend should:

1.  **Authenticate** the user via JWT.
2.  **Validate** the `moduleId` from the request body.
3.  **Check** if the user has already completed this module. If so, do nothing.
4.  **Record** the completion in the `UserModuleProgress` table.
5.  **Award** base XP and coins for module completion and update the `UserProfiles` table.
6.  **Check for Achievements**: After saving progress, run a check to see if this completion unlocks any new achievements.
    -   *Example Logic*: "Has the user now completed all modules for the 'phishing' lesson?" If yes, grant the "Phishing Novice" achievement in the `UserAchievements` table and add the reward coins/XP.
7.  **Check for Level Up**: After awarding XP, check if the user's total `xp` exceeds the threshold for the next level. If so, increment their `level`.
8.  **Return** the updated user profile state (or a success message) to the frontend.

## 5. Frontend Integration Plan (Vue + Pinia)

1.  **Create a `user.ts` store**: This store will handle the user's authentication state and profile data.
    -   `state`: `user`, `token`, `isAuthenticated`, `profile` (level, coins, etc.).
    -   `actions`: `login()`, `register()`, `logout()`, `fetchProfile()`.

2.  **Modify `learning.ts` store**:
    -   When a lesson is loaded (`loadLesson`), it should also call an action to fetch the user's progress for that lesson from the backend.
    -   The `nextModule` or a dedicated "Complete Module" button should call a new action, `completeModule()`.

3.  **Implement `completeModule()` action in `learning.ts`**:
    -   This action will make the `POST /api/progress/complete` API call.
    -   On a successful response, it can either trigger a refresh of the user profile data (`userStore.fetchProfile()`) or update the local state based on the API response.

This plan ensures a robust, secure, and scalable system where the backend manages all critical data and logic, and the frontend acts as a dynamic and responsive interface.