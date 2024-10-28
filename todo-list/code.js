const input = document.getElementById('input');
const inputButton = document.getElementById('input-button');
const container = document.getElementById('container');

input.addEventListener('input', (event) => {
  console.log(event);
  if (event.keyCode === 13) {
    console.log('yes');
  }
  input.style.height = 'auto';
  input.style.height = input.scrollHeight + 'px';
  inputButton.disabled = input.value.trim().length === 0;
})

function createCard(content) {
  const card = document.createElement('div');
  card.classList.add('card');
  const text = document.createElement('div');
  text.classList.add('text');
  text.textContent = content;
  const doneButton = document.createElement('button');
  doneButton.classList.add('icon');
  doneButton.classList.add('done-button');
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('icon');
  deleteButton.classList.add('delete-button');
  const corner = document.createElement('div');
  corner.classList.add('corner');
  card.append(text, doneButton, deleteButton, corner);
  container.append(card);
}

inputButton.addEventListener('click', () => {
  createCard(input.value.trim());
  input.value = '';
})

function addNote() {

}