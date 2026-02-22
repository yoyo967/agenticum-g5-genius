import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// AGENTICUM G5 — Frontend Firebase Configuration
// NOTE: These values should ideally be in .env. 
// For this hackathon project, we default to the project ID.
const firebaseConfig = {
  apiKey: "TODO_USER_INPUT_REQUIRED", 
  authDomain: "online-marketing-manager.firebaseapp.com",
  projectId: "online-marketing-manager",
  storageBucket: "online-marketing-manager.appspot.com",
  messagingSenderId: "TODO",
  appId: "TODO"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
