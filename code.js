// Состояние для перемещения элементов по странице
const movingState = {
  elem: null,
  isMoving: false,
  oldElemPos: {
    left: null,
    top: null,
  },
  oldMousePos: {
    x: null,
    y: null,
  }
};

// Запускаем приложение
document.addEventListener('DOMContentLoaded', startApp);

async function startApp() {
  // Массив для информации об элементах, которую необходимо отобразить
  const posts = []
  try {
    posts.push(...await fetch('./posts.json').then((result) => result.json()));
  } catch (error) {
    showErrorMessage();
    return;
  }

  const container = document.getElementById('container');
  if (!container) {
    showErrorMessage();
    return;
  }

  // Добавляем элементы на страницу
  renderStartState();

  // Добавляем события для перемещения наших элемментов
  document.addEventListener('mousedown', startPostMoving);
  document.addEventListener('touchstart', startPostMoving);

  document.addEventListener('mousemove', movePost);
  document.addEventListener('touchmove', movePost);

  document.addEventListener('mouseup', endPostMoving);
  document.addEventListener('touchend', endPostMoving);

  function renderStartState() {
    shuffleArray(posts);
    posts.forEach((post, i) => {
      postEl = createPostEl(post);
      postEl.style.zIndex = i;
      container.append(postEl);
    });
  
    const titlePostEl = createTitlePostEl();
    titlePostEl.style.zIndex = posts.length;
    container.append(titlePostEl);
  
    // Если ранее был отказ от показа подсказки, то окно не показываем
    if (!localStorage.getItem('noHint')) {
      const hintPostEl = createHintPostEl();
      hintPostEl.style.zIndex = posts.length + 1;
      container.append(hintPostEl);
    }
  }
}

function createEmptyPostEl(headerText = '') {
  const postEl = document.createElement('div');
  postEl.classList.add('post');

  // Выводим пост на передний план при клике
  postEl.addEventListener('mousedown', () => putAboveAll(postEl));
  postEl.addEventListener('touchstart', () => putAboveAll(postEl));

  const postHeader = document.createElement('div');
  postHeader.classList.add('post__header');
  postHeader.textContent = headerText;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.classList.add('post__btn-close');
  closeBtn.addEventListener('click', () => {
    postEl.remove();
  })

  postHeader.append(closeBtn);
  postEl.append(postHeader);

  return postEl;
}

function createPostEl(postData) {
  const postEl = createEmptyPostEl(postData.header);

  // Генерируем случайную ширину
  const postWidth = getRandom(250, 350);
  postEl.style.width = `${postWidth}px`;
  // Генерируем случайное расположение на странице
  const topPos = 100 * (getRandom(0, Math.max(window.innerHeight - 250, 0)) / window.innerHeight);
  const leftPos = 100 * (getRandom(0, Math.max(window.innerWidth - postWidth, 0)) / window.innerWidth);
  postEl.style.top = `${topPos}vh`;
  postEl.style.left = `${leftPos}vw`;

  const postBody = document.createElement('div');
  postBody.classList.add('post__body');

  const title = document.createElement('h2');
  title.classList.add('post__body__title');
  title.textContent = postData.title;

  const description = document.createElement('p');
  description.classList.add('post__body__text');
  description.textContent = postData.description;

  const ul = document.createElement('ul');
  ul.classList.add('post__body__links-ul');

  const liEls = postData.links.map((linkData) => {
    const li = document.createElement('li');
    li.classList.add('post__body__link-li');
    const a = document.createElement('a');
    a.classList.add('post__body__link');
    a.addEventListener('click', (event) => {
      event.preventDefault;
      window.open(linkData.url).focus();
    })
    a.textContent = '> ' + linkData.text;
    li.append(a);
    return li;
  });

  ul.append(...liEls);
  postBody.append(title, description, ul);
  postEl.append(postBody);

  return postEl;
}

function createTitlePostEl() {
  const postEl = createEmptyPostEl('title');

  // Генерируем случайное расположение на странице
  const topPos = 100 * ((Math.max(0, window.innerHeight - 160) / 2) / window.innerHeight);
  const leftPos = 100 * ((Math.max(0, window.innerWidth - 580) / 2) / window.innerWidth);
  postEl.style.top = `${topPos}vh`;
  postEl.style.left = `${leftPos}vw`;

  const postBody = document.createElement('div');
  postBody.classList.add('post__body', 'post__body_big-title');

  const title = document.createElement('h1');
  title.classList.add('post__body__title_big');
  title.textContent = '>study_projects';
  const span = document.createElement('span');
  span.textContent = '█';
  span.classList.add('blink');
  title.append(span);

  postBody.append(title);
  postEl.append(postBody);

  return postEl;
}

function createHintPostEl() {
  const postEl = createEmptyPostEl('hint');

  postEl.style.width = '230px';
  // Генерируем случайное расположение на странице
  const topPos = 100 * (getRandom(0, Math.max(window.innerHeight - 230, 0)) / window.innerHeight);
  const leftPos = 100 * (getRandom(0, Math.max(window.innerWidth - 230, 0)) / window.innerWidth);
  postEl.style.top = `${topPos}vh`;
  postEl.style.left = `${leftPos}vw`;

  const postBody = document.createElement('div');
  postBody.classList.add('post__body', 'post__body_no-title');

  const text = document.createElement('p');
  text.classList.add('post__body__text');
  text.innerHTML = '<b>Подсказка:</b> «окна» можно перемещать (за верхнюю часть) и закрывать (x).'

  const btn = document.createElement('button');
  btn.innerHTML = '> Закрыть и больше<br/>не показывать'
  btn.classList.add('post__body__btn');
  btn.addEventListener('click', () => {
    localStorage.setItem('noHint', 'true');
    postEl.remove();
  })

  postBody.append(text, btn);
  postEl.append(postBody);

  return postEl;
}

function showErrorMessage() {
  const errorEl = document.createElement('div');
  errorEl.classList.add('error');
  errorEl.textContent = 'Упс, что-то пошло не так. Пожалуйста, перезагрузите страницу.';
  document.body.append(errorEl);
}

function putAboveAll(postEl) {
  const posts = [...document.querySelectorAll('.post')];
  let maxZIndex = 0;
  posts.forEach((post) => {
    const zIndex = Number(post.style.zIndex);
    post.style.zIndex = zIndex - 1;
    if (zIndex > maxZIndex) maxZIndex = zIndex;
  });
  postEl.style.zIndex = maxZIndex;
};

function startPostMoving(event) {
  // Допускаем перемещение только за «шапку» поста, игнорируя кнопку закрытия
  if (
    event.target.closest(".post__btn-close")
    || !event.target.closest(".post__header") 
  ) {
    return;
  }

  const postEl = event.target.closest('.post');
  movingState.elem = postEl;
  movingState.isMoving = true;
  postEl.classList.add('is-moving');

  // Для курсора и касания
  movingState.oldMousePos.x = event.clientX ? event.clientX : event.touches[0].clientX;
  movingState.oldMousePos.y = event.clientY ? event.clientY : event.touches[0].clientY;

  movingState.oldElemPos.left = Number(window.getComputedStyle(postEl).left.slice(0, -2));
  movingState.oldElemPos.top = Number(window.getComputedStyle(postEl).top.slice(0, -2));
}

function movePost(event) {
  if (!movingState.isMoving) {
    return;
  }

  // Убираем выделение текста при перемещении окна
  if (window.getSelection) {
    if (window.getSelection().empty) {
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    document.selection.empty();
  }

  const distX = 
    (event.clientX ? event.clientX : event.touches[0].clientX)
    - movingState.oldMousePos.x;
  const distY =
    (event.clientY ? event.clientY : event.touches[0].clientY)
    - movingState.oldMousePos.y;

  // Считаем новую позицию через относительные единицы
  const postEl = movingState.elem;
  const newLeftPos = 100 * ((movingState.oldElemPos.left + distX) / window.innerWidth);
  const newTopPos = 100 * ((movingState.oldElemPos.top + distY) / window.innerHeight);
  postEl.style.left = `${newLeftPos}vw`;
  postEl.style.top = `${newTopPos}vh`;
}

function endPostMoving() {
  movingState.isMoving = false;
  const postEl = movingState.elem;
  postEl.classList.remove('is-moving');
}

function getRandom(start, end) {
  return Math.floor(Math.random() * (end + 1 - start)) + start;
}

// Перемешивает массив, модифицируя исходный
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = getRandom(0, i);
    const keeper = arr[i];
    arr[i] = arr[j];
    arr[j] = keeper;
  }
}