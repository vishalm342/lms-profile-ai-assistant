# Low-Level Design Document (LLD) - Kalvium Forge

## 1. System Architecture
The application follows a standard Client-Server architecture with a persistent local database.
- **Frontend**: A React-based SPA (Single Page Application) using Next.js App Router.
- **Backend**: A RESTful API built with Express.js.
- **Database**: SQLite3 for lightweight, local relational data storage.

## 2. Database Schema (SQLite)
### Table: `students`
- `id` (PK): Integer
- `name`: Text
- `email`: Text (Unique)
- `phone`: Text
- `location`: Text
- `date_of_birth`: Text

### Table: `applications` (Courses)
- `id` (PK): Integer
- `student_id` (FK): Integer
- `course_name`: Text
- `status`: Text (CHECK: 'submitted', 'under_review', 'accepted', 'rejected')
- `duration`: Text
- `fee`: Text

## 3. API Endpoints
- `GET /api/profile/:id`: Fetches full student profile and enrolled courses.
- `PUT /api/profile/:id`: Updates student personal information.
- `POST /api/chat`: Receives user message, processes AI logic, and triggers DB updates.
- `POST /api/profile/:id/course`: Manually adds a new course.
- `PUT /api/profile/:id/course/:courseId/toggle`: Toggles status between 'accepted' (ACTIVE) and 'rejected' (COMPLETED).
- `DELETE /api/profile/:id/course/:courseId`: Removes a course record.

## 4. Key Design Patterns
- **Polling/Sync Loop**: The ChatWidget checks for a `databaseUpdated` flag in the AI response to trigger a `fetchProfile()` re-render.
- **Constraint Mapping**: Backend logic maps UI states to strict SQL `CHECK` constraints to ensure data integrity without schema migrations.