const slider = document.getElementById('slider');

slider.oninput = function() {
  const label = document.getElementById('label');
  label.textContent = `${slider.value}`;
}

