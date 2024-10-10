import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdSbRxRDxQk9ApXMpfscX_b5VP45-TJmU",
  authDomain: "lt-house-4024d.firebaseapp.com",
  projectId: "lt-house-4024d",
  storageBucket: "lt-house-4024d.appspot.com",
  messagingSenderId: "390395158173",
  appId: "1:390395158173:web:6a566eced369e9faa0be74",
  measurementId: "G-4JK6CV9C0N"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();