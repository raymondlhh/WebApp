// Signup Handler using Firebase CDN compat API
// Assumes firebase-init.js is loaded before this script

class SignupHandler {
  constructor() {
    this.auth = null;
    this.db = null;
    this.initializeFirebase();
  }

  initializeFirebase() {
    // Wait for Firebase to be initialized
    const checkFirebase = () => {
      if (window.auth && window.db && window.firebase) {
        this.auth = window.auth;
        this.db = window.db;
        this.initializeEventListeners();
      } else {
        // Retry after a short delay if Firebase is not yet available
        setTimeout(checkFirebase, 100);
      }
    };
    checkFirebase();
  }

  initializeEventListeners() {
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
      signupBtn.addEventListener('click', () => this.handleSignup());
    }

    const passwordToggle = document.getElementById('password-toggle');
    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
    }

    // Enter key support for signup
    const inputs = ['name', 'email', 'password', 'phone'];
    inputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.handleSignup();
          }
        });
      }
    });
  }

  async handleSignup() {
    if (!this.auth || !this.db) {
      this.showError('Firebase is not initialized. Please refresh the page.');
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value.trim();
    const errorMsg = document.getElementById('error-msg');
    const signupText = document.getElementById('signup-text');
    const signupLoading = document.getElementById('signup-loading');
    const signupBtn = document.getElementById('signup-btn');

    // Hide previous error
    errorMsg.style.display = 'none';

    // Validate name
    if (!name) {
      this.showError('Please enter your name');
      return;
    }

    // Validate email
    if (!email || !email.includes('@')) {
      this.showError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!password || password.length < 6) {
      this.showError('Password must be at least 6 characters long');
      return;
    }

    // Validate phone
    if (!phone) {
      this.showError('Please enter your phone number');
      return;
    }

    // Show loading
    this.setLoadingState(true);

    try {
      // Create user with Firebase Authentication
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await this.storeUserData(user.uid, {
        name: name,
        email: email,
        password: password,
        phone: phone,
        rewardsPoints: 0, // Initialize with 0 points
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('User created successfully:', user.email);
      this.showSuccess('Registration successful! Redirecting to login...');

      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = 'Login.html';
      }, 2000);

    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'An error occurred during registration';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled. Please contact support.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message || 'Registration failed. Please try again.';
      }

      this.showError(errorMessage);
      this.setLoadingState(false);
    }
  }

  async storeUserData(uid, userData) {
    try {
      await this.db.collection('users').doc(uid).set(userData);
      console.log('User data stored in Firestore');
    } catch (error) {
      console.error('Error storing user data:', error);
      // Don't throw error here as the user account was created successfully
      // The user data can be stored later if needed
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
    const signupText = document.getElementById('signup-text');
    const signupLoading = document.getElementById('signup-loading');
    const signupBtn = document.getElementById('signup-btn');

    if (isLoading) {
      signupBtn.disabled = true;
      signupText.style.display = 'none';
      signupLoading.style.display = 'inline-block';
    } else {
      signupBtn.disabled = false;
      signupText.style.display = 'inline';
      signupLoading.style.display = 'none';
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
  new SignupHandler();
  // Set initial icon for password toggle
  const toggleBtn = document.getElementById('password-toggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = '<img src="../assets/images/icons/CloseEye.png" alt="Show" style="width:22px;height:22px;vertical-align:middle;">';
  }
}); 