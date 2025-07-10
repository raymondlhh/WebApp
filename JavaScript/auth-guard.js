// Authentication Guard
import { authUtils } from './auth-utils.js';

export class AuthGuard {
  constructor(redirectUrl = 'Login.html') {
    this.redirectUrl = redirectUrl;
    this.checkAuth();
  }

  checkAuth() {
    // Check if user is logged in
    if (!authUtils.isLoggedIn()) {
      console.log('User not authenticated, redirecting to login');
      window.location.href = this.redirectUrl;
      return false;
    }
    
    console.log('User authenticated:', authUtils.getUserEmail());
    return true;
  }

  // Get current user info
  getCurrentUser() {
    return authUtils.getCurrentUser();
  }

  // Get user email
  getUserEmail() {
    return authUtils.getUserEmail();
  }

  // Get user UID
  getUserUID() {
    return authUtils.getUserUID();
  }

  // Check if email is verified
  isEmailVerified() {
    return authUtils.isEmailVerified();
  }
}

// Initialize auth guard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AuthGuard();
}); 