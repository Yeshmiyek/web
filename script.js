const items = document.querySelectorAll('.item');

items.forEach(item => {
  item.addEventListener('click', (event) => {
    if (!item.classList.contains('selected')) {
      event.preventDefault();
      items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
    }
  });
});

const noise = document.getElementById('boil-noise');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (noise && !reduceMotion) {
  let seed = 1;
  setInterval(() => {
    seed = (seed % 4) + 1;
    noise.setAttribute('seed', seed);
  }, 110);
  <script src="player.js"></script>
}
