# JIITCommute Backend

## Overview
JIITCommute backend is a robust Node.js/Express server with MongoDB, providing RESTful APIs, real-time Socket.IO features, and push notifications (FCM) for user authentication, trip management, chat, and user profiles. It powers the JIITCommute platform, enabling secure, scalable, and real-time commute management for JIIT users.

---

## Features
- **User Authentication:** Register, login, logout (JWT, token blacklisting)
- **Trip Management:** Create, update, delete, and list trips
- **Join/Cancel Trip:** Users can join or cancel joining a trip
- **Profile:** Fetch user profile and active trips (hosted and joined)
- **Chat:** Real-time chat in trip rooms (Socket.IO)
- **Push Notifications:** Send push notifications to users via Firebase Cloud Messaging (FCM)
- **Security:** JWT authentication, password hashing, CORS, input validation
- **Trip Creation Restriction:** Users cannot create a new trip if already hosting or joined to any active trip
- **Soft Deletion:** Trips are soft-deleted after departure or by user action
- **Automatic Cleanup:** Old trips are deleted after 15 days (cron jobs)

---

## Technology Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- bcrypt for password hashing
- Socket.IO for real-time chat
- node-cron for scheduled tasks
- Firebase Cloud Messaging (FCM) for push notifications

---

## Folder Structure
```
backend/
├── controllers/         # Route controllers
├── db/                  # Database connection
├── middlewares/         # Auth and other middleware
├── models/              # Mongoose models
├── routes/              # Express routes
├── services/            # Business logic
├── app.js               # Express app setup
├── server.js            # Server entry point
├── .env                 # Environment variables
└── package.json
```

---

## Setup Instructions

1. **Clone the Repository**
   ```sh
   git clone https://github.com/yourusername/jiitcommute.git
   cd JIITCommute/backend
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend root:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FCM_SERVER_KEY=your_firebase_server_key
   ```

4. **FCM Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Download your `serviceAccountKey.json` and place it in the backend directory (if required by your implementation).
   - Add your FCM server key to the `.env` file as shown above.

5. **Start the Server**
   ```sh
   npm start
   ```
   The server will run on http://localhost:4000 by default.

---

## API Endpoints

### Authentication
- `POST   /users/register`   — Register a new user
- `POST   /users/login`      — Login and receive JWT token (HTTP-only cookie)
- `POST   /users/logout`     — Logout and blacklist token

### User Profile
- `GET    /users/profile`    — Get current user profile (auth required)

### Device Token (Push Notifications)
- `POST   /users/device-token` — Register or update a user's device token for push notifications (auth required)

### Trips
- `POST   /trips/create`     — Create a new trip (restrictions apply)
- `PUT    /trips/:id`        — Update a trip (host only)
- `DELETE /trips/:id`        — Delete a trip (host only, soft delete)
- `GET    /trips/my`         — Get trips hosted by the user
- `GET    /trips/all`        — Get all active trips
- `GET    /trips/joined`     — Get trips the user has joined
- `GET    /trips/history`    — Get trip history (last 15 days)
- `DELETE /trips/history/:id`— Remove a trip from user's history

### Trip Actions
- `POST   /trips/:id/join`         — Join a trip (restrictions apply)
- `PATCH  /trips/:id/cancel-join`  — Cancel joining a trip
- `PATCH  /trips/:id/remove-user`  — Host removes a joined user

### Chat
- Real-time chat via Socket.IO (`/trips/:tripId/chat` for history, socket events for live chat)

---

## Push Notifications (FCM)
- **FCM Integration:** The backend supports sending push notifications to users using Firebase Cloud Messaging (FCM).
- **Device Token Management:** User device tokens are stored and managed for targeted notifications.
- **Notification Triggers:** Notifications can be sent for ride updates, chat messages, or other important events.

---

## Security Notes
- All protected routes require a valid JWT token in HTTP-only cookies.
- Logout blacklists the token.
- Passwords are hashed using bcrypt.
- CORS is enabled for the frontend origin.
- Trip creation is restricted: users cannot create a trip if already hosting or joined to an active trip.

---

## Real-Time & Automation
- **Chat:** Real-time chat for each trip using Socket.IO.
- **Soft Deletion:** Trips are soft-deleted after departure or by user action.
- **Automatic Cleanup:** Trips are permanently deleted 15 days after creation using MongoDB TTL and scheduled cron jobs.

---

## Deployment
- Deploy backend on Render, Railway, Heroku, or AWS.
- Use MongoDB Atlas for cloud database.
- Update environment variables for production.
- Ensure your FCM credentials are set in environment variables for production.

---

## License
MIT

For issues or contributions, please open an issue or pull request on GitHub.
