import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDjk1O2zuxqMsuwWqTK8QqlU-AZsvEeqxU",
  authDomain: "secundaria21lomas.firebaseapp.com",
  projectId: "secundaria21lomas",
  storageBucket: "secundaria21lomas.firebasestorage.app",
  messagingSenderId: "927585002721",
  appId: "1:927585002721:web:5fb476783e70557eeb43a0",
  measurementId: "G-DL28G2CQ43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
