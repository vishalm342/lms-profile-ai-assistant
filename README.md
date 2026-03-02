# Kalvium Forge - AI-Powered LMS Profile Assistant

**Live Demo:** [https://lms-profile-ai-assistant.vercel.app/](https://lms-profile-ai-assistant.vercel.app/)
**Backend API:** [https://lms-profile-ai-assistant.onrender.com/](https://lms-profile-ai-assistant.onrender.com/)

An intelligent Learning Management System (LMS) dashboard that allows students to manage their academic profiles and course enrollments through a natural language AI interface and a real-time synchronized UI.

## 🚀 Features
- **AI-Powered Profile Management**: Update your location, contact details, or education history just by chatting with the Forge AI Assistant.
- **Real-Time UI Synchronization**: The dashboard UI automatically refreshes when the AI agent modifies the backend database.
- **Manual CRUD Operations**: Full control to manually Add, Toggle Status (Active/Completed), and Delete courses through a modal-driven workflow.
- **Premium SaaS UI**: A high-fidelity, light-themed landing page and dashboard built with Tailwind CSS.
- **Secure Backend**: Node.js Express server with SQLite persistence and strict database-level CHECK constraints.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Lucide React, Axios
- **Backend**: Node.js, Express.js, SQLite3
- **AI Integration**: Google Gemini API via custom multi-agent orchestration
- **Deployment**: Vercel (Frontend) and Render (Backend)

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key

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

📄 License
This project was developed as part of the Kalvium Forge Hackathon.
