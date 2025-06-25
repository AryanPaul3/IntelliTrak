// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp2KMCQmMjGm-5Hq0FQKjVyjeIG6ECco4",
  authDomain: "intellitrak-app.firebaseapp.com",
  projectId: "intellitrak-app",
  storageBucket: "intellitrak-app.firebasestorage.app",
  messagingSenderId: "933934990242",
  appId: "1:933934990242:web:4ff91ee1fd5fd70c0968fb",
  measurementId: "G-J402D39X42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Authentication
export const auth = getAuth(app);