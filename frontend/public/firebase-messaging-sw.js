importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA8QT5VzoIcOosZ5bKBoQ6e7nuBpwcR1SY",
  authDomain: "jiitcommute.firebaseapp.com",
  projectId: "jiitcommute",
  storageBucket: "jiitcommute.firebasestorage.app",
  messagingSenderId: "42798980994",
  appId: "1:42798980994:web:c0661b3d549793a0e5f99b"
  // ...other config
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  // Use data field for notification
  const { title, body } = payload.data;
  self.registration.showNotification(
    title,
    {
      body: body,
      icon: '/images/jc-logo.png'
    }
  );
});
