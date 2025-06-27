importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC2GBJpTMPN5qv808g2BgjwKVIPjkfIbB4",
  authDomain: "notifyyy-ed805.firebaseapp.com",
  projectId: "notifyyy-ed805",
  messagingSenderId: "1055805697902",
  appId: "1:1055805697902:web:69c90037ea6c46884bdb7f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('🔔 Received background message ', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, { body });
});
