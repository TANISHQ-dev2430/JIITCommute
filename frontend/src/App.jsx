import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Host from "./pages/Host";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import History from "./pages/History";
import { ToastContainer, toast } from "react-toastify";
import AutoLogin from "./pages/AutoLogin";
import About from "./pages/About";
import { messaging, getToken, onMessage } from "./firebase";
import axios from "axios";
import { API_BASE_URL } from "./utils/api";

export default function App() {
  useEffect(() => {
    if ("Notification" in window && navigator.serviceWorker) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          getToken(messaging, { vapidKey:'BHUQ8swB0zZl87Ql1fJOTKd_FdadNKBBbztztfugk_ITutETfMOqB1m7CfewCC8yrjsqxk4W6w6mS6J1yRuiim0' })
            .then((currentToken) => {
              if (currentToken) {
                axios.post(
                  `${API_BASE_URL}/users/device-token`,
                  { token: currentToken },
                  { withCredentials: true }
                );
              }
            })
            .catch((err) => {
              console.log("FCM token error:", err);
            });
        }
      });
      onMessage(messaging, (() => {
        let lastChatMsgId = null;
        return (payload) => {
          
          const userStr = localStorage.getItem("user");
          let currentUserId = null;
          try {
            if (userStr) {
              const userObj = JSON.parse(userStr);
              currentUserId = userObj._id || userObj.id;
            }
          } catch (e) {}
          // Host: show toast only (for trip notifications, use data payload)
          if (
            payload.data &&
            payload.data.hostId &&
            currentUserId &&
            payload.data.hostId === currentUserId &&
            (payload.data.title === "New Join Request" || payload.data.title === "Join Cancelled")
          ) {
            toast.info(
              `${payload.data.title}: ${payload.data.body}`,
              { autoClose: 4000, className: "customtoast" }
            );
            return;
          }
          if (
            payload.data &&
            payload.data.event === "removedFromTrip"
          ) {
            toast.info(
              `Removed from Trip: ${payload.data.body}`,
              { autoClose: 2000, className: "customtoast" }
            );
            return;
          }
          // For all other notifications, prefer data payload if present
          if (
            payload.data &&
            typeof payload.data.title === 'string' &&
            typeof payload.data.body === 'string' &&
            payload.data.title.trim() &&
            payload.data.body.trim()
          ) {
            toast.info(
              `${payload.data.title}: ${payload.data.body}`,
              { autoClose: 2000, className: "customtoast" }
            );
            return;
          }
          // Fallback to notification payload (for chat or legacy)
          if (
            payload.notification &&
            typeof payload.notification.title === 'string' &&
            typeof payload.notification.body === 'string' &&
            payload.notification.title.trim() &&
            payload.notification.body.trim()
          ) {
            toast.info(
              `${payload.notification.title}: ${payload.notification.body}`,
              { autoClose: 2000, className: "customtoast" }
            );
          }
        };
      })());
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<AutoLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/host" element={<Host />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <ToastContainer newestOnTop theme="dark" />
    </Router>
  );
}
