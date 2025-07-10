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
  import('./firebase-init.js').then(({ auth, db }) => {
    import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js').then(firestore => {
      import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js').then(authModule => {
        const { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy } = firestore;
        const { onAuthStateChanged, signOut } = authModule;

        // Redirect to login if not authenticated
        onAuthStateChanged(auth, user => {
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

        async function loadProfile() {
          const user = auth.currentUser;
          if (!user) return;
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            nameEl.textContent = data.name || '';
            emailEl.textContent = data.email || user.email;
            document.getElementById('edit-name').value = data.name || '';
            document.getElementById('edit-email').value = data.email || user.email;
            document.getElementById('edit-password').value = '';
            document.getElementById('edit-phone').value = data.phone || '';
            document.getElementById('edit-address').value = data.address || '';
          }
        }

        editBtn.onclick = () => {
          editForm.classList.remove('hidden');
          editBtn.style.display = 'none';
        };
        cancelEditBtn.onclick = () => {
          editForm.classList.add('hidden');
          editBtn.style.display = '';
        };
        editForm.onsubmit = async (e) => {
          e.preventDefault();
          const user = auth.currentUser;
          if (!user) return;
          await updateDoc(doc(db, 'users', user.uid), {
            name: document.getElementById('edit-name').value,
            email: document.getElementById('edit-email').value,
            phone: document.getElementById('edit-phone').value,
            address: document.getElementById('edit-address').value
          });
          loadProfile();
          editForm.classList.add('hidden');
          editBtn.style.display = '';
        };

        // Favourites logic
        const favList = document.getElementById('favourites-list');
        async function loadFavourites() {
          const user = auth.currentUser;
          if (!user) return;
          const favsSnap = await getDocs(collection(db, 'users', user.uid, 'favourites'));
          favList.innerHTML = '';
          if (favsSnap.empty) {
            favList.innerHTML = '<p class="empty-msg">No favourites yet</p>';
            return;
          }
          favsSnap.forEach(docSnap => {
            const item = docSnap.data();
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
            div.querySelector('.fav-remove').onclick = async () => {
              await deleteDoc(doc(db, 'users', user.uid, 'favourites', docSnap.id));
              loadFavourites();
            };
            favList.appendChild(div);
          });
        }

        // Balance logic
        const balanceAmount = document.getElementById('balance-amount');
        const topupForm = document.getElementById('topup-form');
        const topupAmount = document.getElementById('topup-amount');
        const topupBtns = document.querySelectorAll('.topup-btn');
        async function loadBalance() {
          const user = auth.currentUser;
          if (!user) return;
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            balanceAmount.textContent = (data.balance || 0).toFixed(2);
          }
        }
        topupBtns.forEach(btn => {
          btn.onclick = () => {
            topupAmount.value = btn.dataset.amount;
          };
        });
        topupForm.onsubmit = async (e) => {
          e.preventDefault();
          const user = auth.currentUser;
          if (!user) return;
          let amt = parseFloat(topupAmount.value);
          if (isNaN(amt) || amt < 10 || amt > 500) {
            alert('Please enter a valid amount between RM10 and RM500.');
            return;
          }
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          let balance = 0;
          if (docSnap.exists()) balance = docSnap.data().balance || 0;
          await updateDoc(userRef, { balance: balance + amt });
          loadBalance();
          topupAmount.value = 0;
        };

        // Notifications logic
        const notificationList = document.querySelector('.notification-list');
        async function loadNotifications() {
          if (!notificationList) return;
          const user = auth.currentUser;
          if (!user) return;
          notificationList.innerHTML = '';
          const q = query(collection(db, 'users', user.uid, 'notifications'), orderBy('date', 'desc'));
          const snap = await getDocs(q);
          if (snap.empty) {
            notificationList.innerHTML = '<p class="empty-msg">No notifications yet</p>';
            return;
          }
          snap.forEach(docSnap => {
            const n = docSnap.data();
            const div = document.createElement('div');
            div.className = 'notification-item';
            div.innerHTML = `
              <div class="notification-row">
                <span class="notification-main">${n.title}</span>
                <span class="notification-date">${n.date || ''}</span>
              </div>
              <div class="notification-row">
                <span class="notification-desc">${n.desc}</span>
                <span class="notification-time">${n.time || ''}</span>
              </div>
            `;
            notificationList.appendChild(div);
          });
        }

        // Log out
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
          logoutBtn.onclick = () => {
            signOut(auth);
          };
        }
      });
    });
  });
}); 