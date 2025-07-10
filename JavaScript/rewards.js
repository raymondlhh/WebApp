// Rewards Handler using Firebase CDN compat API
// Assumes firebase-init.js is loaded before this script

// Default rewards data structure
const defaultRewards = [
  {
    name: 'Chuka Wakame',
    description: 'Seaweed salad with a subtly sweet and savory flavor.',
    imagePath: '../_Assets/images/foods/appetizers/chuka_wakame.png',
    points: 1500,
    validity: 8,
    maxRedemptions: 3
  },
  {
    name: 'Ebi Curry Udon',
    description: 'Curry udon with ebi tempura.',
    imagePath: '../_Assets/images/foods/curry_sets/ebi_curry_udon.png',
    points: 2000,
    validity: 6,
    maxRedemptions: 2
  },
  {
    name: 'Chicken Teriyaki Ramen',
    description: 'Ramen with chicken teriyaki and vegetables.',
    imagePath: '../_Assets/images/foods/ramen/chicken_teriyaki_ramen.png',
    points: 1800,
    validity: 7,
    maxRedemptions: 4
  },
  {
    name: 'Ebi Tempura',
    description: 'Crispy battered shrimp tempura.',
    imagePath: '../_Assets/images/foods/tempura/ebi_tempura.png',
    points: 1700,
    validity: 5,
    maxRedemptions: 2
  }
];

let userRewardsPoints = 0;
let userRedemptions = {};

// Initialize rewards in Firestore if they don't exist
async function initializeRewards() {
  try {
    console.log('Initializing rewards...');
    const rewards = await getRewards();
    console.log('Current rewards in database:', rewards.length);
    
    if (rewards.length === 0) {
      console.log('No rewards found, creating default rewards...');
      // Add default rewards to Firestore
      for (const reward of defaultRewards) {
        const rewardId = await createReward(reward);
        console.log(`Created reward: ${reward.name} with ID: ${rewardId}`);
      }
      console.log('Default rewards created successfully!');
    } else {
      console.log('Rewards already exist in database');
    }
  } catch (error) {
    console.error('Error initializing rewards:', error);
  }
}

// Load user data from Firestore
async function loadUserData() {
  const user = auth.currentUser;
  if (!user) return;
  
  const userData = await getUser(user.uid);
  if (userData) {
    userRewardsPoints = userData.rewardsPoints || 0;
    // Update the points display
    const userPointsElement = document.getElementById('userPoints');
    if (userPointsElement) {
      userPointsElement.textContent = userRewardsPoints;
    }
  }
  
  // Load user redemptions
  const redemptions = await getUserRedemptions(user.uid);
  userRedemptions = {};
  redemptions.forEach(redemption => {
    userRedemptions[redemption.rewardId] = (userRedemptions[redemption.rewardId] || 0) + 1;
  });
}

// Database service functions using Firebase CDN compat API
async function getRewards() {
  try {
    const rewardsRef = db.collection('rewards');
    const snapshot = await rewardsRef.get();
    const rewards = [];
    snapshot.forEach(doc => {
      rewards.push({ id: doc.id, ...doc.data() });
    });
    return rewards;
  } catch (error) {
    console.error('Error getting rewards:', error);
    return [];
  }
}

async function createReward(rewardData) {
  try {
    const docRef = await db.collection('rewards').add({
      name: rewardData.name,
      description: rewardData.description,
      points: rewardData.points,
      imagePath: rewardData.imagePath,
      validity: rewardData.validity,
      maxRedemptions: rewardData.maxRedemptions,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating reward:', error);
    return null;
  }
}

async function getUser(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

async function updateUserRewardsPoints(userId, points) {
  try {
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    if (userSnap.exists) {
      const currentPoints = userSnap.data().rewardsPoints || 0;
      await userRef.update({
        rewardsPoints: currentPoints + points,
        updatedAt: new Date()
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating user rewards points:', error);
    return false;
  }
}

async function getUserRedemptions(userId) {
  try {
    const redemptionsRef = db.collection('userRewardRedemptions');
    const snapshot = await redemptionsRef.where('userId', '==', userId).get();
    const redemptions = [];
    snapshot.forEach(doc => {
      redemptions.push({ id: doc.id, ...doc.data() });
    });
    return redemptions;
  } catch (error) {
    console.error('Error getting user redemptions:', error);
    return [];
  }
}

async function redeemReward(userId, rewardId, rewardName, pointsSpent) {
  try {
    // Add redemption record
    await db.collection('userRewardRedemptions').add({
      userId: userId,
      rewardId: rewardId,
      rewardName: rewardName,
      pointsSpent: pointsSpent.toString(),
      redeemAt: new Date()
    });

    // Update user rewards points
    await updateUserRewardsPoints(userId, -parseInt(pointsSpent));

    return true;
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return false;
  }
}

// Redeem a reward
async function handleRedeemReward(rewardId, rewardPoints, rewardName) {
  const user = auth.currentUser;
  if (!user) {
    alert('Please log in to redeem rewards.');
    return false;
  }
  
  if (userRewardsPoints < rewardPoints) {
    alert('Insufficient points to redeem this reward.');
    return false;
  }
  
  const currentRedemptions = userRedemptions[rewardId] || 0;
  const reward = (await getRewards()).find(r => r.id === rewardId);
  
  if (currentRedemptions >= reward.maxRedemptions) {
    alert('You have reached the maximum redemptions for this reward.');
    return false;
  }
  
  try {
    // Add redemption record
    await redeemReward(user.uid, rewardId, rewardName, rewardPoints);
    
    // Update local state
    userRewardsPoints -= rewardPoints;
    userRedemptions[rewardId] = (userRedemptions[rewardId] || 0) + 1;
    
    // Update the points display
    const userPointsElement = document.getElementById('userPoints');
    if (userPointsElement) {
      userPointsElement.textContent = userRewardsPoints;
    }
    
    alert('Reward redeemed successfully!');
    return true;
  } catch (error) {
    console.error('Error redeeming reward:', error);
    alert('Failed to redeem reward. Please try again.');
    return false;
  }
}

async function renderRewards(showAvailable = true) {
  const grid = document.getElementById('rewardsGrid');
  if (!grid) return;
  
  try {
    const rewards = await getRewards();
    grid.innerHTML = '';
    
    let filtered = showAvailable
      ? rewards.filter(r => (userRedemptions[r.id] || 0) < r.maxRedemptions)
      : rewards.filter(r => (userRedemptions[r.id] || 0) > 0);
    
    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#888;">No rewards to display.</div>`;
      return;
    }
    
    filtered.forEach(r => {
      const card = document.createElement('div');
      card.className = 'reward-card';
      const userRedemptionCount = userRedemptions[r.id] || 0;
      card.innerHTML = `
        <img src="${r.imagePath}" alt="${r.name}">
        <div class="reward-title">${r.name}</div>
        <div class="reward-desc">${r.description}</div>
        <div class="reward-points">${r.points} points</div>
        <div class="reward-validity">Validity: ${r.validity} months</div>
        <div class="redemption-info">Redeemed: ${userRedemptionCount}/${r.maxRedemptions}</div>
        <button class="reward-redeem-btn" ${userRewardsPoints < r.points || userRedemptionCount >= r.maxRedemptions ? 'disabled' : ''} data-id="${r.id}">Redeem</button>
      `;
      
      card.onclick = e => {
        if (e.target.classList.contains('reward-redeem-btn')) return;
        window.location.href = 'reward_detail.html?id=' + r.id;
      };
      
      card.querySelector('.reward-redeem-btn').onclick = async (e) => {
        e.stopPropagation();
        const success = await handleRedeemReward(r.id, r.points, r.name);
        if (success) {
          renderRewards(showAvailable);
        }
      };
      
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading rewards:', error);
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#888;">Error loading rewards.</div>`;
  }
}

function setupToggle() {
  const btnAvailable = document.getElementById('showAvailable');
  const btnRedeemed = document.getElementById('showRedeemed');
  if (!btnAvailable || !btnRedeemed) return;
  
  btnAvailable.onclick = () => {
    btnAvailable.classList.add('active');
    btnRedeemed.classList.remove('active');
    renderRewards(true);
  };
  
  btnRedeemed.onclick = () => {
    btnRedeemed.classList.add('active');
    btnAvailable.classList.remove('active');
    renderRewards(false);
  };
}

async function renderRewardDetail() {
  // Only run on reward_detail.html
  if (!window.location.pathname.endsWith('reward_detail.html')) return;
  
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    
    const rewards = await getRewards();
    const reward = rewards.find(r => r.id === id);
    if (!reward) return;
    
    const userRedemptionCount = userRedemptions[id] || 0;
    
    document.getElementById('rewardImage').src = reward.imagePath;
    document.getElementById('rewardName').textContent = reward.name;
    document.getElementById('rewardDesc').textContent = reward.description;
    document.getElementById('rewardPoints').textContent = reward.points;
    document.getElementById('userPoints').textContent = userRewardsPoints;
    document.getElementById('rewardValidity').textContent = reward.validity;
    document.getElementById('userRedemptions').textContent = userRedemptionCount;
    document.getElementById('maxRedemptions').textContent = reward.maxRedemptions;
    
    const redeemBtn = document.getElementById('redeemBtn');
    redeemBtn.disabled = userRewardsPoints < reward.points || userRedemptionCount >= reward.maxRedemptions;
    redeemBtn.onclick = async () => {
      const success = await handleRedeemReward(id, reward.points, reward.name);
      if (success) {
        renderRewardDetail();
      }
    };
  } catch (error) {
    console.error('Error loading reward detail:', error);
  }
}

// Initialize rewards immediately when script loads
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Rewards script loaded, initializing...');
  await initializeRewards();
});

// Handle user authentication state changes
auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log('User authenticated:', user.email);
    await loadUserData();
    
    if (document.getElementById('rewardsGrid')) {
      renderRewards(true);
      setupToggle();
    }
    renderRewardDetail();
  } else {
    console.log('User not authenticated');
    // Redirect to login if not authenticated
    if (window.location.pathname.includes('rewards')) {
      window.location.href = 'Login.html';
    }
  }
}); 