// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC2GBJpTMPN5qv808g2BgjwKVIPjkfIbB4",
  authDomain: "notifyyy-ed805.firebaseapp.com",
  projectId: "notifyyy-ed805",
  storageBucket: "notifyyy-ed805.firebasestorage.app",
  messagingSenderId: "1055805697902",
  appId: "1:1055805697902:web:69c90037ea6c46884bdb7f",
  measurementId: "G-0PT3QGH631"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };
