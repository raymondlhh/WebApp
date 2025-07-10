import { auth, db } from './firebase-init.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

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
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email: email,
        name: '',
        balance: 0,
        createdAt: new Date()
      });
    }
    window.location.href = 'Home.html';
  } catch (err) {
    errorMsg.textContent = err.message.replace('Firebase:', '').replace('auth/', '').replace(/-/g, ' ');
  }
}; 