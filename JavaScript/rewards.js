// Mock data for rewards
const rewards = [
  {
    id: 1,
    name: 'Chuka Wakame',
    description: 'Seaweed salad with a subtly sweet and savory flavor.',
    image: '../_Assets/images/foods/appetizers/chuka_wakame.png',
    points: 1500,
    validity: 8,
    maxRedemptions: 3,
    userRedemptions: 0
  },
  {
    id: 2,
    name: 'Ebi Curry Udon',
    description: 'Curry udon with ebi tempura.',
    image: '../_Assets/images/foods/curry_sets/ebi_curry_udon.png',
    points: 2000,
    validity: 6,
    maxRedemptions: 2,
    userRedemptions: 1
  },
  {
    id: 3,
    name: 'Chicken Teriyaki Ramen',
    description: 'Ramen with chicken teriyaki and vegetables.',
    image: '../_Assets/images/foods/ramen/chicken_teriyaki_ramen.png',
    points: 1800,
    validity: 7,
    maxRedemptions: 4,
    userRedemptions: 2
  },
  {
    id: 4,
    name: 'Ebi Tempura',
    description: 'Crispy battered shrimp tempura.',
    image: '../_Assets/images/foods/tempura/ebi_tempura.png',
    points: 1700,
    validity: 5,
    maxRedemptions: 2,
    userRedemptions: 2
  }
];

const userPoints = 5000;

function renderRewards(showAvailable = true) {
  const grid = document.getElementById('rewardsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  let filtered = showAvailable
    ? rewards.filter(r => r.userRedemptions < r.maxRedemptions)
    : rewards.filter(r => r.userRedemptions > 0);
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#888;">No rewards to display.</div>`;
    return;
  }
  filtered.forEach(r => {
    const card = document.createElement('div');
    card.className = 'reward-card';
    card.innerHTML = `
      <img src="${r.image}" alt="${r.name}">
      <div class="reward-title">${r.name}</div>
      <div class="reward-desc">${r.description}</div>
      <div class="reward-points">${r.points} points</div>
      <div class="reward-validity">Validity: ${r.validity} months</div>
      <button class="reward-redeem-btn" ${userPoints < r.points || r.userRedemptions >= r.maxRedemptions ? 'disabled' : ''} data-id="${r.id}">Redeem</button>
    `;
    card.onclick = e => {
      if (e.target.classList.contains('reward-redeem-btn')) return;
      // Go to detail page (simulate passing id)
      window.location.href = 'reward_detail.html?id=' + r.id;
    };
    card.querySelector('.reward-redeem-btn').onclick = e => {
      e.stopPropagation();
      alert('Redeem logic not implemented (mock).');
    };
    grid.appendChild(card);
  });
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

function renderRewardDetail() {
  // Only run on reward_detail.html
  if (!window.location.pathname.endsWith('reward_detail.html')) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  const reward = rewards.find(r => r.id === id) || rewards[0];
  document.getElementById('rewardImage').src = reward.image;
  document.getElementById('rewardName').textContent = reward.name;
  document.getElementById('rewardDesc').textContent = reward.description;
  document.getElementById('rewardPoints').textContent = reward.points;
  document.getElementById('userPoints').textContent = userPoints;
  document.getElementById('rewardValidity').textContent = reward.validity;
  document.getElementById('userRedemptions').textContent = reward.userRedemptions;
  document.getElementById('maxRedemptions').textContent = reward.maxRedemptions;
  const redeemBtn = document.getElementById('redeemBtn');
  redeemBtn.disabled = userPoints < reward.points || reward.userRedemptions >= reward.maxRedemptions;
  redeemBtn.onclick = () => {
    alert('Redeem logic not implemented (mock).');
  };
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('rewardsGrid')) {
    renderRewards(true);
    setupToggle();
  }
  renderRewardDetail();
}); 