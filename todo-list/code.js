const input = document.getElementById('input');
const inputButton = document.getElementById('input-button');
const inputCard = document.getElementById('input-card');
const container = document.getElementById('container');

input.addEventListener('input', resizeInput);
input.addEventListener('keydown', endInput);
input.addEventListener('focus', focusInputCard);
input.addEventListener('blur', blurInputCard);


function resizeInput(event) {
  input.style.height = 'auto';
  input.style.height = input.scrollHeight + 'px';
  //inputButton.disabled = input.value.trim().length === 0;
}
function endInput(event) {
  if (event.keyCode === 13) {
    if (input.value.trim().length !== 0) {
      createCard(input.value.trim());
    }
    input.blur();
    inputCard.classList.remove('focus');
    input.value = '';
    resizeInput();
  }
}
function focusInputCard() {
  input.classList.add('focus');
  inputCard.classList.add('focus');
}
function blurInputCard() {
  inputCard.classList.remove('focus');
  setTimeout(() => { input.classList.remove('focus')}, 500);
}

function deleCard(event) {
  const card = event.target.parentNode;
  card.remove();
}

function doneCard(event) {
  const button = event.target;
  const card = button.parentNode;
  button.classList.toggle('done');
  card.classList.toggle('done');

}

function createCard(content) {
  const card = document.createElement('div');
  card.classList.add('card');

  const text = document.createElement('div');
  text.classList.add('text');
  text.textContent = content;

  const doneButton = document.createElement('button');
  doneButton.classList.add('icon');
  doneButton.classList.add('done-button');
  doneButton.addEventListener('click', doneCard);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('icon');
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', deleCard);

  const corner = document.createElement('div');
  corner.classList.add('corner');

  card.append(text, doneButton, deleteButton, corner);
  container.prepend(card);
}

inputButton.addEventListener('click', () => {

})

function addNote() {

}