import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5yNaDjZFHCseD5LUiwPSW999DTZ9FEzo",
  authDomain: "airlineticketcombine.firebaseapp.com",
  projectId: "airlineticketcombine",
  storageBucket: "airlineticketcombine.firebasestorage.app",
  messagingSenderId: "346204980471",
  appId: "1:346204980471:web:e27c5cab4f26ba425d3ff2",
  measurementId: "G-K37GCRMFDP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
