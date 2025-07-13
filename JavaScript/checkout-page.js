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
  saveCart([]);
  alert('Order confirmed! Thank you for your purchase.');
  window.location.href = 'Menu.html';
}; 