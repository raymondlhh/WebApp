// Authentication Utilities
import { auth } from './firebase-init.js';
import { onAuthStateChanged } from 'firebase/auth';

export class AuthUtils {
  constructor() {
    this.auth = auth;
    this.currentUser = null;
    this.authStateListeners = [];
    this.initializeAuthStateListener();
  }

  initializeAuthStateListener() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      console.log('Auth state changed:', user ? user.email : 'No user');
      
      // Notify all listeners
      this.authStateListeners.forEach(listener => {
        listener(user);
      });
    });
  }

  // Add listener for auth state changes
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user email
  getUserEmail() {
    return this.currentUser ? this.currentUser.email : null;
  }

  // Get user UID
  getUserUID() {
    return this.currentUser ? this.currentUser.uid : null;
  }

  // Check if user email is verified
  isEmailVerified() {
    return this.currentUser ? this.currentUser.emailVerified : false;
  }

  // Redirect if not authenticated
  requireAuth(redirectUrl = 'Login.html') {
    if (!this.isLoggedIn()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  // Redirect if already authenticated
  redirectIfAuthenticated(redirectUrl = 'Home.html') {
    if (this.isLoggedIn()) {
      window.location.href = redirectUrl;
      return true;
    }
    return false;
  }

  // Store user data in localStorage (optional)
  storeUserData(userData = {}) {
    if (this.currentUser) {
      const data = {
        uid: this.currentUser.uid,
        email: this.currentUser.email,
        emailVerified: this.currentUser.emailVerified,
        ...userData
      };
      localStorage.setItem('userData', JSON.stringify(data));
    }
  }

  // Get stored user data
  getStoredUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  // Clear stored user data
  clearStoredUserData() {
    localStorage.removeItem('userData');
  }
}

// Create global instance
export const authUtils = new AuthUtils(); 