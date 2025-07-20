(async function() {
  let menuItems;
  try {
    const mod = await import('./menu-data.js');
    menuItems = mod.menuItems;
  } catch (e) {
    menuItems = window.menuItems;
  }

  function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
  }

  const params = new URLSearchParams(window.location.search);
  let id = params.get('id') || 'party_set_b';
  if (id === '100plus') id = '_100plus';
  const item = menuItems[id];

  if (item) {
    document.getElementById('item-image').src = item.image;
    document.getElementById('item-title').textContent = item.name;
    document.getElementById('item-stars').textContent = getStars(item.rating);
    document.getElementById('item-rating-value').textContent = item.rating;
    document.getElementById('item-review-count').textContent = `${item.reviews.length} Reviews`;
    document.getElementById('item-reviews').innerHTML = item.reviews.map(r => `<div class='review-card'><b>${r.name}</b><br><span>"${r.text}"</span></div>`).join('');
    document.getElementById('item-included-list').innerHTML = item.included.map(i => `<div>${i}</div>`).join('');
    document.getElementById('item-price').textContent = item.price;
  }

  let qty = 1;
  const qtySpan = document.getElementById('item-qty');
  document.getElementById('decrease-qty').onclick = () => {
    if (qty > 1) qty--;
    qtySpan.textContent = qty;
  };
  document.getElementById('increase-qty').onclick = () => {
    qty++;
    qtySpan.textContent = qty;
  };

  // Cart functionality
  function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }
  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  document.getElementById('add-to-cart').onclick = () => {
    const cart = getCart();
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id,
        name: item.name,
        price: item.price,
        image: item.image,
        qty
      });
    }
    saveCart(cart);
    alert('Added to cart!');
  };

  // Export getCart for use elsewhere
  window.getCart = getCart;
})(); 