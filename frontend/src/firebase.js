// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "codecalorie-83ae4.firebaseapp.com",
  projectId: "codecalorie-83ae4",
  storageBucket: "codecalorie-83ae4.appspot.com",
  messagingSenderId: "23588751431",
  appId: "1:23588751431:web:a2260df304880c8347c962"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);