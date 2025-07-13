// Login Handler using Firebase CDN compat API
// Assumes firebase-init.js is loaded before this script

class LoginHandler {
  constructor() {
    this.auth = null;
    this.initializeFirebase();
  }

  initializeFirebase() {
    // Wait for Firebase to be initialized
    const checkFirebase = () => {
      if (window.auth && window.firebase) {
        this.auth = window.auth;
        this.initializeEventListeners();
        this.checkAuthState();
      } else {
        // Retry after a short delay if Firebase is not yet available
        setTimeout(checkFirebase, 100);
      }
    };
    checkFirebase();
  }

  checkAuthState() {
    if (this.auth && this.auth.currentUser) {
      window.location.href = 'Home.html';
    }
  }

  initializeEventListeners() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.handleLogin());
    }
    const passwordToggle = document.getElementById('password-toggle');
    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
    }
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    if (emailInput && passwordInput) {
      [emailInput, passwordInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.handleLogin();
          }
        });
      });
    }
  }

  async handleLogin() {
    if (!this.auth) {
      this.showError('Firebase is not initialized. Please refresh the page.');
      return;
    }

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
    const loginText = document.getElementById('login-text');
    const loginLoading = document.getElementById('login-loading');
    const loginBtn = document.getElementById('login-btn');
    errorMsg.style.display = 'none';
    if (!email || !email.includes('@')) {
      this.showError('Please enter a valid email address');
      return;
    }
    if (!password) {
      this.showError('Please enter password');
      return;
    }
    this.setLoadingState(true);
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      this.showSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = 'Home.html';
      }, 1000);
    } catch (error) {
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
          errorMessage = error.message || 'Login failed. Please try again.';
      }
      this.showError(errorMessage);
      this.setLoadingState(false);
    }
  }

  showError(message) {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    errorMsg.style.color = '#ff4444';
  }

  showSuccess(message) {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    errorMsg.style.color = '#4CAF50';
  }

  setLoadingState(isLoading) {
    const loginText = document.getElementById('login-text');
    const loginLoading = document.getElementById('login-loading');
    const loginBtn = document.getElementById('login-btn');
    if (isLoading) {
      loginBtn.disabled = true;
      loginText.style.display = 'none';
      loginLoading.style.display = 'inline-block';
    } else {
      loginBtn.disabled = false;
      loginText.style.display = 'inline';
      loginLoading.style.display = 'none';
    }
  }

  togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const toggleBtn = document.getElementById('password-toggle');
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      toggleBtn.innerHTML = '<img src="../assets/images/icons/OpenEye.png" alt="Hide" style="width:22px;height:22px;vertical-align:middle;">';
    } else {
      passwordField.type = 'password';
      toggleBtn.innerHTML = '<img src="../assets/images/icons/CloseEye.png" alt="Show" style="width:22px;height:22px;vertical-align:middle;">';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LoginHandler();
  // Set initial icon for password toggle
  const toggleBtn = document.getElementById('password-toggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = '<img src="../assets/images/icons/CloseEye.png" alt="Show" style="width:22px;height:22px;vertical-align:middle;">';
  }
}); 