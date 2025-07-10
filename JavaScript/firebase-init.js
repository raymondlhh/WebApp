// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCU18ZWzCcV9qT3BwHAMFuSDhknqgZJ5c4",
  authDomain: "testing01-bdf3c.firebaseapp.com",
  projectId: "testing01-bdf3c",
  storageBucket: "testing01-bdf3c.firebasestorage.app",
  messagingSenderId: "527415999821",
  appId: "1:527415999821:web:985eae92d529c21f04cb04",
  measurementId: "G-84DKBZ85HV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the services for use in other modules
export { app, analytics, auth, db, storage }; 