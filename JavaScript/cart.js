// Cart management functions
// Make functions globally available

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.qty), 0);
}

function updateCartItem(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = qty;
    if (item.qty <= 0) {
      removeCartItem(id);
      return;
    }
    saveCart(cart);
  }
}

function removeCartItem(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
}

// Make functions globally available
window.getCart = getCart;
window.saveCart = saveCart;
window.getCartCount = getCartCount;
window.getCartTotal = getCartTotal;
window.updateCartItem = updateCartItem;
window.removeCartItem = removeCartItem; 