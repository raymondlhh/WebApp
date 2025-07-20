// Firebase Authentication Module
// Assumes firebase-init.js is loaded before this script

export class FirebaseAuth {
  constructor() {
    this.auth = window.auth;
  }

  async loginUser(email, password) {
    try {
      if (!this.auth) {
        throw new Error('Firebase not initialized');
      }
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log('User logged in successfully:', user.email);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'An error occurred during login';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  }

  getCurrentUser() {
    return this.auth ? this.auth.currentUser : null;
  }

  isUserLoggedIn() {
    return this.auth ? this.auth.currentUser !== null : false;
  }

  async logoutUser() {
    try {
      if (!this.auth) {
        throw new Error('Firebase not initialized');
      }
      await this.auth.signOut();
      console.log('User logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }
} 