// src/helpers/requestPushPermission.js
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import apiService from "../services/api";

const VAPID_KEY = "BBfC0XxWxTH6ZpHKeHz88qWWAo7xV_1ObDpVS9u3rkCeIeSZNoHv2dOE1jGWf3KHkV9evM6HkmBWqrqqqtubGAg"; // ⚠️ Replace this

export async function requestPushPermission() {
  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) {
      console.log("FCM Token:", token);
      // Send token to backend to save
      try {
        await apiService.updateFcmToken(token);
        console.log("FCM token sent to backend successfully");
      } catch (error) {
        console.error("Failed to send FCM token to backend", error);
      }
      return token; 
    }
  } catch (err) {
    console.error("Permission denied or error getting token", err);
  }
}
