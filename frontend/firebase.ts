import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6-XJFR475jESZA6gZKWvcFh4UToS1Rig",
  authDomain: "bagman-05.firebaseapp.com",
  projectId: "bagman-05",
  storageBucket: "bagman-05.appspot.com",
  messagingSenderId: "471179130423",
  appId: "1:471179130423:web:792ba031c2e8bb289131b2",
  measurementId: "G-KTDEPV1QPV",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });
      
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
