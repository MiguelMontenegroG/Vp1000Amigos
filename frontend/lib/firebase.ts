import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJKy9-BMozuHNaM44B5tXuFVjJZsIX-hk",
  authDomain: "amigos-a83e7.firebaseapp.com",
  projectId: "amigos-a83e7",
  storageBucket: "amigos-a83e7.firebasestorage.app",
  messagingSenderId: "201174564066",
  appId: "1:201174564066:web:1806bcd42537adfb6932bb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
