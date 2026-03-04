# Kalvium Forge – AI-Powered LMS Profile Assistant

An AI-enabled Learning Management System (LMS) dashboard that lets students manage their academic profile and course applications using a natural-language assistant, with real-time UI sync.

## Submission Artifacts
- **Figma Design**: https://www.figma.com/design/MOZOAbrTfwPWk3Et0XJr2N/AI-Chatbot-KalviumLabs?node-id=0-1&t=T4hZZERgIH1HRxNA-1
- **Deployed (Frontend)**: https://lms-profile-ai-assistant.vercel.app/
- **Deployed (Backend API)**: https://lms-profile-ai-assistant.onrender.com/

## Features
- **AI-Powered Profile Management**: Update location, contact details, or education history by chatting with the assistant.
- **Real-Time UI Synchronization**: UI refreshes automatically when the AI agent updates the database.
- **Secure Authentication**: Enterprise-grade security using **JWT (JSON Web Tokens)** for session management and **Bcrypt** for password hashing.
- **Manual CRUD for Courses**: Add courses, toggle status (Active/Completed), and delete courses.
- **Premium SaaS UI**: Light-themed landing page + dashboard built with Tailwind CSS.
- **Secure Backend**: Express + SQLite with strict `CHECK` constraints.

## Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Lucide React, Axios
- **Backend**: Node.js, Express.js, SQLite3
- **Authentication**: JWT, Bcrytjs
- **AI**: Google Gemini API (custom multi-agent orchestration)
- **Deployment**: Vercel (Frontend) + Render (Backend)

## Getting Started

### Prerequisites
- Node.js v18+
- Google Gemini API key

### 1. Environment Setup
Create a `.env` file in the `backend/` folder:

```env
GOOGLE_API_KEY="your_gemini_api_key"
JWT_SECRET="your_secure_random_hex_string" 
PORT=5000
```

### Run Locally
1. **Clone**
   ```bash
   git clone https://github.com/vishalm342/lms-profile-ai-assistant.git
   cd lms-profile-ai-assistant
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   node server.js
   ```

3. **Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## License
Developed as part of the Kalvium Forge Hackathon.
