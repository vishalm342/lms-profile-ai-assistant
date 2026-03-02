# Kalvium Forge - AI-Powered LMS Profile Assistant

An intelligent Learning Management System (LMS) dashboard that allows students to manage their academic profiles and course enrollments through a natural language AI interface and a real-time synchronized UI.

## 🚀 Features
- **AI-Powered Profile Management**: Update your location, contact details, or education history just by chatting.
- **Real-Time UI Synchronization**: The dashboard UI automatically refreshes when the AI agent modifies the backend database.
- **Manual CRUD Operations**: Full control to manually Add, Toggle Status (Active/Completed), and Delete courses.
- **SaaS Landing Page**: A pixel-perfect, responsive landing page built with Tailwind CSS.
- **Secure Backend**: Express.js server with SQLite persistence and strict database-level constraints.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, SQLite3
- **AI Integration**: Custom multi-agent AI flow for database manipulation

## 🚦 Getting Started
1. **Clone the repo**: `git clone <repo-url>`
2. **Setup Backend**:
   - `cd backend`
   - `npm install`
   - `node server.js`
3. **Setup Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
4. **Access**: Open `http://localhost:3000`