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

  const uiState = {
    positions: [],
  }
  
  const state = { posts, uiState };
  
  function generateStartPosition() {}
  
  function renderStartState() {
    posts.forEach((post) => {
      postEl = createPostEl(post);
      // функция генерации расположения
      container.append(postEl);
    })
  }
  
  function createPostEl(postData) {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
  
    const postHeader = document.createElement('div');
    postHeader.classList.add('post__header');
    postHeader.textContent = postData.header;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.classList.add('post__btn-close');
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
    ul.classList.add('post__body__links');

    const liEls = postData.links.map((linkData) => {
      const li = document.createElement('li');
      li.classList.add('post__body__link');
      const a = document.createElement('a');
      a.url = linkData.url;
      a.textContent = '> ' + linkData.text;
      li.append(a);
      return li;
    });

    ul.append(...liEls);
    postBody.append(title, description, ul);
    postEl.append(postBody);
  
    return postEl;
  }

  function showErrorMessage() {}
}

document.addEventListener('DOMContentLoaded', app);