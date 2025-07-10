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