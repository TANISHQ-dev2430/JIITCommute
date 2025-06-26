import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
   apiKey: "AIzaSyA8QT5VzoIcOosZ5bKBoQ6e7nuBpwcR1SY",
  authDomain: "jiitcommute.firebaseapp.com",
  projectId: "jiitcommute",
  storageBucket: "jiitcommute.firebasestorage.app",
  messagingSenderId: "42798980994",
  appId: "1:42798980994:web:c0661b3d549793a0e5f99b"
  // ...other config
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
