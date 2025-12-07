// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRNPjY3_95D_X-fetIBdhOZNwOu9FNiQ0",
  authDomain: "e-commerce-c4b5c.firebaseapp.com",
  projectId: "e-commerce-c4b5c",
  storageBucket: "e-commerce-c4b5c.firebasestorage.app",
  messagingSenderId: "797371316086",
  appId: "1:797371316086:web:c13ffccbf8bc449da4ac57",
  measurementId: "G-X2D9MGDFBS",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
