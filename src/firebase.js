import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjk1O2zuxqMsuwWqTK8QqlU-AZsvEeqxU",
  authDomain: "secundaria21lomas.firebaseapp.com",
  projectId: "secundaria21lomas",
  storageBucket: "secundaria21lomas.firebasestorage.app",
  messagingSenderId: "927585002721",
  appId: "1:927585002721:web:7c0dd886e7078f62eb43a0",
  measurementId: "G-ZM2N2PZF67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
