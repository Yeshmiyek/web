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
