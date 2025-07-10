# Navbar Component Usage Guide

This guide explains how to use the reusable navbar component with hamburger menu functionality in your HTML files.

## Available Components

### 1. Navbar.html (Simple Hamburger Menu)
A minimal navbar with just the hamburger menu and mobile sidebar.

### 2. header.html (Full Navigation Bar)
A complete navigation bar with logo, desktop navigation, and hamburger menu for mobile.

## How to Use

### Option 1: Using Navbar.html (Simple Hamburger Menu)

Add this code to your HTML file where you want the navbar to appear:

```html
<!-- Include the reusable navbar component -->
<div id="navbar-container"></div>
<script>
    // Load the navbar component
    fetch('Navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
            // Initialize the hamburger menu after loading
            if (window.initHamburgerMenu) {
                window.initHamburgerMenu();
            }
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
</script>
```

### Option 2: Using header.html (Full Navigation Bar)

Add this code to your HTML file where you want the navbar to appear:

```html
<div id="header"></div>
<script>
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        });
</script>
```

## Features

- **Responsive Design**: Works on both desktop and mobile devices
- **Hamburger Menu**: Mobile-friendly sidebar navigation
- **Smooth Animations**: CSS transitions for opening/closing the menu
- **Overlay**: Dark overlay when mobile menu is open
- **Body Scroll Lock**: Prevents background scrolling when menu is open

## Navigation Links

The mobile sidebar includes links to:
- Home.html
- Menu.html
- rewards.html
- profile.html

## CSS Requirements

Make sure your CSS file includes the necessary styles for:
- `.navbar`
- `.hamburger`
- `.mobile-menu`
- `.mobile-nav-links`
- `.mobile-menu-overlay`
- `.close-btn`

## Example Implementation

See `Home.html` for a complete example of how to implement the navbar component. 