// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGV6Gd4XOYP4Kk6EFqN9xg8rbFd9ZZ1Is",
  authDomain: "talexo-617b2.firebaseapp.com",
  projectId: "talexo-617b2"
};

// Agar app pehle se initialize nahi hai toh karo, warna purana use karo (Next.js crash roknay ke liye)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };