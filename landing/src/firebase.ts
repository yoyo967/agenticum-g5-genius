import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// AGENTICUM G5 — Frontend Firebase Configuration
// Uses correct Cloud Project hash and settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_G5_DEFAULT_KEY", 
  authDomain: `${import.meta.env.VITE_GCP_PROJECT_ID || "online-marketing-manager"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_GCP_PROJECT_ID || "online-marketing-manager",
  storageBucket: `${import.meta.env.VITE_GCP_PROJECT_ID || "online-marketing-manager"}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "TODO",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "TODO"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enforce local persistence for sessions
setPersistence(auth, browserLocalPersistence).catch(console.error);
