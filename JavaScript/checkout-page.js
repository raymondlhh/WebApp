import { getCart, getCartTotal, getCartCount, saveCart } from './cart.js';

function getUserBalance() {
  return parseFloat(localStorage.getItem('userBalance') || '0');
}
function setUserBalance(val) {
  localStorage.setItem('userBalance', val.toFixed(2));
}

function renderCheckout() {
  const cart = getCart();
  const itemsDiv = document.getElementById('checkout-items');
  itemsDiv.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'checkout-item';
    div.innerHTML = `
      <img src="${item.image}" class="checkout-item-img" alt="${item.name}">
      <div class="checkout-item-info">
        <div class="checkout-item-title">${item.name}</div>
        <div class="checkout-item-qty">x${item.qty}</div>
      </div>
      <div class="checkout-item-price">RM ${parseFloat(item.price.replace(/[^\d.]/g, '')) .toFixed(2)}</div>
    `;
    itemsDiv.appendChild(div);
  });
  document.getElementById('checkout-total').textContent = 'RM ' + getCartTotal().toFixed(2);
  document.getElementById('checkout-item-count').textContent = getCartCount();
  document.getElementById('checkout-points').textContent = Math.floor(getCartTotal() * 10);
  // Update balance display
  document.getElementById('checkout-balance').textContent = 'Current Balance: RM ' + getUserBalance().toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
  renderCheckout();
});

document.getElementById('checkout-confirm-btn').onclick = () => {
  const total = getCartTotal();
  let balance = getUserBalance();
  if (balance < total) {
    alert('Insufficient balance to complete this order. Please top up your balance.');
    return;
  }
  setUserBalance(balance - total);
  // Award points: 10 points per RM1 spent
  let points = Math.floor(total * 10);
  let currentPoints = parseInt(localStorage.getItem('userPoints') || '0', 10);
  localStorage.setItem('userPoints', currentPoints + points);

  // Add notification for order
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const now = new Date();
  notifications.unshift({
    title: 'Payment Successful',
    message: `RM ${total.toFixed(2)} has been successfully paid`,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    read: false
  });
  notifications.unshift({
    title: 'Points Earned',
    message: `You earned ${points} points for this order`,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    read: false
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
  if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
  if (typeof showNotificationModal === 'function') showNotificationModal();

  // Update Firestore if user is logged in
  if (window.firebase && firebase.auth && firebase.auth().currentUser) {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(user.uid);
    userRef.get().then(doc => {
      const firestorePoints = (doc.exists && doc.data().rewardsPoints) ? doc.data().rewardsPoints : 0;
      userRef.update({ rewardsPoints: firestorePoints + points }).then(() => {
        saveCart([]);
        alert('Order confirmed! Thank you for your purchase.');
        window.location.href = 'Menu.html';
      });
    });
  } else {
    saveCart([]);
    alert('Order confirmed! Thank you for your purchase.');
    window.location.href = 'Menu.html';
  }
}; 