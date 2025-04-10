async function app() {
  const posts = [];
  try {
    posts.push(...await fetch('./posts.json').then((result) => result.json()));
  } catch (error) {
    showErrorMessage();
    return;
  }

  console.log(posts);

  const uiState = {
    positions: [],
  }
  
  const state = { posts, uiState };
  
  function generateStartPosition() {}
  
  function renderStartState() {}
  
  function createPostEl(postData) {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
  
    const header = document.createElement('div');
    header.classList.add('post__header');
    header.textContent = postData.header;
  }
  function showErrorMessage() {}
}

document.addEventListener('DOMContentLoaded', app);