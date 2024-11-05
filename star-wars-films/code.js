const container = document.getElementById('container');
const arToRom = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
}

window.addEventListener('load', render);
window.addEventListener('hashchange', render);

async function getFilmsData() {
  const response = await fetch('https://www.swapi.tech/api/films', { method: "GET" });
  const result = await response.json();
  return result.result;
}
async function getFilmData(filmId) {
  const response = await fetch(`https://www.swapi.tech/api/films/${filmId}`, { method: "GET" });
  const result = await response.json();
  return result.result;
}
async function getDataFromUrl(url) {
  const response = await fetch(url, { method: "GET" });
  const result = await response.json();
  return result.result;
}
async function addListItem(target, url) {
  const item = await getDataFromUrl(url);
  const listItem = document.createElement('li');
  listItem.textContent = item.properties.name;
  target.append(listItem);
}

async function showMain() {
  container.innerHTML = '';

  const header = document.createElement('h1');
  header.textContent = 'Star Wars Films:';
  container.append(header);

  const list = document.createElement('ul');
  container.append(list);

  const data = await getFilmsData();
  data
    .sort((film1, film2) => film1.properties.episode_id - film2.properties.episode_id)
    .forEach((film) => {
      const filmId = film.uid;
      const epId = film.properties.episode_id;
      const title = film.properties.title;
      const filmName = `Star Wars. Episode ${arToRom[epId]}: ${title}`;

      const link = document.createElement('a');
      link.href = `#/films/${filmId}`;
      link.textContent = filmName;
      link.addEventListener('click', openFilmPage);

      const listItem = document.createElement('li');
      listItem.append(link);

      list.append(listItem);
    })
}

async function showFilmPage(filmId) {
  container.innerHTML = '';

  const film = await getFilmData(filmId);
  const epId = film.properties.episode_id;
  const title = film.properties.title;
  const filmName = `Star Wars. Episode ${arToRom[epId]}: ${title}`;

  const header = document.createElement('h1');
  header.textContent = filmName;
  container.append(header);

  const back = document.createElement('a');
  back.href = './';
  back.textContent = 'Back to episodes';
  container.append(back);

  const description = document.createElement('p');
  description.textContent = film.properties.opening_crawl;
  container.append(description);

  const planetsHeader = document.createElement('h2');
  planetsHeader.textContent = 'Planets';
  container.append(planetsHeader);
  const planetsList = document.createElement('ul');
  const planets = film.properties.planets;
  planets.forEach((url) => {
    addListItem(planetsList, url);
  });
  container.append(planetsList);

  const speciesHeader = document.createElement('h2');
  speciesHeader.textContent = 'Species';
  const speciesList = document.createElement('ul');
  const species = film.properties.species;
  container.append(speciesHeader);
  species.forEach((url) => {
    addListItem(speciesList, url);
  });
  container.append(speciesList);
}

function render() {
  const url = location.href;

  if (!url.includes('#')) {
    showMain();
  } else {
    showFilmPage(url.split('/').at(-1));
  }; 
}

function openFilmPage(event) {
  event.preventDefault();
  history.pushState({},'', event.target.href);
  render();
}
