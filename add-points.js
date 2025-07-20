// Utility script to add points to users for testing
// This can be run in the browser console or included in a page
// Assumes firebase-init.js is loaded before this script

async function addPointsToUser(userId, pointsToAdd) {
  try {
    if (!window.db) {
      throw new Error('Firebase not initialized');
    }
    const userRef = window.db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
      const currentPoints = userSnap.data().rewardsPoints || 0;
      const newPoints = currentPoints + pointsToAdd;
      
      await userRef.update({
        rewardsPoints: newPoints,
        updatedAt: new Date()
      });
      
      console.log(`Successfully added ${pointsToAdd} points to user ${userId}. New total: ${newPoints}`);
      return true;
    } else {
      console.error('User not found');
      return false;
    }
  } catch (error) {
    console.error('Error adding points:', error);
    return false;
  }
}

// Function to add points to current user
async function addPointsToCurrentUser(pointsToAdd) {
  if (!window.auth) {
    console.error('Firebase not initialized');
    return false;
  }
  const user = window.auth.currentUser;
  if (!user) {
    console.error('No user logged in');
    return false;
  }
  
  return await addPointsToUser(user.uid, pointsToAdd);
}

// Make functions available globally for testing
window.addPointsToUser = addPointsToUser;
window.addPointsToCurrentUser = addPointsToCurrentUser;

// Example usage:
// addPointsToCurrentUser(1000); // Adds 1000 points to current user
// addPointsToUser('user-id-here', 500); // Adds 500 points to specific user 