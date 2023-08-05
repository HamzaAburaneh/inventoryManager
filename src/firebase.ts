// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Add this line

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDguX6U3pieLNr1uHWLXCjXoqVIbex4s3c",
  authDomain: "inventory-manager-764d2.firebaseapp.com",
  projectId: "inventory-manager-764d2",
  storageBucket: "inventory-manager-764d2.appspot.com",
  messagingSenderId: "79810336985",
  appId: "1:79810336985:web:cd8f4c9aa37cf5b4a286c8",
  measurementId: "G-3EGPB2HZJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app); // Add this line

export { db }; // Export db and analytics
