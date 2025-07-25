// Assumes firebase-init.js and Database.js are loaded before this script

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
    const userData = await window.UserService.getUser(user.uid);
    if (userData) {
      // Update main profile picture
      const mainProfilePic = document.querySelector('.profile-pic-container .profile-pic');
      if (mainProfilePic) {
        mainProfilePic.src = userData.profilePic || '../assets/images/others/Profile.png';
      }
      nameEl.textContent = userData.name || '';
      emailEl.textContent = user.email; // Always use Auth email for display
      // Pre-fill edit form fields if present
      if (editForm) {
        document.getElementById('edit-name').value = userData.name || '';
        // document.getElementById('edit-email').value = userData.email || user.email;
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
      await window.UserService.updateUser(user.uid, {
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
  // Remove cycling logic from camera button
  // if (switchProfilePicBtn && modalProfilePic) {
  //   switchProfilePicBtn.addEventListener('click', function(e) {
  //     e.preventDefault();
  //     currentProfilePicIndex = (currentProfilePicIndex + 1) % profilePics.length;
  //     modalProfilePic.src = profilePics[currentProfilePicIndex];
  //   });
  // }

  // Show/hide password toggle with image icons
  if (toggleModalPasswordBtn && modalEditPassword) {
    // Set initial icon
            toggleModalPasswordBtn.innerHTML = '<img src="assets/images/icons/CloseEye.png" alt="Show" style="width:22px;height:22px;vertical-align:middle;">';
    toggleModalPasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (modalEditPassword.type === 'password') {
        modalEditPassword.type = 'text';
        toggleModalPasswordBtn.innerHTML = '<img src="assets/images/icons/OpenEye.png" alt="Hide" style="width:22px;height:22px;vertical-align:middle;">';
      } else {
        modalEditPassword.type = 'password';
        toggleModalPasswordBtn.innerHTML = '<img src="assets/images/icons/CloseEye.png" alt="Show" style="width:22px;height:22px;vertical-align:middle;">';
      }
    });
  }

  // Profile picture selection panel logic
  if (switchProfilePicBtn && profilePicPanel && modalProfilePic) {
    switchProfilePicBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
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
      img.addEventListener('click', async function() {
        modalProfilePic.src = img.dataset.pic;
        profilePicPanel.classList.add('hidden');
        // Update profile picture in the database
        const user = firebase.auth().currentUser;
        if (user) {
          await window.UserService.updateUser(user.uid, { profilePic: img.dataset.pic });
        }
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
        const userData = await window.UserService.getUser(user.uid);
        document.getElementById('modal-edit-name').value = userData?.name || '';
        // document.getElementById('modal-edit-email').value = userData?.email || user.email;
        // Leave password field blank
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
      // const newEmail = document.getElementById('modal-edit-email').value;
      const newPassword = document.getElementById('modal-edit-password').value;
      // If email changed, update in Auth first
      /*
      if (newEmail !== user.email) {
        try {
          // Prompt for password
          const password = prompt("Please enter your current password to confirm email change:");
          if (!password) {
            alert("Email change cancelled. Password is required.");
            return;
          }
          // Re-authenticate
          const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
          await user.reauthenticateWithCredential(credential);

          // Now update email
          await user.updateEmail(newEmail);
          await user.sendEmailVerification();
          alert('A verification email has been sent to your new email address. Please verify it to complete the change.');
        } catch (err) {
          alert('Failed to update email: ' + (err.message || err));
          return;
        }
      }
      */
      // Update user profile fields in Firestore
      await window.UserService.updateUser(user.uid, {
        name: document.getElementById('modal-edit-name').value,
        // email: document.getElementById('modal-edit-email').value, // removed because email field is gone
        phone: document.getElementById('modal-edit-phone').value,
        address: document.getElementById('modal-edit-address').value
      });
      // If password field is not empty, update password
      if (newPassword) {
        try {
          await user.updatePassword(newPassword);
          alert('Password updated successfully.');
        } catch (err) {
          alert('Failed to update password: ' + (err.message || err));
        }
      }
      await loadProfile();
      closeProfileEditModal();
    });
  }

  // Favourites logic
  // Favourites Modal Logic (Firestore version)
  async function loadFavourites() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    const favourites = await window.FavouritesService.getUserFavourites(user.uid);
    const favouritesModalList = document.getElementById('favourites-modal-list');
    if (!favouritesModalList) return;

    if (favourites.length === 0) {
      favouritesModalList.innerHTML = '<p style="text-align:center;">No favourites yet</p>';
      return;
    }

    favouritesModalList.innerHTML = favourites.map(fav => {
      if (!fav.itemId) {
        console.error('Favourite missing itemId:', fav);
        return '';
      }
      if (!window.menuItems) {
        console.error('menuItems not loaded');
        return '';
      }
      const food = window.menuItems[fav.itemId];
      if (!food) {
        console.error('No menu item found for itemId:', fav.itemId);
        return '';
      }
      return `
        <div class="favourite-card">
          <img src="${food.image}" alt="${food.name}" class="favourite-img">
          <div class="favourite-info">
            <div class="favourite-title">${food.name}</div>
            <div class="favourite-price">${food.price}</div>
          </div>
          <button class="favourite-delete-btn" data-itemid="${fav.itemId}" title="Remove">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6m-6 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      `;
    }).join('');
  }

  // Remove favourite on trash button click
  const favouritesModalList = document.getElementById('favourites-modal-list');
  if (favouritesModalList) {
    favouritesModalList.onclick = async function(e) {
      const btn = e.target.closest('.favourite-delete-btn');
      if (btn) {
        const itemId = btn.getAttribute('data-itemid');
        const user = firebase.auth().currentUser;
        if (user && itemId) {
          await window.FavouritesService.removeFromFavourites(user.uid, itemId);
          loadFavourites();
        }
      }
    };
  }

  // Balance logic (using balance field instead of rewardsPoints)
  const balanceAmount = document.getElementById('balance-amount');
  const topupForm = document.getElementById('topup-form');
  const topupAmount = document.getElementById('topup-amount');
  const topupBtns = document.querySelectorAll('.topup-btn');
  async function loadBalance() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    const balance = await window.UserService.getUserBalance(user.uid);
    if (balanceAmount) {
      balanceAmount.textContent = parseFloat(balance).toFixed(2);
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
    await window.UserService.updateUserBalance(user.uid, amt);
    // Add notification for top-up
    await window.NotificationsService.createNotification(user.uid, `RM ${amt.toFixed(2)} has been successfully topped-up`, 'Top-Up Successful');
    loadBalance();
    topupAmount.value = 0;
  };

  // Notifications logic
  // const notificationList = document.querySelector('.notification-list');
  // async function loadNotifications() {
  //   if (!notificationList) return;
  //   const user = firebase.auth().currentUser;
  //   if (!user) return;
  //   const notifications = await NotificationsService.getUserNotifications(user.uid);
  //   notificationList.innerHTML = '';
  //   if (notifications.length === 0) {
  //     notificationList.innerHTML = '<p class="empty-msg">No notifications yet</p>';
  //     return;
  //   }
  //   notifications.forEach(n => {
  //     const div = document.createElement('div');
  //     div.className = 'notification-item';
  //     const date = n.date ? new Date(n.date.toDate ? n.date.toDate() : n.date) : new Date();
  //     const dateStr = date.toLocaleDateString('en-GB');
  //     const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  //     div.innerHTML = `
  //       <div class="notification-row">
  //         <span class="notification-main">${n.message || 'Notification'}</span>
  //         <span class="notification-date">${dateStr}</span>
  //       </div>
  //       <div class="notification-row">
  //         <span class="notification-desc">${n.message || 'Notification message'}</span>
  //         <span class="notification-time">${timeStr}</span>
  //       </div>
  //     `;
  //     notificationList.appendChild(div);
  //   });
  // }

  // Log out
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      firebase.auth().signOut();
    };
  }

  // Robust async renderFavouritesModal that waits for menuItems
  async function renderFavouritesModal() {
    const user = firebase.auth().currentUser;
    const favouritesModalList = document.getElementById('favourites-modal-list');
    if (!favouritesModalList) return;

    // Show loading state
    favouritesModalList.innerHTML = '<p style="text-align:center;">Loading...</p>';

    if (!user) {
      favouritesModalList.innerHTML = '<p style="text-align:center;">Please log in to see your favourites.</p>';
      return;
    }

    const favourites = await window.FavouritesService.getUserFavourites(user.uid);

    if (!Array.isArray(favourites) || favourites.length === 0) {
      favouritesModalList.innerHTML = '<p style="text-align:center;">No favourites yet</p>';
      return;
    }

    favouritesModalList.innerHTML = favourites.map(fav => {
      return `
        <div class="favourite-card">
          <img src="${fav.image || ''}" alt="${fav.name || ''}" class="favourite-img">
          <div class="favourite-info">
            <div class="favourite-title">${fav.name || fav.itemId}</div>
            <div class="favourite-price">${fav.price || ''}</div>
          </div>
          <button class="favourite-delete-btn" data-itemid="${fav.itemId}" title="Remove">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6m-6 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      `;
    }).join('');
  }

  // Modal open logic (ensure async)
  const favouriteBtn = document.getElementById('favouriteBtn');
  const favouritesModal = document.getElementById('favourites-modal');
  const closeFavouritesModal = document.getElementById('closeFavouritesModal');

  if (favouriteBtn && favouritesModal && closeFavouritesModal) {
    favouriteBtn.onclick = async function() {
      favouritesModal.classList.remove('hidden');
      await renderFavouritesModal();
    };
    closeFavouritesModal.onclick = function() {
      favouritesModal.classList.add('hidden');
    };
    favouritesModal.onclick = function(e) {
      if (e.target === favouritesModal) favouritesModal.classList.add('hidden');
    };
  }

  // Modal logic for Settings
  const settingBtn = document.getElementById('settingBtn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsModal = document.getElementById('closeSettingsModal');

  if (settingBtn && settingsModal && closeSettingsModal) {
    settingBtn.onclick = function() {
      settingsModal.classList.remove('hidden');
    };
    closeSettingsModal.onclick = function() {
      settingsModal.classList.add('hidden');
    };
    settingsModal.onclick = function(e) {
      if (e.target === settingsModal) settingsModal.classList.add('hidden');
    };
  }

  const balanceBtn = document.getElementById('balanceBtn');
  const balanceModal = document.getElementById('balance-modal');
  const closeBalanceModal = document.getElementById('closeBalanceModal');

  if (balanceBtn && balanceModal && closeBalanceModal) {
    balanceBtn.onclick = async function() {
      balanceModal.classList.remove('hidden');
      // Always show the latest balance when opening the modal
      const user = firebase.auth().currentUser;
      if (user) {
        const balance = await window.UserService.getUserBalance(user.uid);
        const modalBalanceAmount = document.getElementById('modal-balance-amount');
        if (modalBalanceAmount) {
          modalBalanceAmount.textContent = parseFloat(balance).toFixed(2);
        }
      }
    };
    closeBalanceModal.onclick = function() {
      balanceModal.classList.add('hidden');
    };
    balanceModal.onclick = function(e) {
      if (e.target === balanceModal) balanceModal.classList.add('hidden');
    };
  }

  // Modal quick top-up buttons for balance modal
  const modalTopupInput = document.getElementById('modal-topup-input');
  const modalTopupAmount = document.getElementById('modal-topup-amount');
  const modalTopupBtns = document.querySelectorAll('.modal-topup-btn');
  if (modalTopupBtns && modalTopupInput && modalTopupAmount) {
    modalTopupBtns.forEach(btn => {
      btn.onclick = function() {
        const amt = btn.dataset.amount;
        modalTopupInput.value = amt;
        modalTopupAmount.textContent = parseFloat(amt).toFixed(2);
      };
    });
    // Also update display when input changes
    modalTopupInput.addEventListener('input', function() {
      modalTopupAmount.textContent = parseFloat(modalTopupInput.value || 0).toFixed(2);
    });
  }

  // Modal top-up form logic for balance modal
  const modalTopupForm = document.getElementById('modal-topup-form');
  if (modalTopupForm && modalTopupInput && modalTopupAmount) {
    modalTopupForm.onsubmit = async function(e) {
      e.preventDefault();
      const user = firebase.auth().currentUser;
      if (!user) return;
      let amt = parseFloat(modalTopupInput.value);
      if (isNaN(amt) || amt < 10 || amt > 500) {
        alert('Please enter a valid amount between RM10 and RM500.');
        return;
      }
      await window.UserService.updateUserBalance(user.uid, amt);
      // Add notification for top-up
      await window.NotificationsService.createNotification(user.uid, `RM ${amt.toFixed(2)} has been successfully topped-up`, 'Top-Up Successful');
      // Update both modal and main balance displays
      if (typeof loadBalance === 'function') loadBalance();
      const modalBalanceAmount = document.getElementById('modal-balance-amount');
      if (modalBalanceAmount) {
        const balance = await window.UserService.getUserBalance(user.uid);
        modalBalanceAmount.textContent = parseFloat(balance).toFixed(2);
      }
      modalTopupInput.value = 0;
      modalTopupAmount.textContent = '0.00';
    };
  }
}); 