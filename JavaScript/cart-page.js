import { getCart, saveCart, getCartCount, getCartTotal, updateCartItem, removeCartItem } from './cart.js';

function renderBranch() {
  const branch = localStorage.getItem('selectedBranch') || 'AEON Nilai, Negeri Sembilan';
  const branchDetails = {
    'AEON Nilai, Negeri Sembilan': {
      address: 'Lot G13, Ground Floor, Aeon Mall Nilai, Putra Point, 71800 Bandar Baru Nilai, Negeri Sembilan'
    },
    'AEON Seremban 2, Negeri Sembilan': {
      address: 'Seremban 2, Negeri Sembilan'
    },
    'Mid Valley, Kuala Lumpur': {
      address: 'Mid Valley, Kuala Lumpur'
    }
  };
  const details = branchDetails[branch] || branchDetails['AEON Nilai, Negeri Sembilan'];
  document.getElementById('branch-card').innerHTML = `
    <div class="branch-info">
      <div class="branch-title">${branch}</div>
      <div class="branch-address">${details.address}</div>
    </div>
    <div class="branch-location-box" title="Show on map" tabindex="0">&#128205;</div>
  `;
}

function renderCart() {
  const cart = getCart();
  const cartItemsDiv = document.getElementById('cart-items');
  cartItemsDiv.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" class="cart-item-img" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${item.price}</div>
        <div class="cart-item-qty-controls">
          <button class="cart-qty-btn" data-action="decrease" data-id="${item.id}">-</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="cart-qty-btn" data-action="increase" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="cart-remove-btn" data-id="${item.id}">&#128465;</button>
    `;
    cartItemsDiv.appendChild(div);
  });
  document.getElementById('cart-grand-total').textContent = 'RM ' + getCartTotal().toFixed(2);
}

function updateCartCountBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) badge.textContent = getCartCount();
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('cart-qty-btn')) {
    const id = e.target.getAttribute('data-id');
    const action = e.target.getAttribute('data-action');
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (action === 'increase') {
      updateCartItem(id, item.qty + 1);
    } else if (action === 'decrease') {
      updateCartItem(id, item.qty - 1);
    }
    renderCart();
    updateCartCountBadge();
  }
  if (e.target.classList.contains('cart-remove-btn')) {
    const id = e.target.getAttribute('data-id');
    removeCartItem(id);
    renderCart();
    updateCartCountBadge();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderBranch();
  renderCart();
  updateCartCountBadge();
}); 