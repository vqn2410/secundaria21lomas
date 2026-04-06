import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Configuración de la App Principal (secundaria21lomas)
const firebaseConfig = {
  apiKey: "AIzaSyDjk1O2zuxqMsuwWqTK8QqlU-AZsvEeqxU",
  authDomain: "secundaria21lomas.firebaseapp.com",
  projectId: "secundaria21lomas",
  storageBucket: "secundaria21lomas.firebasestorage.app",
  messagingSenderId: "927585002721",
  appId: "1:927585002721:web:5fb476783e70557eeb43a0",
  measurementId: "G-DL28G2CQ43"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Configuración de la App GPD (practicasdocentesensam)
// OJO: Usamos el SenderId y AppId original de este proyecto (5695) ya que el del root (5879) daba error
const gpdConfig = {
  apiKey: "AIzaSyALHo591XYOPUr7UIcVKCNDCLR3eMWxZkA",
  authDomain: "practicasdocentesensam.firebaseapp.com",
  projectId: "practicasdocentesensam",
  storageBucket: "practicasdocentesensam.firebasestorage.app",
  messagingSenderId: "569502905470",
  appId: "1:569502905470:web:4ff92723c3b0eb6e57cdfc"
};

const gpdApp = getApps().find(a => a.name === "GPD_APP") || initializeApp(gpdConfig, "GPD_APP");
export const gpdDb = getFirestore(gpdApp);
export const gpdAuth = getAuth(gpdApp);
export const gpdStorage = getStorage(gpdApp);
