function loadHistory() {
  if (!confirm("Are you sure you want to load past opened cases items?")) return;

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const username = userData.username || '';
  if (!username) {
    alert("No user logged in.");
    return;
  }

  return fetch(`http://localhost:5000/api/user/${username}`) 
    .then(res => res.json())
    .then(user => {
      const history = document.getElementById('history');
      history.innerHTML = '';

      if (!user.items || user.items.length === 0) {
        alert('No history found.');
        return;
      }

      user.items.slice().reverse().forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
          <div class="image-wrapper">
            <img src="images/${item.image}" alt="${item.name}" />
            <div class="rarity-bar ${item.rarity}-bar"></div>
          </div>
          <span>${item.name}</span>
        `;
        history.appendChild(historyItem);
      });

      console.log('History loaded');
    })
    .catch(err => console.error('Error loading history:', err));
}


function clearHistory() {
  if (!confirm("Are you sure you want to clear the history?")) return;

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const username = userData.username || '';
  if (!username) {
    alert("No user logged in.");
    return;
  }

  return fetch(`http://localhost:5000/api/user/${username}/items`, {
    method: 'DELETE',
  })
  .then(res => res.json())
  .then(data => {
    console.log(data.message);
    document.getElementById('history').innerHTML = '';
  })
  .catch(err => console.error('Error clearing history:', err));
}



function showRegister() {
  document.getElementById("register-container").style.display = "flex";
  document.getElementById("login-container").style.display = "none";
  document.querySelector(".main_part").style.display = "none";

  const resultDiv = document.getElementById('register-result');
  resultDiv.textContent = '';
}

function showLogin() {
  document.getElementById("register-container").style.display = "none";
  document.getElementById("login-container").style.display = "flex";
  document.querySelector(".main_part").style.display = "none";

  const resultDiv2 = document.getElementById('login-result');
  resultDiv2.textContent = '';
}

module.exports = {
  loadHistory,
  clearHistory,
  showRegister,
  showLogin,
};