// Firebase initialization using CDN
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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Make variables globally available for other scripts (non-module usage)
window.auth = auth;
window.db = db;
window.firebase = firebase;

// If you need Storage, you can also initialize it here
// const storage = firebase.storage(); 