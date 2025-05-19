const items = [
  { name: "AK-47 (common)", image: "item1.png", chance: 70, rarity: "blue" },
  { name: "m4a1-s (common)", image: "item2.png", chance: 70, rarity: "blue" },
  { name: "mac-10 (common)", image: "item3.png", chance: 70, rarity: "blue" },
  { name: "famas (common)", image: "item4.png", chance: 70, rarity: "blue" },
  { name: "AK-47 (rare)", image: "item5.png", chance: 20, rarity: "purple" },
  { name: "USP-S (rare)", image: "item6.png", chance: 20, rarity: "purple" },
  { name: "M4A1 (epic rare)", image: "item7.png", chance: 7, rarity: "pink" },
  { name: "Knife (ultra rare)", image: "item8.png", chance: 3, rarity: "yellow" }
];

async function addItemsOnce() {
  const res = await fetch('http://localhost:5000/api/items');
  const existingItems = await res.json();
  if (existingItems.length > 0) {
    console.log('Items already exist');
    return;
  }

  for (const item of items) {
    const response = await fetch('http://localhost:5000/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Error adding item:', data.error);
    } else {
      console.log('Added item:', data.name);
    }
  }
}

addItemsOnce();

const openSound = new Audio('sounds/open_case.mp3');
const finalSound = new Audio('sounds/final.mp3');

const button = document.querySelector("button");

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('user');
  document.getElementById('login-status').textContent = '';

  showLogin();
});

function showLoginStatus(username, email) {
  const statusDiv = document.getElementById("login-status");
  statusDiv.innerHTML = `
    <strong>${username}</strong> ${email}
  `;
}

function showMainPart() {
  document.getElementById("register-container").style.display = "none";
  document.getElementById("login-container").style.display = "none";
  document.querySelector(".main_part").style.display = "block";
}

window.addEventListener('DOMContentLoaded', () => {
  const userData = JSON.parse(localStorage.getItem("user") || '{}');
  if (userData.username && userData.email) {
    showLoginStatus(userData.username, userData.email);
    showMainPart();
  } else {
    showRegister();
  }
});


function getRandomItem() {
  const totalWeight = items.reduce((acc, item) => acc + item.chance, 0);
  let rand = Math.random() * totalWeight;
  for (let item of items) {
    if (rand < item.chance) return item;
    rand -= item.chance;
  }
}

function openCase() {
  openSound.play();

  button.disabled = true;
  button.style.opacity = "0.5";
  button.style.cursor = "not-allowed";

  const carousel = document.getElementById("carousel");
  const resultDiv = document.getElementById("result");
  const history = document.getElementById("history");

  carousel.innerHTML = "";
  resultDiv.textContent = "";

  const displayItems = [];
  for (let i = 0; i < 80; i++) {
    const randomItem = getRandomItem();
    displayItems.push(randomItem);
  }

  displayItems.forEach(item => {
    const img = document.createElement("img");
    img.src = `images/${item.image}`;
    img.alt = item.name;
    carousel.appendChild(img);
  });

  const itemWidth = 110;
  const targetIndex = 50;
  const offset = (targetIndex * itemWidth) - (600 / 2) + (itemWidth / 2);

  carousel.style.transition = "none";
  carousel.style.transform = "translateX(0px)";

  setTimeout(() => {
    carousel.style.transition = "transform 5s cubic-bezier(0.1, 0.8, 0.3, 1)";
    carousel.style.transform = `translateX(-${offset}px)`;
  }, 100);

  setTimeout(async () => {
    const finalIndex = Math.floor((offset + 600 / 2 - itemWidth / 2) / itemWidth);
    const resultItem = displayItems[finalIndex];
    resultDiv.textContent = `Dropped: ${resultItem.name}`;

    const itemIndex = items.findIndex(it => it.name === resultItem.name);
    let rarityClass = "";
    if (itemIndex <= 3) rarityClass = "blue-bar";
    else if (itemIndex <= 5) rarityClass = "purple-bar";
    else if (itemIndex === 6) rarityClass = "pink-bar";
    else if (itemIndex === 7) rarityClass = "yellow-bar";

    finalSound.play();

    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML = `
      <div class="image-wrapper">
        <img src="images/${resultItem.image}" alt="${resultItem.name}" />
        <div class="rarity-bar ${rarityClass}"></div>
      </div>
      <span>${resultItem.name}</span>
    `;
    history.prepend(historyItem);

    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.username) {
        console.log('User not logged in, cannot save item');
        return;
      }

      const response = await fetch('http://localhost:5000/api/user/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username, 
          itemName: resultItem.name,
        })
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error saving item:', data.error);
      } else {
        console.log('Item saved successfully');
      }
    } catch (err) {
      console.error('Error saving opened item:', err);
    }

    button.disabled = false;
    button.style.opacity = "1";
    button.style.cursor = "pointer";
  }, 5100);
}

async function registerUser(event) {
  event.preventDefault();

  const form = event.target;
  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;

  console.log('Sending register request:', { username, email, password });

  try {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    const resultDiv = document.getElementById('register-result');
    if (res.ok) {
      resultDiv.textContent = 'User registered successfully! Try to Log in';
    } else {
      resultDiv.textContent = 'Error: ' + (data.error || 'Something went wrong');
    }
  } catch (err) {
    document.getElementById('register-result').textContent = 'Error: ' + err.message;
  }
}

document.getElementById('register-form').addEventListener('submit', registerUser);

async function loginUser(event) {
  event.preventDefault();

  const form = event.target;
  const usernameOrEmail = form.usernameOrEmail.value.trim();
  const password = form.password.value;

  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password }),
    });

    const data = await res.json();

    const resultDiv = document.getElementById('login-result');
    if (res.ok) {
      form.reset();

      document.querySelector('.main_part').style.display = 'block';
      document.getElementById('login-container').style.display = 'none';
      
      localStorage.setItem("user", JSON.stringify({ username: data.username, email: data.email }));
      showLoginStatus(data.username, data.email);
    } else {
      if (data.error && data.error.includes('Username or email already taken')) {
        resultDiv.textContent = 'User already exists. Please log in below.';
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
      } else {
        resultDiv.textContent = 'Error: ' + (data.error || 'Something went wrong');
      }
    }
  } catch (err) {
    document.getElementById('login-result').textContent = 'Error: ' + err.message;
  }
}

document.getElementById('login-form').addEventListener('submit', loginUser);