const items = document.querySelectorAll('.item');
const title = document.getElementById('section-title');

items.forEach(item => {
  item.addEventListener('click', (event) => {
    if (!item.classList.contains('selected')) {
      event.preventDefault();
      items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      title.textContent = item.textContent.trim();
    }
  });
});
