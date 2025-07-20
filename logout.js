// Logout Handler
// Assumes firebase-init.js is loaded before this script

export class LogoutHandler {
  constructor() {
    this.auth = window.auth;
  }

  async logout() {
    try {
      if (!this.auth) {
        throw new Error('Firebase not initialized');
      }
      await this.auth.signOut();
      console.log('User logged out successfully');
      
      // Clear stored user data
      if (window.authUtils) {
        window.authUtils.clearStoredUserData();
      }
      
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