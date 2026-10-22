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
const btnEnter = document.getElementById('btn-enter');
const btnBack = document.getElementById('btn-back');

btnEnter.addEventListener('click', () => {
  const selected = document.querySelector('.item.selected');
  if (selected && selected.getAttribute('href') !== '#') {
    window.location.href = selected.href;
  }
});

btnBack.addEventListener('click', () => {
  const backUrl = document.body.dataset.back;
  if (backUrl) {
    window.location.href = backUrl;
  } else {
    items.forEach(i => i.classList.remove('selected'));
  }
});