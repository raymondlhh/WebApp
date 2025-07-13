// JavaScript/navbar.js
function initHamburgerMenu() {
    const openSidebar = document.getElementById('openSidebar');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    function toggleMenu() {
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
            mobileMenu.classList.remove('open');
            mobileMenuOverlay.style.display = 'none';
            document.body.style.overflow = '';
        } else {
            mobileMenu.classList.add('open');
            mobileMenuOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    if (openSidebar) openSidebar.onclick = toggleMenu;
    if (closeMobileMenu) closeMobileMenu.onclick = toggleMenu;
    if (mobileMenuOverlay) mobileMenuOverlay.onclick = toggleMenu;
}

window.initHamburgerMenu = initHamburgerMenu;

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    const user = firebase.auth().currentUser;
    if (!user) { badge.style.display = 'none'; return; }
    window.NotificationsService.getUnreadNotificationsCount(user.uid).then(unreadCount => {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

window.updateNotificationBadge = updateNotificationBadge;

// Helper: Mark all notifications as read for the current user
async function markAllNotificationsAsRead() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    const notificationsRef = firebase.firestore()
        .collection('users').doc(user.uid)
        .collection('notifications');
    const snapshot = await notificationsRef.where('isRead', '==', 0).get();
    const batch = firebase.firestore().batch();
    snapshot.forEach(doc => {
        batch.update(doc.ref, { isRead: 1 });
    });
    await batch.commit();
}

function initNotificationSidebar() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationSidebar = document.getElementById('notificationSidebar');
    const closeNotificationSidebar = document.getElementById('closeNotificationSidebar');
    const notificationSidebarOverlay = document.getElementById('notificationSidebarOverlay');
    const notificationList = document.getElementById('notificationList');
    const markAllReadBtn = document.getElementById('markAllReadBtn');

    async function getNotifications() {
        const user = firebase.auth().currentUser;
        if (!user) return [];
        return await window.NotificationsService.getUserNotifications(user.uid);
    }

    async function renderNotifications() {
        const notifs = await getNotifications();
        if (!notifs.length) {
            notificationList.innerHTML = '<p style="text-align:center;color:#888;">No notifications yet.</p>';
            return;
        }
        notificationList.innerHTML = notifs.map(n => `
            <div class="notification-item${n.isRead ? ' notification-read' : ''}">
                <div class="notification-header-row" style="display:flex;justify-content:space-between;align-items:center;">
                    <div class="notification-title" style="font-weight:bold;text-align:left;">${n.title || ''}</div>
                    <div class="notification-date">${n.date ? (n.date.toDate ? n.date.toDate().toLocaleDateString('en-GB') : new Date(n.date).toLocaleDateString('en-GB')) : ''}</div>
                </div>
                <div class="notification-message">${n.message}</div>
                <div class="notification-time">${n.date ? (n.date.toDate ? n.date.toDate().toLocaleTimeString('en-GB') : new Date(n.date).toLocaleTimeString('en-GB')) : ''}</div>
            </div>
        `).join('');
    }

    // Real-time notifications listener
    let unsubscribeNotif = null;
    firebase.auth().onAuthStateChanged(user => {
        if (unsubscribeNotif) unsubscribeNotif();
        if (user) {
            const notifRef = firebase.firestore().collection('users').doc(user.uid).collection('notifications').orderBy('date', 'desc');
            unsubscribeNotif = notifRef.onSnapshot(async () => {
                await renderNotifications();
                updateNotificationBadge();
            });
        }
    });

    async function openNotificationSidebar() {
        notificationSidebar.classList.add('open');
        notificationSidebarOverlay.style.display = 'block';
        await renderNotifications();
        updateNotificationBadge();
    }
    function closeNotificationSidebarFn() {
        notificationSidebar.classList.remove('open');
        notificationSidebarOverlay.style.display = 'none';
    }
    if (notificationBtn && notificationSidebar && closeNotificationSidebar && notificationSidebarOverlay) {
        notificationBtn.onclick = openNotificationSidebar;
        closeNotificationSidebar.onclick = closeNotificationSidebarFn;
        // Add Mark all as read event
        if (markAllReadBtn) {
            markAllReadBtn.onclick = async () => {
                await markAllNotificationsAsRead();
                await renderNotifications();
                updateNotificationBadge();
            };
        }
    }
    updateNotificationBadge();
}
window.initNotificationSidebar = initNotificationSidebar;

// Add style for read notifications
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
    .notification-read {
        background: #f0f0f0 !important;
        color: #aaa !important;
        opacity: 0.7;
    }
    `;
    document.head.appendChild(style);
}); 