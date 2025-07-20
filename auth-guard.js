// Authentication Guard
// Assumes auth-utils.js is loaded before this script

export class AuthGuard {
  constructor(redirectUrl = 'Login.html') {
    this.redirectUrl = redirectUrl;
    this.checkAuth();
  }

  checkAuth() {
    // Check if user is logged in
    if (!window.authUtils || !window.authUtils.isLoggedIn()) {
      console.log('User not authenticated, redirecting to login');
      window.location.href = this.redirectUrl;
      return false;
    }
    
    console.log('User authenticated:', window.authUtils.getUserEmail());
    return true;
  }

  // Get current user info
  getCurrentUser() {
    return window.authUtils ? window.authUtils.getCurrentUser() : null;
  }

  // Get user email
  getUserEmail() {
    return window.authUtils ? window.authUtils.getUserEmail() : null;
  }

  // Get user UID
  getUserUID() {
    return window.authUtils ? window.authUtils.getUserUID() : null;
  }

  // Check if email is verified
  isEmailVerified() {
    return window.authUtils ? window.authUtils.isEmailVerified() : false;
  }
}

// Initialize auth guard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AuthGuard();
}); 