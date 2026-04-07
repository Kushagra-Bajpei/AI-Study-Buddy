# 🤖 AI Study Buddy

A production-ready, full-stack AI-powered study platform built with React + Vite, Node.js/Express, MongoDB, and Claude AI.

---

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gemini API key

---

### 1. Clone & Navigate

```bash
cd "AI Study Buddy"
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create your `.env` file:

```bash
copy .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ai-study-buddy
JWT_SECRET=any_long_random_secret_string_here
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** 🎉

---

## 📁 Project Structure

```
AI Study Buddy/
├── server/                     # Node.js + Express backend
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, login, getMe
│   │   ├── aiController.js     # Claude API calls
│   │   └── progressController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── StudySession.js     # Session schema
│   ├── routes/                 # REST route definitions
│   └── server.js               # Entry point
│
└── client/                     # React + Vite frontend
    └── src/
        ├── components/         # Layout, Sidebar, Navbar, etc.
        ├── context/            # AuthContext, ThemeContext
        ├── pages/              # All 8 pages
        └── services/api.js     # Axios instance
```

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✅ | Get current user |
| POST | /api/ai/notes | ✅ | Generate notes |
| POST | /api/ai/quiz | ✅ | Generate quiz |
| POST | /api/ai/plan | ✅ | Generate 7-day plan |
| POST | /api/ai/quiz/result | ✅ | Save quiz score |
| GET | /api/progress | ✅ | Get user progress |

---

## ✨ Features

- **JWT Auth** — Secure register/login with bcrypt hashing
- **Smart Notes** — Claude AI generates structured markdown notes
- **Adaptive Quiz** — 5 MCQs with animations, score tracking, answer review
- **7-Day Plans** — Expandable day-by-day study roadmap
- **Weak Area Detection** — Auto-marks topics with score < 50% as weak
- **Personalization** — Future AI prompts focus on your weak areas
- **Progress Dashboard** — Stats, quiz history bars, topic grid
- **Dark Mode** — System preference + manual toggle
- **Fully Responsive** — Mobile sidebar drawer + desktop layout

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v3 |
| Routing | React Router v6 |
| HTTP | Axios |
| State | Context API |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | Anthropic Claude 3.5 Sonnet |
