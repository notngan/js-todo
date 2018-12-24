window.addEventListener('DOMContentLoaded', function () {
  const input = document.querySelector('#new-input');
  const list = document.querySelector('#todo-list');
  const bottom = document.querySelector('.bottom-wrap');
  const countDisplay = document.querySelector('#item-count');

  let deleteBtns = document.getElementsByClassName('delete-btn');
  let listItems = document.getElementsByTagName('li');
  let count = 0;

  input.addEventListener('keyup', function (e) {
    if (e.keyCode == 13) {
      const listItem = document.createElement('li');
      if (input.value !== '') {
        listItem.innerHTML = `${input.value}<span class="delete-btn">\u00D7</span>`;
        list.appendChild(listItem);
        count += 1;
        input.value = '';
        countDisplay.innerHTML = count;

        for (let i = 0; i < deleteBtns.length; i++) {
          deleteBtns[i].onclick = function() {
            var li = this.parentElement;
            li.style.display = 'none';
            count -= 1;
            countDisplay.innerHTML = count;

            if (count < 1) {
              bottom.style.display = 'none';
            }
          }
        }

        if (listItems.length > 0) {
          bottom.style.display = 'flex';
        }
      }
    }
  })
});
