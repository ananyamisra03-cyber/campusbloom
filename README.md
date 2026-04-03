# 🎓 CampusBloom — Deployment Guide

A full-stack college student organizer with MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
campusbloom/
├── backend/          ← Node.js + Express API
│   ├── config/
│   │   ├── db.js         MongoDB connection
│   │   └── email.js      Gmail login notification
│   ├── middleware/
│   │   └── auth.js       JWT verification
│   ├── models/
│   │   ├── User.js       User schema (bcrypt password)
│   │   └── Data.js       Per-user app data
│   ├── routes/
│   │   ├── auth.js       POST /signup  POST /login  GET /me  PATCH /preferences
│   │   └── data.js       GET /  PATCH /:key  PATCH /
│   ├── server.js         Express entry point
│   ├── package.json
│   └── .env.example      → copy to .env and fill in
│
├── frontend/         ← React + Vite SPA
│   ├── src/
│   │   ├── App.jsx               Root component
│   │   ├── main.jsx              ReactDOM entry
│   │   ├── index.css             Global styles + keyframes
│   │   ├── components/
│   │   │   ├── ui.jsx            Shared UI primitives
│   │   │   ├── AuthPage.jsx      Login + Signup forms
│   │   │   └── AppShell.jsx      Responsive sidebar layout
│   │   ├── context/
│   │   │   └── AuthContext.jsx   Auth state + API calls
│   │   ├── sections/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AcademicSections.jsx  Calendar, Expenses, Marks
│   │   │   ├── Studies.jsx           Subjects → Modules → Topics
│   │   │   ├── ActivitySections.jsx  Timer, Habits, ExamPlanner
│   │   │   └── OtherSections.jsx     Internships, Extracurriculars,
│   │   │                             Materials, Notes, Todo, Store
│   │   └── utils/
│   │       ├── api.js            Axios client with JWT
│   │       └── themes.js         18 themes (light+dark), nav items, constants
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md         ← you are here
```

---

## 🚀 OPTION A — Full Deployment (Recommended)

### Step 1: MongoDB Atlas (free)

1. Go to **https://cloud.mongodb.com** → Sign up / Log in
2. Create a free **M0** cluster (any region)
3. Under **Database Access** → Add a DB user (username + password)
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all — fine for hosted apps)
5. Click **Connect** → **Drivers** → copy the connection string  
   It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`  
   Change the database name to `campusbloom`:  
   `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/campusbloom?retryWrites=true&w=majority`

---

### Step 2: Deploy Backend → Railway (free tier)

1. Go to **https://railway.app** → Sign up with GitHub
2. **New Project** → **Deploy from GitHub repo**  
   *(push this code to GitHub first — see Step 0 below)*
3. In Railway, set the **Root Directory** to `backend`
4. Add **Environment Variables** (Settings → Variables):

```
PORT              = 5000
NODE_ENV          = production
MONGODB_URI       = mongodb+srv://...your Atlas string...
JWT_SECRET        = any_random_32+_char_string_eg_abc123xyz456...
JWT_EXPIRES_IN    = 7d
CLIENT_URL        = https://your-frontend-url.vercel.app
EMAIL_HOST        = smtp.gmail.com
EMAIL_PORT        = 587
EMAIL_USER        = your.gmail@gmail.com
EMAIL_PASS        = your_16_char_app_password
EMAIL_FROM        = CampusBloom <your.gmail@gmail.com>
```

5. Railway auto-detects Node.js and runs `npm start`
6. Copy your Railway URL — looks like `https://campusbloom-api.railway.app`

---

### Step 3: Deploy Frontend → Vercel (free)

1. Go to **https://vercel.com** → Sign up with GitHub
2. **Add New Project** → import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add **Environment Variable**:

```
VITE_API_URL = https://campusbloom-api.railway.app
```

5. Click **Deploy** — Vercel auto-detects Vite and runs `npm run build`
6. Your app is live at `https://campusbloom.vercel.app` (or similar)
7. Go back to Railway → update `CLIENT_URL` to your Vercel URL

---

### Step 0: Push to GitHub (required for Railway + Vercel)

```bash
cd campusbloom
git init
git add .
git commit -m "Initial CampusBloom commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campusbloom.git
git push -u origin main
```

---

## 💻 OPTION B — Run Locally

### Prerequisites
- Node.js 18+  (https://nodejs.org)
- A MongoDB Atlas account (free) OR MongoDB installed locally

### Setup

```bash
# 1. Install all dependencies
cd campusbloom
npm run install:all

# 2. Configure backend
cd backend
cp .env.example .env
# Edit .env — fill in MONGODB_URI and JWT_SECRET at minimum
# EMAIL_* is optional (app works without email; just no login notifications)

# 3. Configure frontend
cd ../frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000   (already set correctly)

# 4. Start both servers (two terminals)

# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev

# Open http://localhost:5173
```

### Minimum .env for local dev (backend)

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/campusbloom
JWT_SECRET=any_random_long_string_here_32_chars_min
```

---

## 📧 Gmail Login Notification Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Create an App Password for "Mail" → "Other (Custom name)" → "CampusBloom"
4. Copy the 16-character password (shown once) into `.env` as `EMAIL_PASS`
5. Fill in `EMAIL_USER` (your Gmail) and `EMAIL_FROM`

If you skip this, the app works normally — login emails just won't be sent.

---

## 🔑 JWT Secret

Generate a secure secret with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Paste the output as `JWT_SECRET`.

---

## 🌍 Environment Variables Summary

| Variable | Where | Required | Description |
|---|---|---|---|
| `MONGODB_URI` | backend | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | backend | ✅ | Random 32+ char secret |
| `JWT_EXPIRES_IN` | backend | ✅ | Token duration e.g. `7d` |
| `PORT` | backend | ✅ | Server port (Railway sets this) |
| `NODE_ENV` | backend | ✅ | `production` or `development` |
| `CLIENT_URL` | backend | ✅ | Vercel frontend URL (for CORS) |
| `EMAIL_HOST` | backend | ❌ | `smtp.gmail.com` |
| `EMAIL_PORT` | backend | ❌ | `587` |
| `EMAIL_USER` | backend | ❌ | Your Gmail |
| `EMAIL_PASS` | backend | ❌ | 16-char Gmail App Password |
| `EMAIL_FROM` | backend | ❌ | Display name + email |
| `VITE_API_URL` | frontend | ✅ | Railway backend URL |

---

## ✅ Features

- 🔐 Authenticated accounts (JWT, bcrypt)
- 📧 Login email notifications (Gmail)
- 💰 Expenses with monthly + yearly budget tracking
- 📊 Marks by subject and term with class average
- 📅 Calendar with popup date picker + calendar view
- 📚 Studies: Subjects → Modules → Topic checklists
- ⏱️ Study timer with custom duration (max 3h), categories, congratulations
- 🌱 Habit tracker with streaks and 7-day grid
- 📝 Exam planner with syllabus checklist
- 💼 Internship/Placement tracker with status pipeline
- 🎭 Extracurriculars with activity log timeline
- 📁 Study materials organised by subject
- ✍️ Color-coded notes editor
- ✅ To-do list with priority levels
- 🛍️ Rewards store with 18 themes (light + dark variants)
- 🌙 Full dark mode — themes adapt automatically
- 📱 Fully responsive (mobile sidebar + bottom nav)
- 🗄️ All data stored in MongoDB per user account

