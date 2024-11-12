if (!location.href.includes('#')) {
  location.replace(location.href + '#/products');
  render();
}

window.addEventListener('load', render);
window.addEventListener('hashchange', render);

const container = document.getElementById('cards-container');
const moreButton = document.getElementById('more');
const hideButton = document.getElementById('hide');
const addButton = document.getElementById('add');

function createCard(imageSourse, textValue, priceValue = null) {
  const card = document.createElement('div');
  card.classList.add('card');

  const image = document.createElement('div');
  image.classList.add('card-image');
  image.style.backgroundImage = `url("${imageSourse}")`;
  card.append(image);

  if (priceValue) {
    const price = document.createElement('p');
    price.classList.add('card-price');
    price.textContent = '$' + priceValue;
    card.append(price);
  }


  const text = document.createElement('p');
  text.classList.add('card-text');
  text.textContent = textValue;
  card.append(text);

  return card;
}

let counter = 1;
let fData = [];

async function showPage(category) {
  hideButton.classList.add('hidden');
  moreButton.classList.remove('hidden');

  [...document.getElementsByClassName('menu-link')].forEach((link) => {
    link.classList.remove('active');
  })
  document.getElementById(category).classList.add('active');

  // const header = document.getElementById('header');
  // header.textContent = category[0].toUpperCase() + category.slice(1);

  const response  = await fetch(`https://api.escuelajs.co/api/v1/${category}`, { method: "GET" });
  const data = await response.json();

  const correctImage = (str) => str.startsWith('[') ? str.slice(2, -2) : str;

  fData = []
  switch (category) {
    case "products":
      fData = data.map(({ title, images, price }) => ({ text: title, image: correctImage(images[0]), price: price }));
      break;
    case "categories":
        fData = data.map(({ name, image }) => ({ text: name, image: correctImage(image), price: null }));
        break;
        case "users":
          fData = data.map(({ name, avatar }) => ({ text: name, image: correctImage(avatar), price: null }));
          break;
    default:
      break;
  }

  console.log(fData);
  if (fData.length <= 4) {
    moreButton.classList.add('hidden');
  }

  counter = 0;

  [...container.getElementsByClassName('card')].forEach((card) => {
    if (card.id !== 'add-card') card.remove();
  })

  for (let i = 0; i < 3; i += 1) {
    container.append(createCard(fData[i].image, fData[i].text, fData[i].price));
    counter += 1;
  }
}

function render() {
  const category = location.href.split('#')[1].slice(1);
  showPage(category);
}

function showMore() {
  for (let i = 0; i < 4 && counter < fData.length; i += 1) {
    container.append(createCard(fData[counter].image, fData[counter].text, fData[counter].price));
    counter += 1;
  }

  if (counter >= fData.length - 1) {
    moreButton.classList.add('hidden');
    hideButton.classList.remove('hidden');
  }
}
moreButton.addEventListener('click', showMore);


function hide() {
  const cards = [...document.getElementsByClassName("card")];
  for (let i = 4; i < cards.length; i += 1) {
    const card = cards[i];
    card.remove()
  }
  counter = 4;
  hideButton.classList.add('hidden');
  moreButton.classList.remove('hidden');
}
hideButton.addEventListener('click', hide);

const form = document.getElementById('add-form');
form.addEventListener('submit', addItem);
const blackout = document.getElementById('blackout');
blackout.addEventListener('click', hideAddForm);

function showAddForm() {
  const category = location.href.split('#')[1].slice(1);
  form.innerHTML = '';

  const header = document.createElement('h1');
  header.classList.add('form-header');
  form.append(header)
  switch (category) {
    case "categories":
      header.textContent = 'New category';

      const nameInput = document.createElement('input');
      nameInput.id = 'name';
      nameInput.classList.add('text-input');
      nameInput.type = 'text';
      nameInput.required = true;
      nameInput.placeholder = 'Enter category name';

      const imageInput = document.createElement('input');
      imageInput.id = 'image';
      imageInput.classList.add('text-input');
      imageInput.type = 'text';
      imageInput.required = true;
      imageInput.placeholder = 'Enter image link';

      const button = document.createElement('button');
      button.id = 'create';
      button.textContent = 'Create category';
      button.classList.add('button');
      //button.addEventListener('click', addItem);

      form.append(nameInput, imageInput, button);
      break;
  
    default:
      header.textContent = 'Not aviable';
      break;
  }
  blackout.classList.remove('hidden');
  form.classList.remove('hidden');
  document.getElementById('add').classList.add('active');
}

function hideAddForm() {
  document.getElementById('add').classList.remove('active');
  document.getElementById('create').removeEventListener('click', addItem);
  form.classList.add('hidden');
  blackout.classList.add('hidden');
}

async function addItem(event) {
  event.preventDefault();
  document.getElementById('create').disabled = true;

  const category = location.href.split('#')[1].slice(1);
  const pattern = {
    products: {

    },
    categories: {
      name: '',
      image: '',
    },
    users: {

    },
  }

  const body = {};
  Object.keys(pattern[category]).forEach((key) => {
    body[key] = document.getElementById(key).value;
  })

  await fetch(`https://api.escuelajs.co/api/v1/${category}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body),
  })

  hideAddForm();
}
addButton.addEventListener('click', showAddForm);
