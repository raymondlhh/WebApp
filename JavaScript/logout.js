// Logout Handler
import { auth } from './firebase-init.js';
import { authUtils } from './auth-utils.js';

export class LogoutHandler {
  constructor() {
    this.auth = auth;
  }

  async logout() {
    try {
      await firebase.auth().signOut();
      console.log('User logged out successfully');
      
      // Clear stored user data
      authUtils.clearStoredUserData();
      
      // Redirect to login page
      window.location.href = 'Login.html';
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Static method for easy access
  static async performLogout() {
    const handler = new LogoutHandler();
    return await handler.logout();
  }
}

// Global logout function
window.logout = async function() {
  return await LogoutHandler.performLogout();
}; 