import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5TsV6amupod7cjOCxRTv7IoyQElrpB8w",
  authDomain: "vendtrack-149b7.firebaseapp.com",
  projectId: "vendtrack-149b7",
  storageBucket: "vendtrack-149b7.firebasestorage.app",
  messagingSenderId: "957357999897",
  appId: "1:957357999897:web:91d30384824249488ea788",
  measurementId: "G-G48NJGBE9K"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
