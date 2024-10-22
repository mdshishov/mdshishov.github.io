const data = [
  { image: './src/images/img1.png', title: 'Введение', topics: ['Как работают сайты. Верстка', 'Возможности HTML, CSS, JS', 'Редактор кода. Codepen', 'Работа с DevTools'] },
  { image: './src/images/img2.png', title: 'Базовый HTML', topics: ['Базовые теги', 'Теги картинок и ссылок', 'Теги таблиц', 'Служебные теги', 'Кодстайл HTML'] },
  { image: './src/images/img3.png', title: 'Базовый CSS', topics: ['Как работают сайты. Верстка', 'Возможности HTML, CSS, JS', 'Редактор кода. Codepen', 'Работа с DevTools'] },
  { image: './src/images/img4.png', title: 'Работа с макетом', topics: ['Про форматы изображений', 'Работа с макетом в Photoshop', 'Работа с макетом в Figma'] },
  { image: "https://blog.unif.pro/wp-content/uploads/2017/05/IT.jpg", title: "Введение в ООП", topics: ["Объекты", "Конструкторы", "Классы", "Наследование"] },  
  { image: "https://blog.unif.pro/wp-content/uploads/2017/05/IT.jpg", title: "Функции", topics: ["Объявление и вызов", "Рекурсия", "Параметры", "Оператор return"] },  
  { image: "https://blog.unif.pro/wp-content/uploads/2017/05/IT.jpg", title: "Массивы", topics: ["Сортировка", "Поиск в массиве", "Срезы"] },  
  { image: "https://blog.unif.pro/wp-content/uploads/2017/05/IT.jpg", title: "Введение в JS", topics: ["Переменные", "Константы", "Условия", "Циклы"] },  
  { image: "https://blog.unif.pro/wp-content/uploads/2017/05/IT.jpg", title: "Основы React", topics: ["Создание проекта", "Компоненты", "Условный рендеринг", "Роутинг"] },  
  { image: "https://blog.unif.pro/wp-content/uploads/2017/05/IT.jpg", title: "Основы flex", topics: ["Выравнивание элементов", "Растягивание элементов", "Направление элементов"] }  
]

const container = document.getElementById('container');
const addButton = document.getElementById('more');
const hideButton = document.getElementById('hide');
let counter = 1;

function addCard(data) {
  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('div');
  img.classList.add('img');
  img.style.backgroundImage = `url(${data.image})`;

  const innerContainer = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.textContent = data.title;
  const ul = document.createElement('ul');
  for (const item of data.topics) {
    const li = document.createElement('li');
    li.textContent = item;
    ul.append(li);
  }
  innerContainer.append(h2);
  innerContainer.append(ul);

  const number = document.createElement('p');
  number.classList.add('number');
  number.textContent = `${counter}`.padStart(2, '0');

  card.append(img);
  card.append(innerContainer);
  card.append(number);

  container.append(card);
}

function showMore() {
  addCard(data[counter - 1]);
  counter += 1;
  addCard(data[counter - 1]);
  counter += 1;

  if (counter > 10) {
    addButton.classList.add('hidden');
    hideButton.classList.remove('hidden');
  }
}
addButton.addEventListener('click', showMore);

function hide() {
  const cards = document.querySelectorAll(".card");
  for (let i = 4; i < 10; i += 1) {
    const card = cards[i];
    card.remove()
  }
  counter = 5;
  addButton.classList.remove('hidden');
  hideButton.classList.add('hidden');

}
hideButton.addEventListener('click', hide);

for (let i = 0; i < 4; i += 1) {
  addCard(data[counter - 1]);
  counter += 1;
}