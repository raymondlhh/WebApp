// Assumes firebase-init.js is loaded before this script

const form = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('error-msg');
const toggleText = document.getElementById('toggle-text');
const toggleLink = document.getElementById('toggle-link');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');

let isLogin = true;

function setMode(login) {
  isLogin = login;
  formTitle.textContent = login ? 'Login' : 'Register';
  submitBtn.textContent = login ? 'Login' : 'Register';
  toggleText.innerHTML = login
    ? "Don't have an account? <a href='#' id='toggle-link'>Register</a>"
    : "Already have an account? <a href='#' id='toggle-link'>Login</a>";
  errorMsg.textContent = '';
  document.getElementById('toggle-link').onclick = (e) => {
    e.preventDefault();
    setMode(!isLogin);
  };
}
setMode(true);

form.onsubmit = async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  try {
    if (!window.auth) {
      throw new Error('Firebase not initialized');
    }
    if (isLogin) {
      await window.auth.signInWithEmailAndPassword(email, password);
    } else {
      const userCred = await window.auth.createUserWithEmailAndPassword(email, password);
      // Create user profile in Firestore using the new schema
      if (window.UserService) {
        await window.UserService.createUser(userCred.user.uid, {
          name: '',
          email: email,
          password: password, // In production, this should be encrypted
          address: '',
          phone: '',
          rewardsPoints: 0
        });
      }
    }
    window.location.href = 'Home.html';
  } catch (err) {
    errorMsg.textContent = err.message.replace('Firebase:', '').replace('auth/', '').replace(/-/g, ' ');
  }
}; 