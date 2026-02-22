import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// AGENTICUM G5 — Frontend Firebase Configuration
// NOTE: These values should ideally be in .env. 
// For this hackathon project, we default to the project ID.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_G5_DEFAULT_KEY", 
  authDomain: `${import.meta.env.VITE_GCP_PROJECT_ID || "alphate-enterprise-g5"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_GCP_PROJECT_ID || "alphate-enterprise-g5",
  storageBucket: `${import.meta.env.VITE_GCP_PROJECT_ID || "alphate-enterprise-g5"}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "TODO",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "TODO"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
