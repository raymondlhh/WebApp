// Hamburger menu logic
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const navLinks = sidebar.querySelectorAll('li');
const sections = document.querySelectorAll('.spa-section');

openSidebarBtn.onclick = () => {
  sidebar.classList.add('open');
  overlay.classList.add('show');
};
closeSidebarBtn.onclick = () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
};
overlay.onclick = closeSidebarBtn.onclick;

navLinks.forEach(link => {
  link.onclick = () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    sections.forEach(sec => sec.classList.add('hidden'));
    document.getElementById(link.dataset.section + '-section').classList.remove('hidden');
    closeSidebarBtn.onclick();
  };
});
// Default: show profile
navLinks[0].classList.add('active');
sections.forEach((sec, i) => sec.classList.toggle('hidden', i !== 0));

// Profile data logic
const profile = JSON.parse(localStorage.getItem('profile')) || {
  name: 'Tone',
  email: 'Tone@gmail.com',
  password: '',
  phone: '+60 168264173',
  address: ''
};
const nameEl = document.getElementById('profile-name');
const emailEl = document.getElementById('profile-email');
const editBtn = document.getElementById('editProfileBtn');
const editForm = document.getElementById('edit-profile-form');
const cancelEditBtn = document.getElementById('cancelEdit');

function renderProfile() {
  nameEl.textContent = profile.name;
  emailEl.textContent = profile.email;
}
renderProfile();

editBtn.onclick = () => {
  editForm.classList.remove('hidden');
  editBtn.style.display = 'none';
  document.getElementById('edit-name').value = profile.name;
  document.getElementById('edit-email').value = profile.email;
  document.getElementById('edit-password').value = profile.password;
  document.getElementById('edit-phone').value = profile.phone;
  document.getElementById('edit-address').value = profile.address;
};

cancelEditBtn.onclick = () => {
  editForm.classList.add('hidden');
  editBtn.style.display = '';
};

editForm.onsubmit = (e) => {
  e.preventDefault();
  profile.name = document.getElementById('edit-name').value;
  profile.email = document.getElementById('edit-email').value;
  profile.password = document.getElementById('edit-password').value;
  profile.phone = document.getElementById('edit-phone').value;
  profile.address = document.getElementById('edit-address').value;
  localStorage.setItem('profile', JSON.stringify(profile));
  renderProfile();
  editForm.classList.add('hidden');
  editBtn.style.display = '';
};

// Favourites logic
const defaultFavourites = [];
let favourites = JSON.parse(localStorage.getItem('favourites')) || defaultFavourites;
const favList = document.getElementById('favourites-list');

function renderFavourites() {
  favList.innerHTML = '';
  if (!favourites.length) {
    favList.innerHTML = '<p class="empty-msg">No favourites yet</p>';
    return;
  }
  favourites.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'fav-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="fav-info">
        <div class="fav-title">${item.title}</div>
        <div class="fav-price">RM ${item.price}</div>
      </div>
      <button class="fav-remove" title="Remove">🗑️</button>
    `;
    div.querySelector('.fav-remove').onclick = () => {
      favourites.splice(idx, 1);
      localStorage.setItem('favourites', JSON.stringify(favourites));
      renderFavourites();
    };
    favList.appendChild(div);
  });
}
renderFavourites();

// Balance logic
let balance = parseFloat(localStorage.getItem('balance')) || 410.50;
const balanceAmount = document.getElementById('balance-amount');
const topupForm = document.getElementById('topup-form');
const topupAmount = document.getElementById('topup-amount');
const topupBtns = document.querySelectorAll('.topup-btn');

function renderBalance() {
  balanceAmount.textContent = balance.toFixed(2);
}
renderBalance();

topupBtns.forEach(btn => {
  btn.onclick = () => {
    topupAmount.value = btn.dataset.amount;
  };
});

topupForm.onsubmit = (e) => {
  e.preventDefault();
  let amt = parseFloat(topupAmount.value);
  if (isNaN(amt) || amt < 10 || amt > 500) {
    alert('Please enter a valid amount between RM10 and RM500.');
    return;
  }
  balance += amt;
  localStorage.setItem('balance', balance);
  renderBalance();
  topupAmount.value = 0;
};

// Log out (for demo, just clears localStorage and reloads)
document.querySelector('.logout-btn').onclick = () => {
  if (confirm('Log out?')) {
    localStorage.clear();
    location.reload();
  }
}; 