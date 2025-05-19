const items = [
  { name: "Common 1", image: "item1.png", chance: 70 },
  { name: "Common 2", image: "item2.png", chance: 70 },
  { name: "Common 3", image: "item3.png", chance: 70 },
  { name: "Common 4", image: "item4.png", chance: 70 },
  { name: "Rare 1", image: "item5.png", chance: 20 },
  { name: "Rare 2", image: "item6.png", chance: 20 },
  { name: "Epic", image: "item7.png", chance: 7 },
  { name: "Legendary", image: "item8.png", chance: 3 }
];

function getRandomItem() {
  const totalWeight = items.reduce((acc, item) => acc + item.chance, 0);
  let rand = Math.random() * totalWeight;
  for (let item of items) {
    if (rand < item.chance) return item;
    rand -= item.chance;
  }
}

function openCase() {
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
    resultDiv.textContent = `Выпало: ${resultItem.name}`;

    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML = `
      <img src="images/${resultItem.image}" alt="${resultItem.name}" />
      <span>${resultItem.name}</span>
    `;
    history.prepend(historyItem);

  }, 5100);
}


module.exports = { getRandomItem, items };
