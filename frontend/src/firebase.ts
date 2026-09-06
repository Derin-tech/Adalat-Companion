import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBAO4tEnMSf5C1SJt6qY4cApyrGX2VAlMA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "adalat-companion.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "adalat-companion",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "adalat-companion.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "514790545004",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:514790545004:web:3af778e9eb914c7ad4ea49",
};

let auth: any = null;
let googleProvider: any = null;

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (err) {
  console.warn("Firebase initialization error:", err);
}

export { auth, googleProvider };
