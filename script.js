const items = [
  { name: "AK-47 (common)", image: "item1.png", chance: 70 },
  { name: "m4a1-s (common)", image: "item2.png", chance: 70 },
  { name: "mac-10 (common)", image: "item3.png", chance: 70 },
  { name: "famas (common)", image: "item4.png", chance: 70 },
  { name: "AK-47 (rare)", image: "item5.png", chance: 20 },
  { name: "USP-S (rare)", image: "item6.png", chance: 20 },
  { name: "M4A1 (epic rare)", image: "item7.png", chance: 7 },
  { name: "Knife (ultra rare)", image: "item8.png", chance: 3 }
];

const openSound = new Audio('sounds/open_case.mp3');
const finalSound = new Audio('sounds/final.mp3');

const button = document.querySelector("button");

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

  setTimeout(() => {
    const finalIndex = Math.floor((offset + 600 / 2 - itemWidth / 2) / itemWidth);
    const resultItem = displayItems[finalIndex];
    resultDiv.textContent = `Dropped: ${resultItem.name}`;


    // Определяем цвет черты по индексу
    const itemIndex = items.findIndex(it => it.name === resultItem.name);
    let rarityClass = "";
    if (itemIndex <= 3) rarityClass = "blue-bar";
    else if (itemIndex <= 5) rarityClass = "purple-bar";
    else if (itemIndex === 6) rarityClass = "pink-bar";
    else if (itemIndex === 7) rarityClass = "yellow-bar";

    finalSound.play()

    button.disabled = false;
    button.style.opacity = "1";
    button.style.cursor = "pointer";

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

  }, 5100);
}


module.exports = { getRandomItem, items };
