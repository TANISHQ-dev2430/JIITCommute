# JIITCommute

JIITCommute is a full-stack carpooling and commute management platform for JIIT, featuring a modern React frontend and a Node.js/Express backend with MongoDB. It supports real-time chat, user authentication, trip management, and a beautiful mobile-friendly UI.

---

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Monorepo Structure](#monorepo-structure)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [License](#license)

---

## Features
- User registration, login, and JWT authentication
- Host, join, and manage trips
- Real-time chat in trip rooms (Socket.IO)
- Trip history and user profile
- Toast notifications and modern UI
- Mobile-first, responsive design

---

## Technology Stack
- **Frontend:** React 19, Vite, Tailwind CSS, React Router v7, Axios, Socket.IO Client, React Toastify, MUI, Day.js
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt, Socket.IO, node-cron

---

## Monorepo Structure
```
JIITCommute/
├── backend/    # Node.js/Express/MongoDB API & Socket.IO server
├── frontend/   # React 19 + Vite + Tailwind CSS client
├── package.json
└── README.md
```

---

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/jiitcommute.git
cd JIITCommute
```

### 2. Backend Setup
```sh
cd backend
npm install
# Create .env file (see backend/README.md for details)
npm start
```
- The backend runs on `http://localhost:4000` by default.

### 3. Frontend Setup
```sh
cd ../frontend
npm install
npm run dev -- --host
```
- The frontend runs on `http://localhost:5173` by default.
- To access from your phone, use your PC's IP: `http://<your-ip>:5173`
- Update `vite.config.js` proxy to match your backend IP if needed.

---

## Deployment
- Deploy backend on Render, Railway, Heroku, or AWS.
- Deploy frontend on Vercel, Netlify, or similar.
- Use MongoDB Atlas for cloud database.
- Update environment variables and proxy URLs for production.

---

## License
MIT

For issues or contributions, please open an issue or pull request on GitHub.
