const startScreen = document.getElementById('start-screen');
const slider = document.getElementById('slider');
const label = document.getElementById('label');
const startButton = document.getElementById('start-button');
slider.oninput = function() {
  label.textContent = slider.value;
}

const gameScreen = document.getElementById('game-screen');
const container = document.getElementById('container');
const progressLine = document.getElementById('progress-line');
const timerLine = document.getElementById('timer-line');

const endScreen = document.getElementById('end-screen');
const endMessage = document.getElementById('end-message');
const endButton = document.getElementById('end-button');

let gameEnded = true;
let progress = 0;
let amount = 0;
let colors =  ['#b65780', '#cd909c', '#d1b3a2', '#f0f4c2', '#aac478', '#68a961', '#3d8057', '#439c6e', '#64b3a3', '#9bcfcb', '#6794af', '#4163a0', '#30233a', '#514a73', '#7a72ac', '#d2aadb'];
let numbers = [];
const opened = [];

function getRandom(start, end) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

function mixArray(arr) {
  const set = new Set();
  const result = [];

  arr.forEach((_, index) => set.add(index));

  while(set.size > 0) {
    const index = [...set][getRandom(0, set.size - 1)];
    result.push(arr[index]);
    set.delete(index);
  }
  return result;
}

function createNumbersArray(count) {
  const result = [];
  for (let i = 1; i <= count; i += 1) {
    result.push(i, i);
  }
  return result;
}

function setProgress() {
  progressLine.style.width = `${(progress / amount) * 100}%`;
  console.log(progress, amount);
  if (progress === amount) {
    setTimeout(() => {
      endGame('win');
    }, 1000);
  }
};

function endGame(outcome) {
  gameScreen.style.display = 'none';
  gameEnded = true;
  endMessage.textContent = outcome === 'win' ? 'Победа!' : 'Поражение';
  endScreen.style.display = 'block';
  resetGame();
}

function tryAgain() {
  startScreen.style.display = 'block';
  endScreen.style.display = 'none';
}
endButton.addEventListener('click', tryAgain);

function runTimer(time) {
  const requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

  const maxTime = time * 1000;
  let startTime = performance.now();
  let timeDiff = 0;

  function animation() {
    timeDiff = performance.now() - startTime;

    if (timeDiff > maxTime) {
      timerLine.style.width = '0%';
      endGame('loose');
      return;
    }
    if (gameEnded) {
      return;
    }

    timerLine.style.width = `${100 * (maxTime - timeDiff) / maxTime}%`;
    requestAnimationFrame(animation);
  }

  animation();
}

function clickCard(event) {
  if (opened.length < 2) {
    const card = event.target;
    card.removeEventListener('click', clickCard);

    opened.push(card);
    card.classList.remove('flip');

    
    if (opened.length === 2) {
      const [card1, card2] = opened;
      const id1 = Number(card1.id.split('-').at(-1));
      const id2 = Number(card2.id.split('-').at(-1));

      if (numbers[id1] === numbers[id2]) {
        progress += 1;
        setProgress();
        opened.pop();
        opened.pop();
      } else {
        setTimeout(() =>{
          card1.classList.add('flip');
          card2.classList.add('flip');
          card1.addEventListener('click', clickCard);
          card2.addEventListener('click', clickCard);
          opened.pop();
          opened.pop();
        }, 1000);
       }
    }
  }
}

function createCards(arr) {
  arr.forEach((number, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('flip');
    card.id = `card-${index}`;

    const frontSide = document.createElement('div');
    frontSide.classList.add('card-front');
    frontSide.textContent = number;
    frontSide.style.backgroundColor = colors[number];

    const backSide = document.createElement('div');
    backSide.classList.add('card-back');

    card.append(frontSide);
    card.append(backSide);

    card.addEventListener('click', clickCard);

    container.append(card);
  });
}

function resetGame() {
  slider.value = 4;
  label.textContent = '4';
  progress = 0;
  setProgress();
  container.innerHTML = '';
}

function startGame() {
  startScreen.style.display = 'none';

  amount = Number(slider.value);
  numbers = mixArray(createNumbersArray(amount));
  colors = mixArray(colors);
  createCards(numbers);

  gameScreen.style.display = 'block';
  gameEnded = false;
  runTimer(60);
}

startButton.addEventListener('click', startGame);