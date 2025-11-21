function Popover() {
  const block = document.createElement('div');
  block.className = 'block';
  block.innerHTML = '<div id="popover-block"></div>';
  block.innerHTML += '<button class="toggle-btn" id="popover-btn">Click to toggle popover</button>';

  document.body.appendChild(block);

  const btn = document.getElementsByClassName('toggle-btn')[0];
  const popoverBlock = document.querySelector('#popover-block');

  btn.addEventListener('click', () => {
    if (btn.classList.contains('toggle-btn')) {
      const header = document.createElement('h3');
      const text = document.createElement('p');
      header.id = 'header';
      header.className = 'popover';
      header.title = 'Popover title';
      header.textContent = 'Popover title';

      text.id = 'text';
      text.className = 'popover';
      text.textContent = 'And here is some amazing content.It is very engaging.Right?';

      popoverBlock.insertAdjacentElement('afterbegin', text);
      popoverBlock.insertAdjacentElement('afterbegin', header);

      btn.classList.toggle('toggle-btn');

      popoverBlock.style.position = 'absolute';
      popoverBlock.style.left = '37%';
      popoverBlock.style.top = '19%';
    } else {
      const head = document.querySelector('#header');
      const paragraph = document.querySelector('#text');
      head.remove();
      paragraph.remove();

      btn.classList.toggle('toggle-btn');
    }
  });
}

Popover();
