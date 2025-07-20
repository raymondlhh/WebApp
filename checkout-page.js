// Assumes cart.js, add-points.js, and Database.js are loaded before this script

// Fetch the current user's wallet balance from Firestore
async function getUserWalletBalance() {
  if (window.firebase && firebase.auth && firebase.auth().currentUser) {
    try {
      const user = firebase.auth().currentUser;
      const balance = await window.UserService.getUserBalance(user.uid);
      return balance || 0;
    } catch (error) {
      console.error('Error getting user wallet balance:', error);
      return 0;
    }
  }
  return 0;
}

// Deduct from the current user's wallet balance in Firestore
async function deductUserWalletBalance(amount) {
  if (window.firebase && firebase.auth && firebase.auth().currentUser) {
    try {
      const user = firebase.auth().currentUser;
      // Use negative amount to deduct from balance
      return await window.UserService.updateUserBalance(user.uid, -amount);
    } catch (error) {
      console.error('Error deducting user wallet balance:', error);
      return false;
    }
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

// Check if user has sufficient balance
function hasSufficientBalance(balance, total) {
  return balance >= total;
}

// Update balance warning display
function updateBalanceWarning(balance, total) {
  const warningElement = document.getElementById('checkout-balance-warning');
  const confirmBtn = document.getElementById('checkout-confirm-btn');
  
  if (!hasSufficientBalance(balance, total)) {
    warningElement.classList.remove('hidden');
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = '0.5';
    confirmBtn.style.cursor = 'not-allowed';
  } else {
    warningElement.classList.add('hidden');
    confirmBtn.disabled = false;
    confirmBtn.style.opacity = '1';
    confirmBtn.style.cursor = 'pointer';
  }
}

function renderCheckout() {
  const cart = window.getCart ? window.getCart() : [];
  const itemsDiv = document.getElementById('checkout-items');
  const total = window.getCartTotal ? window.getCartTotal() : 0;
  
  // Clear and render cart items
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
  
  // Update order details
  document.getElementById('checkout-total').textContent = 'RM ' + total.toFixed(2);
  document.getElementById('checkout-item-count').textContent = window.getCartCount ? window.getCartCount() : 0;
  document.getElementById('checkout-points').textContent = Math.floor(total * 10);
  
  // Load and display wallet balance
  loadAndDisplayBalance(total);
}

// Load and display wallet balance with validation
async function loadAndDisplayBalance(total) {
  try {
    const balance = await getUserWalletBalance();
    const balanceElement = document.getElementById('checkout-balance');
    
    if (balanceElement) {
      balanceElement.textContent = `RM ${balance.toFixed(2)}`;
      
      // Add visual indication for insufficient balance
      if (balance < total) {
        balanceElement.style.color = '#e74c3c';
        balanceElement.style.fontWeight = 'bold';
      } else {
        balanceElement.style.color = '#27ae60';
        balanceElement.style.fontWeight = 'bold';
      }
    }
    
    // Update balance warning and button state
    updateBalanceWarning(balance, total);
    
  } catch (error) {
    console.error('Error loading wallet balance:', error);
    document.getElementById('checkout-balance').textContent = 'RM 0.00';
    updateBalanceWarning(0, total);
  }
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is authenticated
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = 'Login.html';
      return;
    }
    
    // Render checkout with authenticated user
    renderCheckout();
  });
});

// Handle checkout confirmation
document.getElementById('checkout-confirm-btn').onclick = async () => {
  const total = window.getCartTotal ? window.getCartTotal() : 0;
  
  if (total <= 0) {
    alert('Your cart is empty. Please add items before checkout.');
    return;
  }
  
  // Get current balance and validate
  const balance = await getUserWalletBalance();
  
  if (!hasSufficientBalance(balance, total)) {
    alert(`Insufficient balance. You have RM ${balance.toFixed(2)} but need RM ${total.toFixed(2)}. Please top up your wallet.`);
    return;
  }
  
  // Confirm with user
  const confirmed = confirm(`Confirm order for RM ${total.toFixed(2)}? This will deduct RM ${total.toFixed(2)} from your wallet balance.`);
  
  if (!confirmed) {
    return;
  }
  
  try {
    // Deduct balance from wallet
    const deductionSuccess = await deductUserWalletBalance(total);
    
    if (!deductionSuccess) {
      alert('Failed to process payment. Please try again.');
      return;
    }
    
    // Award points: 10 points per RM1 spent
    const points = Math.floor(total * 10);
    
    // Update points in Firestore for logged-in user
    if (window.firebase && firebase.auth && firebase.auth().currentUser) {
      try {
        const user = firebase.auth().currentUser;
        await window.UserService.updateUserRewardsPoints(user.uid, points);
        
        // Create notifications
        await window.NotificationsService.createNotification(
          user.uid, 
          `Payment of RM ${total.toFixed(2)} successful`, 
          'Payment Successful'
        );
        await window.NotificationsService.createNotification(
          user.uid, 
          `You earned ${points} points for this order`, 
          'Points Earned'
        );
        
        // Update notification badge if function exists
        if (typeof updateNotificationBadge === 'function') {
          updateNotificationBadge();
        }
        
        console.log(`Checkout completed: Total: RM${total.toFixed(2)}, Points earned: ${points}`);
        
      } catch (error) {
        console.error('Error updating points or notifications:', error);
        // Continue with order even if points/notifications fail
      }
    }
    
    // Clear cart
    if (window.saveCart) {
      window.saveCart([]);
    }

    // --- Create order in Firestore ---
    try {
      const user = firebase.auth().currentUser;
      // Capture cart BEFORE clearing it
      const cartSnapshot = window.getCart ? window.getCart() : [];
      const orderDetails = cartSnapshot.map(item => ({
        imagePath: item.image,
        name: item.name,
        price: item.price,
        quantity: item.qty
      }));
      const orderData = {
        details: orderDetails,
        timestamp: new Date().toISOString(),
        total: total,
        userAddress: (window.currentUserProfile && window.currentUserProfile.address) || '',
        userEmail: user ? user.email : '',
        userName: (window.currentUserProfile && window.currentUserProfile.name) || '',
        userPhone: (window.currentUserProfile && window.currentUserProfile.phone) || ''
      };
      // Try to get user profile from Firestore if not already loaded
      if ((!orderData.userName || !orderData.userPhone || !orderData.userAddress) && user) {
        try {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            orderData.userName = data.name || orderData.userName;
            orderData.userPhone = data.phone || orderData.userPhone;
            orderData.userAddress = data.address || orderData.userAddress;
          }
        } catch (e) { /* ignore */ }
      }
      await window.OrderService.createOrder(orderData);
    } catch (error) {
      console.error('Error creating order in Firestore:', error);
    }
    // --- End order creation ---

    // Show success message and redirect
    alert(`Order confirmed! RM ${total.toFixed(2)} has been deducted from your wallet. You earned ${points} points.`);
    window.location.href = 'Menu.html';
    
  } catch (error) {
    console.error('Error during checkout:', error);
    alert('An error occurred during checkout. Please try again.');
  }
}; 