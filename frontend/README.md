# JIITCommute Frontend

## Overview
The JIITCommute frontend is a modern React application for seamless carpooling and commute management at JIIT. It provides a beautiful, mobile-friendly interface for user authentication, trip hosting/joining, real-time chat, and trip history.

## Features

- **Authentication:** Register, login, auto-login with loader, and logout
- **Trip Management:** Host, join, and view active trips
- **Trip History:** View and manage your past trips (hosted and joined)
- **Profile:** View your profile, hosted trips, and joined trips
- **Real-Time Chat:** Chat with other users in trip rooms (Socket.IO)
- **Toasts & Feedback:** User-friendly notifications for all actions
- **Glassmorphism UI:** Modern, frosted-glass look for chat and key components
- **Responsive Design:** Mobile-first, works great on all devices

## Technology Stack

- **React 19** (with hooks)
- **React Router v7**
- **Axios** for API requests
- **Socket.IO Client** for real-time chat
- **React Toastify** for notifications
- **Day.js** for date/time handling
- **MUI (Material UI)** for date/time pickers
- **Tailwind CSS** for styling
- **Vite** for fast development and builds

## Folder Structure

```
frontend/
│
├── public/
│   └── images/           # App images and icons
├── src/
│   ├── components/       # Reusable UI components (BottomNav, ChatRoomPopup, etc.)
│   ├── pages/            # Main app pages (Home, Host, Profile, History, etc.)
│   ├── utils/            # Utility functions (toast.js, etc.)
│   ├── App.jsx           # Main app router
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## Key Pages & Components

- **Landing:** Welcome page with register/login options
- **AutoLogin:** Loader and auto sign-in logic on app open
- **Home:** Browse and join available trips
- **Host:** Host a new trip (with time picker)
- **Profile:** View your info, hosted, and joined trips
- **History:** See and manage your trip history
- **ChatRoomPopup:** Real-time chat for each trip
- **BottomNav:** Mobile navigation bar

## Setup Instructions

1. **Clone the Repository**
   ```sh
   git clone https://github.com/yourusername/jiitcommute-frontend.git
   cd jiitcommute-frontend
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Start the App**
   ```sh
   npm run dev
   ```
   The app will run on http://localhost:5173 by default.

4. **Environment**
   - The frontend expects the backend to be running at `http://localhost:4000` (see CORS settings).
   - Update API URLs in Axios if your backend is hosted elsewhere.

## Notable UX Details

- **Auto Sign-In:** On app open, users see a loader ("Signing you in...") for at least 2 seconds. If authenticated, they are redirected to Home; otherwise, to the Landing page.
- **Toasts:** All important actions (success/error) show toast notifications at the top center.
- **Trip Restrictions:** Users cannot host a trip if they are already hosting or have joined an active trip. Attempting to do so shows a toast error.
- **Glassmorphism:** Chat and key UI elements use a frosted-glass effect for a modern look.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code

## License

MIT

For issues or contributions, please open an issue or pull request on GitHub.
