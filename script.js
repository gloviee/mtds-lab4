const items = [
  "item1.png",
  "item2.png",
  "item3.png",
  "item4.png",
  "item5.png",
  "item6.png"
];

function openCase() {
  const carousel = document.getElementById("carousel");
  carousel.innerHTML = "";

  const images = [];

  // Заполняем карусель многими элементами
  for (let i = 0; i < 30; i++) {
    const img = document.createElement("img");
    const item = items[Math.floor(Math.random() * items.length)];
    img.src = `images/${item}`;
    images.push(item);
    carousel.appendChild(img);
  }

  // Случайный сдвиг на X
  const stopAt = Math.floor(Math.random() * (items.length - 2) + 5);
  const offset = stopAt * 110; // ширина элемента + отступ
  carousel.style.transform = `translateX(-${offset}px)`;

  // Можно добавить звук, вспышку, результат и т.п.
}
