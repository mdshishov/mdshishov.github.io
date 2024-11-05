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
      link.href = `./films/${filmId}`;
      link.textContent = filmName;
      link.addEventListener('click', openFilmPage);

      const listItem = document.createElement('li');
      listItem.append(link);

      list.append(listItem);
    })
}
//showMain();

async function showFilmPage(filmId) {
  container.innerHTML = '';


}

function render() {
  const url = new URL(location.href);
  const path = url.pathname;
  if (!path.split('/').includes('films')) {
    showMain();
  } else {
    showFilmPage(path.split('/').at(-1));
  }; 
}

// document.querySelectorAll('a').forEach((elem) => elem.addEventListener('click',(e) =>{e.preventDefault();
//     console.log('yes')
// history.pushState({},'', e.target.href)}));

function openFilmPage(event) {
  event.preventDefault();
  history.pushState({},'', event.target.href);
}