// Assumes cart.js is loaded before this script

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
  const cart = window.getCart ? window.getCart() : [];
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
  document.getElementById('cart-grand-total').textContent = 'RM ' + (window.getCartTotal ? window.getCartTotal() : 0).toFixed(2);
}

function updateCartCountBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) badge.textContent = window.getCartCount ? window.getCartCount() : 0;
}

function getBranchCoords(branch) {
  // Add coordinates for each branch
  switch (branch) {
    case 'AEON Nilai, Negeri Sembilan':
      return { lat: 2.8145, lon: 101.7921 };
    case 'AEON Seremban 2, Negeri Sembilan':
      return { lat: 2.7105, lon: 101.9381 };
    case 'Mid Valley, Kuala Lumpur':
      return { lat: 3.1175, lon: 101.6771 };
    default:
      return { lat: 2.8145, lon: 101.7921 };
  }
}

function showMapModal(branch) {
  const coords = getBranchCoords(branch);
  const mapModal = document.getElementById('map-modal');
  const mapContainer = document.getElementById('map-container');
  // OpenStreetMap embed URL
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon-0.01}%2C${coords.lat-0.01}%2C${coords.lon+0.01}%2C${coords.lat+0.01}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`;
  mapContainer.innerHTML = `<iframe src="${osmUrl}" allowfullscreen loading="lazy"></iframe>`;
  mapModal.style.display = 'flex';
}

function hideMapModal() {
  document.getElementById('map-modal').style.display = 'none';
  document.getElementById('map-container').innerHTML = '';
}

// Add event delegation for location pin
function setupMapModalEvents() {
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('branch-location-box')) {
      const branch = localStorage.getItem('selectedBranch') || 'AEON Nilai, Negeri Sembilan';
      showMapModal(branch);
    }
    if (e.target.id === 'close-map-modal' || e.target.classList.contains('modal-overlay')) {
      hideMapModal();
    }
  });
  // Prevent modal click from closing when clicking inside box
  document.getElementById('map-modal').addEventListener('click', function(e) {
    if (e.target === this) hideMapModal();
  });
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('cart-qty-btn')) {
    const id = e.target.getAttribute('data-id');
    const action = e.target.getAttribute('data-action');
    const cart = window.getCart ? window.getCart() : [];
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (action === 'increase') {
      if (window.updateCartItem) window.updateCartItem(id, item.qty + 1);
    } else if (action === 'decrease') {
      if (window.updateCartItem) window.updateCartItem(id, item.qty - 1);
    }
    renderCart();
    updateCartCountBadge();
  }
  if (e.target.classList.contains('cart-remove-btn')) {
    const id = e.target.getAttribute('data-id');
    if (window.removeCartItem) window.removeCartItem(id);
    renderCart();
    updateCartCountBadge();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderBranch();
  renderCart();
  updateCartCountBadge();
  setupMapModalEvents();
}); 