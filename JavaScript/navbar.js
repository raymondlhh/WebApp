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

// Notification Sidebar Logic
const notificationBtn = document.getElementById('notificationBtn');
const notificationSidebar = document.getElementById('notificationSidebar');
const closeNotificationSidebar = document.getElementById('closeNotificationSidebar');
const notificationSidebarOverlay = document.getElementById('notificationSidebarOverlay');
const notificationList = document.getElementById('notificationList');

function getNotifications() {
    // For demo: use localStorage, fallback to demo data
    let notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    if (!notifs.length) {
        notifs = [
            {
                title: 'Order Confirmed',
                message: 'Your order #1234 has been placed successfully!',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            },
            {
                title: 'Points Earned',
                message: 'You earned 100 points for your last purchase.',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            }
        ];
        localStorage.setItem('notifications', JSON.stringify(notifs));
    }
    return notifs;
}

function renderNotifications() {
    const notifs = getNotifications();
    if (!notifs.length) {
        notificationList.innerHTML = '<p style="text-align:center;color:#888;">No notifications yet.</p>';
        return;
    }
    notificationList.innerHTML = notifs.map(n => `
        <div class="notification-item">
            <div class="notification-title">${n.title}</div>
            <div class="notification-date">${n.date}</div>
            <div class="notification-message">${n.message}</div>
            <div class="notification-time">${n.time}</div>
        </div>
    `).join('');
}

function openNotificationSidebar() {
    notificationSidebar.classList.add('open');
    notificationSidebarOverlay.style.display = 'block';
    renderNotifications();
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