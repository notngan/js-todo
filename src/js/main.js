window.addEventListener('DOMContentLoaded', function () {
  const input = document.querySelector('#new-input');
  const list = document.querySelector('#todo-list');
  let itemList = document.getElementsByTagName('li');
  const bottom = document.querySelector('.bottom-wrap');
  const countDisplay = document.querySelector('#item-count');

  let deleteBtns = document.getElementsByClassName('delete-btn');
  let completeBtns = document.getElementsByClassName('complete-btn');

  let count = 0;
  let completedItems = document.getElementsByClassName('hide');

  // ADD TODOS
  input.addEventListener('keyup', function (e) {
    if (e.keyCode == 13) {
      let item = document.createElement('li');
      if (input.value !== '') {
        item.innerHTML = `<span class="complete-btn"><span class="complete-icon hide">&#10003;</span></span> <span>${input.value}</span><span class="delete-btn">\u00D7</span>`;
        list.appendChild(item);

        input.value = '';
        count += 1;
        countDisplay.innerHTML = count;

        bottom.style.display = 'flex';

        // DELETE TODOS
        for (let i = 0; i < deleteBtns.length; i++) {
          deleteBtns[i].onclick = function() {
            let li = this.parentElement;
            li.parentElement.removeChild(li);

            if (count > 0) {
              count -= 1;
              countDisplay.innerHTML = count;
            } else {
              countDisplay.innerHTML = 0;
            }

            if (itemList.length < 1) {
              bottom.style.display = 'none';
            }
          }
        }

        // COMPLETE TODOS
        for (let i = 0; i < completeBtns.length; i++) {
          completeBtns[i].onclick = function () {
            let li = this.parentElement;
            let liText = li.getElementsByTagName('span')[2];
            let completeIcon = this.firstChild;

            if (completeIcon.classList.contains('hide') == true) {
              liText.style.textDecoration = 'line-through';
              completeIcon.classList.remove('hide');

              if (count < 0) {
                countDisplay.innerHTML = 0;
              } else {
                count -= 1;
                countDisplay.innerHTML = count;
              }
            } else {
              liText.style.textDecoration = 'none';
              completeIcon.classList.add('hide');
              count += 1;
              countDisplay.innerHTML = count;
            }
          }
        }
      }
    }
  })
});
