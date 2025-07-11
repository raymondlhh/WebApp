import { UserService, FavouritesService, NotificationsService } from './Database.js';

document.addEventListener('DOMContentLoaded', () => {
  // Hamburger menu logic
  const openSidebarBtn = document.getElementById('openSidebar');
  const closeSidebarBtn = document.getElementById('closeSidebar');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const navLinks = sidebar ? sidebar.querySelectorAll('li') : [];
  const sections = document.querySelectorAll('.spa-section');

  if (openSidebarBtn && closeSidebarBtn && sidebar && overlay) {
    openSidebarBtn.onclick = () => {
      sidebar.classList.add('open');
      overlay.classList.add('show');
    };
    closeSidebarBtn.onclick = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    };
    overlay.onclick = closeSidebarBtn.onclick;
  }
  if (navLinks.length && sections.length) {
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
  }

  // Firebase logic
  // Redirect to login if not authenticated
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'Login.html';
    } else {
      loadProfile();
      loadFavourites();
      loadBalance();
      loadNotifications();
    }
  });

  // Profile logic
  const nameEl = document.getElementById('profile-name');
  const emailEl = document.getElementById('profile-email');
  const editBtn = document.getElementById('editProfileBtn');
  const editForm = document.getElementById('edit-profile-form');
  const cancelEditBtn = document.getElementById('cancelEdit');
  const profileHeader = document.querySelector('.profile-header');

  async function loadProfile() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    const userData = await UserService.getUser(user.uid);
    if (userData) {
      nameEl.textContent = userData.name || '';
      emailEl.textContent = userData.email || user.email;
      // Pre-fill edit form fields if present
      if (editForm) {
        document.getElementById('edit-name').value = userData.name || '';
        document.getElementById('edit-email').value = userData.email || user.email;
        document.getElementById('edit-password').value = '';
        document.getElementById('edit-phone').value = userData.phone || '';
        document.getElementById('edit-address').value = userData.address || '';
      }
    }
  }

  // Show inline edit form instead of redirect
  // if (editBtn && editForm && profileHeader) {
  //   editBtn.addEventListener('click', function() {
  //     // Pre-fill form fields with current profile data
  //     const user = auth.currentUser;
  //     if (user) {
  //       UserService.getUser(user.uid).then(userData => {
  //         document.getElementById('edit-name').value = userData?.name || '';
  //         document.getElementById('edit-email').value = userData?.email || user.email;
  //         document.getElementById('edit-password').value = '';
  //         document.getElementById('edit-phone').value = userData?.phone || '';
  //         document.getElementById('edit-address').value = userData?.address || '';
  //       });
  //     }
  //     editForm.classList.remove('hidden');
  //     profileHeader.style.display = 'none';
  //   });
  // }

  // Cancel edit: hide form, show profile
  if (cancelEditBtn && editForm && profileHeader) {
    cancelEditBtn.addEventListener('click', function() {
      editForm.classList.add('hidden');
      profileHeader.style.display = '';
    });
  }

  // Save edit: update user, hide form, show profile
  if (editForm && profileHeader) {
    editForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const user = firebase.auth().currentUser;
      if (!user) return;
      await UserService.updateUser(user.uid, {
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        address: document.getElementById('edit-address').value
      });
      await loadProfile();
      editForm.classList.add('hidden');
      profileHeader.style.display = '';
    });
  }

  // Modal elements
  const profileEditModal = document.getElementById('profile-edit-modal');
  const openProfileEditModalBtn = document.getElementById('editProfileBtn');
  const closeProfileEditModalBtn = document.getElementById('closeProfileEditModal');
  const saveProfileEditModalBtn = document.getElementById('saveProfileEditModal');
  const modalCancelEditBtn = document.getElementById('modal-cancelEdit');
  const modalEditProfileForm = document.getElementById('modal-edit-profile-form');
  const modalProfilePic = document.getElementById('modal-profile-pic');
  const switchProfilePicBtn = document.getElementById('switchProfilePicBtn');
  const toggleModalPasswordBtn = document.getElementById('toggleModalPassword');
  const modalEditPassword = document.getElementById('modal-edit-password');
  const profilePicPanel = document.getElementById('profile-pic-panel');

  // Profile picture switching logic
  const profilePics = [
    '../assets/images/others/Profile.png',
    '../assets/images/others/Profile2.png',
    '../assets/images/others/Profile3.png'
  ];
  let currentProfilePicIndex = 0;
  if (switchProfilePicBtn && modalProfilePic) {
    switchProfilePicBtn.addEventListener('click', function(e) {
      e.preventDefault();
      currentProfilePicIndex = (currentProfilePicIndex + 1) % profilePics.length;
      modalProfilePic.src = profilePics[currentProfilePicIndex];
    });
  }

  // Show/hide password toggle
  if (toggleModalPasswordBtn && modalEditPassword) {
    toggleModalPasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (modalEditPassword.type === 'password') {
        modalEditPassword.type = 'text';
        toggleModalPasswordBtn.innerHTML = '&#128064;'; // open eye
      } else {
        modalEditPassword.type = 'password';
        toggleModalPasswordBtn.innerHTML = '&#128065;'; // closed eye
      }
    });
  }

  // Profile picture panel logic
  if (switchProfilePicBtn && profilePicPanel && modalProfilePic) {
    switchProfilePicBtn.addEventListener('click', function(e) {
      e.preventDefault();
      profilePicPanel.classList.toggle('hidden');
    });
    // Hide panel if click outside
    document.addEventListener('click', function(e) {
      if (!profilePicPanel.contains(e.target) && e.target !== switchProfilePicBtn && e.target !== modalProfilePic) {
        profilePicPanel.classList.add('hidden');
      }
    });
    // Handle image selection
    profilePicPanel.querySelectorAll('.pic-option').forEach(function(img) {
      img.addEventListener('click', function() {
        modalProfilePic.src = img.dataset.pic;
        profilePicPanel.classList.add('hidden');
      });
    });
  }

  // Save button submits the modal form
  if (saveProfileEditModalBtn && modalEditProfileForm) {
    saveProfileEditModalBtn.addEventListener('click', function() {
      modalEditProfileForm.requestSubmit();
    });
  }

  // Open modal and pre-fill fields
  if (openProfileEditModalBtn && profileEditModal) {
    openProfileEditModalBtn.addEventListener('click', async function() {
      console.log('Edit Profile button clicked'); // Debug log
      const user = firebase.auth().currentUser;
      if (user) {
        const userData = await UserService.getUser(user.uid);
        document.getElementById('modal-edit-name').value = userData?.name || '';
        document.getElementById('modal-edit-email').value = userData?.email || user.email;
        document.getElementById('modal-edit-password').value = '';
        document.getElementById('modal-edit-phone').value = userData?.phone || '';
        document.getElementById('modal-edit-address').value = userData?.address || '';
      }
      profileEditModal.classList.remove('hidden');
    });
  }

  // Close modal on X or Cancel
  function closeProfileEditModal() {
    profileEditModal.classList.add('hidden');
  }
  if (closeProfileEditModalBtn) closeProfileEditModalBtn.addEventListener('click', closeProfileEditModal);
  if (modalCancelEditBtn) modalCancelEditBtn.addEventListener('click', closeProfileEditModal);

  // Save profile from modal
  if (modalEditProfileForm) {
    modalEditProfileForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const user = firebase.auth().currentUser;
      if (!user) return;
      await UserService.updateUser(user.uid, {
        name: document.getElementById('modal-edit-name').value,
        email: document.getElementById('modal-edit-email').value,
        phone: document.getElementById('modal-edit-phone').value,
        address: document.getElementById('modal-edit-address').value
      });
      await loadProfile();
      closeProfileEditModal();
    });
  }

  // Favourites logic
  const favList = document.getElementById('favourites-list');
  async function loadFavourites() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    const favourites = await FavouritesService.getUserFavourites(user.uid);
    favList.innerHTML = '';
    if (favourites.length === 0) {
      favList.innerHTML = '<p class="empty-msg">No favourites yet</p>';
      return;
    }
    favourites.forEach(fav => {
      const div = document.createElement('div');
      div.className = 'fav-item';
      div.innerHTML = `
        <img src="${fav.img || '../assets/images/menu/default.jpg'}" alt="${fav.title || 'Menu Item'}">
        <div class="fav-info">
          <div class="fav-title">${fav.title || 'Menu Item'}</div>
          <div class="fav-price">RM ${fav.price || '0.00'}</div>
        </div>
        <button class="fav-remove" title="Remove">🗑️</button>
      `;
      div.querySelector('.fav-remove').onclick = async () => {
        await FavouritesService.removeFromFavourites(fav.id);
        loadFavourites();
      };
      favList.appendChild(div);
    });
  }

  // Balance logic (using rewardsPoints instead of balance)
  const balanceAmount = document.getElementById('balance-amount');
  const topupForm = document.getElementById('topup-form');
  const topupAmount = document.getElementById('topup-amount');
  const topupBtns = document.querySelectorAll('.topup-btn');
  async function loadBalance() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    const userData = await UserService.getUser(user.uid);
    if (userData) {
      balanceAmount.textContent = (userData.rewardsPoints || 0).toFixed(2);
    }
  }
  topupBtns.forEach(btn => {
    btn.onclick = () => {
      topupAmount.value = btn.dataset.amount;
    };
  });
  topupForm.onsubmit = async (e) => {
    e.preventDefault();
    const user = firebase.auth().currentUser;
    if (!user) return;
    let amt = parseFloat(topupAmount.value);
    if (isNaN(amt) || amt < 10 || amt > 500) {
      alert('Please enter a valid amount between RM10 and RM500.');
      return;
    }
    await UserService.updateUserRewardsPoints(user.uid, amt);
    loadBalance();
    topupAmount.value = 0;
  };

  // Notifications logic
  const notificationList = document.querySelector('.notification-list');
  async function loadNotifications() {
    if (!notificationList) return;
    const user = firebase.auth().currentUser;
    if (!user) return;
    const notifications = await NotificationsService.getUserNotifications(user.uid);
    notificationList.innerHTML = '';
    if (notifications.length === 0) {
      notificationList.innerHTML = '<p class="empty-msg">No notifications yet</p>';
      return;
    }
    notifications.forEach(n => {
      const div = document.createElement('div');
      div.className = 'notification-item';
      const date = n.date ? new Date(n.date.toDate ? n.date.toDate() : n.date) : new Date();
      const dateStr = date.toLocaleDateString('en-GB');
      const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      div.innerHTML = `
        <div class="notification-row">
          <span class="notification-main">${n.message || 'Notification'}</span>
          <span class="notification-date">${dateStr}</span>
        </div>
        <div class="notification-row">
          <span class="notification-desc">${n.message || 'Notification message'}</span>
          <span class="notification-time">${timeStr}</span>
        </div>
      `;
      notificationList.appendChild(div);
    });
  }

  // Log out
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      firebase.auth().signOut();
    };
  }
}); 