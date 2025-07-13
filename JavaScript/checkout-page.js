// Assumes cart.js and add-points.js are loaded before this script

// Fetch the current user's balance from Firestore
async function getUserBalance() {
  if (window.firebase && firebase.auth && firebase.auth().currentUser) {
    const user = firebase.auth().currentUser;
    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
    if (userDoc.exists) {
      return userDoc.data().rewardsPoints || 0;
    }
  }
  return 0;
}

// Deduct from the current user's balance in Firestore
async function deductUserBalance(amount) {
  if (window.firebase && firebase.auth && firebase.auth().currentUser) {
    const user = firebase.auth().currentUser;
    // Use your UserService method to update
    return await window.UserService.updateUserRewardsPoints(user.uid, -amount);
  }
  return false;
}

// Global function to refresh points display from Firestore
async function refreshPointsDisplay() {
  if (window.firebase && firebase.auth && firebase.auth().currentUser) {
    try {
      const user = firebase.auth().currentUser;
      const db = firebase.firestore();
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const points = userDoc.data().rewardsPoints || 0;
        // Update all userPoints elements on the page
        const userPointsElements = document.querySelectorAll('#userPoints');
        userPointsElements.forEach(element => {
          element.textContent = points;
        });
        // Also update localStorage for consistency
        localStorage.setItem('userPoints', points.toString());
        console.log('Points display refreshed:', points);
      }
    } catch (error) {
      console.error('Error refreshing points display:', error);
    }
  }
}

// Make the function globally available
window.refreshPointsDisplay = refreshPointsDisplay;

function renderCheckout() {
  const cart = window.getCart ? window.getCart() : [];
  const itemsDiv = document.getElementById('checkout-items');
  itemsDiv.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'checkout-item';
    div.innerHTML = `
      <img src="${item.image}" class="checkout-item-img" alt="${item.name}">
      <div class="checkout-item-info">
        <div class="checkout-item-title">${item.name}</div>
        <div class="checkout-item-qty">x${item.qty}</div>
      </div>
      <div class="checkout-item-price">RM ${parseFloat(item.price.replace(/[^\d.]/g, '')) .toFixed(2)}</div>
    `;
    itemsDiv.appendChild(div);
  });
  // Always fetch and display the latest balance from Firestore
  getUserBalance().then(balance => {
    document.getElementById('checkout-balance').textContent = 'Current Balance: RM ' + balance.toFixed(2);
  });
  document.getElementById('checkout-total').textContent = 'RM ' + (window.getCartTotal ? window.getCartTotal() : 0).toFixed(2);
  document.getElementById('checkout-item-count').textContent = window.getCartCount ? window.getCartCount() : 0;
  document.getElementById('checkout-points').textContent = Math.floor((window.getCartTotal ? window.getCartTotal() : 0) * 10);
}

document.addEventListener('DOMContentLoaded', () => {
  renderCheckout();
});

document.getElementById('checkout-confirm-btn').onclick = async () => {
  const total = window.getCartTotal ? window.getCartTotal() : 0;
  let balance = await getUserBalance();
  if (balance < total) {
    alert('Insufficient balance to complete this order. Please top up your balance.');
    return;
  }
  // Deduct balance in Firestore
  const success = await deductUserBalance(total);
  if (!success) {
    alert('Failed to deduct balance. Please try again.');
    return;
  }
  // Award points: 10 points per RM1 spent
  let points = Math.floor(total * 10);
  let currentPoints = parseInt(localStorage.getItem('userPoints') || '0', 10);
  localStorage.setItem('userPoints', currentPoints + points);

  console.log(`Checkout completed: Total: RM${total.toFixed(2)}, Points earned: ${points}`);

  // Add notification for order (Firestore for logged-in user only)
  if (window.firebase && firebase.auth && firebase.auth().currentUser) {
    const user = firebase.auth().currentUser;
    await window.NotificationsService.createNotification(user.uid, `RM ${total.toFixed(2)} has been successfully paid`, 'Payment Successful');
    await window.NotificationsService.createNotification(user.uid, `You earned ${points} points for this order`, 'Points Earned');
    if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
  }
  // No notifications for guests

  // Update Firestore if user is logged in using the add-points function
  if (window.firebase && firebase.auth && firebase.auth().currentUser) {
    try {
      console.log('User is logged in, updating points in Firestore...');
      // Use the add-points function to add points to the user
      const pointsAdded = window.addPointsToCurrentUser ? await window.addPointsToCurrentUser(points) : false;
      
      if (pointsAdded) {
        console.log(`Successfully added ${points} points to user account`);
        // Refresh points display immediately after updating Firestore
        await refreshPointsDisplay();
      } else {
        console.error('Failed to add points to user account');
        // Still proceed with the order even if points update fails
      }
      if (window.saveCart) window.saveCart([]);
      // Refresh balance display before redirect
      await renderCheckout();
      alert('Order confirmed! Thank you for your purchase.');
      window.location.href = 'Menu.html';
    } catch (error) {
      console.error('Error updating points in Firestore:', error);
      // Still proceed with the order even if points update fails
      if (window.saveCart) window.saveCart([]);
      await renderCheckout();
      alert('Order confirmed! Thank you for your purchase.');
      window.location.href = 'Menu.html';
    }
  } else {
    console.log('User not logged in, points will be stored locally only');
    if (window.saveCart) window.saveCart([]);
    await renderCheckout();
    alert('Order confirmed! Thank you for your purchase.');
    window.location.href = 'Menu.html';
  }
}; 