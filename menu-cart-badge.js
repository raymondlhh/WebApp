function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = count;
}
window.addEventListener('storage', updateCartBadge);
document.addEventListener('cart-updated', updateCartBadge);
document.addEventListener('DOMContentLoaded', updateCartBadge); 