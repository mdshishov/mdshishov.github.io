if (!location.href.includes('#')) {
  location.replace(location.href + '#/products');
  render();
}

window.addEventListener('load', render);
window.addEventListener('hashchange', render);

const container = document.getElementById('cards-container');
const moreButton = document.getElementById('more');
const hideButton = document.getElementById('hide');

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
  [...document.getElementsByClassName('menu-link')].forEach((link) => {
    link.classList.remove('active');
  })
  document.getElementById(category).classList.add('active');

  // const header = document.getElementById('header');
  // header.textContent = category[0].toUpperCase() + category.slice(1);

  const response  = await fetch(`https://api.escuelajs.co/api/v1/${category}`, { method: "GET" });
  const data = await response.json();
  console.log(data);

  fData = []
  switch (category) {
    case "products":
      fData = data.map(({ title, images, price }) => ({ text: title, image: images[0], price: price }));
      break;
    case "categories":
        fData = data.map(({ name, image }) => ({ text: name, image: image, price: null }));
        break;
        case "users":
          fData = data.map(({ name, avatar }) => ({ text: name, image: avatar, price: null }));
          break;
    default:
      break;
  }

  counter = 1;

  container.innerHTML = '';

  for (let i = 0; i < 4; i += 1) {
    container.append(createCard(fData[i].image, fData[i].text, fData[i].price));
    counter += 1;
  }
}

function render() {
  const category = location.href.split('#')[1].slice(1);
  showPage(category);
}

function showMore() {
  for (let i = 0; i < 4 && counter < fData.length; i += 1)
  container.append(createCard(fData[counter - 1].image, fData[counter - 1].text, fData[counter - 1].price));
  counter += 1;

  if (counter >= fData.length) {
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
  counter = 5;
  moreButton.classList.remove('hidden');
  hideButton.classList.add('hidden');

}
hideButton.addEventListener('click', hide);