// Читаем файл и добавляем элементы на страницу
document.addEventListener('DOMContentLoaded', app);

// Добавляем события для перемещения наших элемментов
document.addEventListener('mousedown', startPostMoving);
document.addEventListener('touchstart', startPostMoving);

document.addEventListener('mousemove', movePost);
document.addEventListener('touchmove', movePost);

document.addEventListener('mouseup', endPostMoving);
document.addEventListener('touchend', endPostMoving);

async function app() {
  const posts = [];
  try {
    posts.push(...await fetch('./posts.json').then((result) => result.json()));
  } catch (error) {
    showErrorMessage();
    return;
  }

  const container = document.getElementById('app');
  if (!container) {
    showErrorMessage();
    return;
  }

  renderStartState();

  function renderStartState() {
    shuffleArray(posts);
    posts.forEach((post, i) => {
      postEl = createPostEl(post);
      postEl.style.zIndex = i;
      container.append(postEl);
    });
  }
  
  function createPostEl(postData) {
    const postEl = document.createElement('div');
    postEl.classList.add('post');

    // Генерируем случайную ширину
    const postWidth = getRandom(250, 350);
    postEl.style.width = `${postWidth}px`;
    // Генерируем случайное расположение на странице
    const topPos = 100 * (getRandom(0, Math.max(window.innerHeight - 200, 0)) / window.innerHeight);
    const leftPos = 100 * (getRandom(0, Math.max(window.innerWidth - postWidth, 0)) / window.innerWidth);
    postEl.style.top = `${topPos}vh`;
    postEl.style.left = `${leftPos}vw`;
    // Выводим пост на передний план при клике
    postEl.addEventListener('mousedown', () => putAboveAll(postEl));
    postEl.addEventListener('touchstart', () => putAboveAll(postEl));

    const postHeader = document.createElement('div');
    postHeader.classList.add('post__header');
    postHeader.textContent = postData.header;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.classList.add('post__btn-close');
    closeBtn.textContent='×';
    closeBtn.addEventListener('click', () => {
      postEl.remove();
    })

    postHeader.append(closeBtn);
    postEl.append(postHeader);

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

  function showErrorMessage() {
    const errorEl = document.createElement('div');
    errorEl.classList.add('error');
    errorEl.textContent = 'Упс, что-то пошло не так. Пожалуйста, перезагрузите страницу.';
    document.body.append(errorEl);
  }
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