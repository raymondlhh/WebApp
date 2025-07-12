export function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}
export function getCartTotal() {
  return getCart().reduce((sum, item) => sum + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.qty), 0);
}
export function updateCartItem(id, qty) {
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
export function removeCartItem(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
} 