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
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    const unreadCount = notifs.filter(n => !n.read).length;
    if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

window.updateNotificationBadge = updateNotificationBadge;

function initNotificationSidebar() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationSidebar = document.getElementById('notificationSidebar');
    const closeNotificationSidebar = document.getElementById('closeNotificationSidebar');
    const notificationSidebarOverlay = document.getElementById('notificationSidebarOverlay');
    const notificationList = document.getElementById('notificationList');
    const markAllReadBtn = document.getElementById('markAllReadBtn');

    function getNotifications() {
        let notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
        // Do not auto-populate with demo data
        return notifs;
    }

    function renderNotifications() {
        const notifs = getNotifications();
        if (!notifs.length) {
            notificationList.innerHTML = '<p style="text-align:center;color:#888;">No notifications yet.</p>';
            return;
        }
        notificationList.innerHTML = notifs.map(n => `
            <div class="notification-item${n.read ? ' notification-read' : ''}">
                <div class="notification-header-row" style="display:flex;justify-content:space-between;align-items:center;">
                    <div class="notification-title" style="font-weight:bold;text-align:left;">${n.title}</div>
                    <div class="notification-date">${n.date}</div>
                </div>
                <div class="notification-message">${n.message}</div>
                <div class="notification-time">${n.time}</div>
            </div>
        `).join('');
    }

    function openNotificationSidebar() {
        notificationSidebar.classList.add('open');
        notificationSidebarOverlay.style.display = 'block';
        renderNotifications();
        updateNotificationBadge();
    }
    function closeNotificationSidebarFn() {
        notificationSidebar.classList.remove('open');
        notificationSidebarOverlay.style.display = 'none';
    }
    if (notificationBtn && notificationSidebar && closeNotificationSidebar && notificationSidebarOverlay) {
        notificationBtn.onclick = openNotificationSidebar;
        closeNotificationSidebar.onclick = closeNotificationSidebarFn;
        notificationSidebarOverlay.onclick = closeNotificationSidebarFn;
    }
    if (markAllReadBtn) {
        markAllReadBtn.onclick = function() {
            let notifs = getNotifications();
            notifs = notifs.map(n => ({ ...n, read: true }));
            localStorage.setItem('notifications', JSON.stringify(notifs));
            renderNotifications();
            updateNotificationBadge();
        };
    }
    updateNotificationBadge();
}
window.initNotificationSidebar = initNotificationSidebar; 