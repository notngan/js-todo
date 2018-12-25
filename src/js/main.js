import { parse } from "path";

window.addEventListener('DOMContentLoaded', function () {
  const input = document.querySelector('#new-input');
  const list = document.querySelector('#todo-list');
  let itemList = document.getElementsByTagName('li');
  const bottom = document.querySelector('.bottom-wrap');
  const countDisplay = document.querySelector('#item-count');

  let deleteBtns = document.getElementsByClassName('delete-btn');
  let completeBtns = document.getElementsByClassName('complete-btn');
  let contents = document.getElementsByClassName('content');

  let btnAll = document.querySelector('#btn-all');
  let btnActive = document.querySelector('#btn-active');
  let btnComplete = document.querySelector('#btn-complete');
  let btns = document.getElementsByClassName('btn');

  let count = 0;
  let activeItems = document.getElementsByClassName('hide');
  let completeItems = document.getElementsByClassName('complete');

  // displayStorage();
  // function displayStorage() {
  //   const storage = JSON.parse(localStorage.getItem('list'));
  //   console.log(storage);
  //   Array.from(storage).forEach(item => {
  //     let li = document.createElement('li');
  //     li.innerHTML = `<span class="complete-btn"><span class="complete-icon hide">&#10003;</span></span>
  //     <span class="content" contentEditable="false">${item}</span>
  //     <span class="delete-btn">\u00D7</span>`
  //     list.appendChild(li);
  //   });
  // }

  function deleteTodo() {
    let li = this.parentElement;
    li.parentElement.removeChild(li);

    if (li.querySelector('.complete-icon').classList.contains('complete') == true) {
      return;
    } else {
      if (count > 0 ) {
        count -= 1;
        countDisplay.innerHTML = count;
      } else {
        countDisplay.innerHTML = 0;
      }
    }
    if (itemList.length < 1) {
      bottom.style.display = 'none';
    }
  }

  function completeTodo() {
    let li = this.parentElement;
    console.log(li);
    let liText = li.getElementsByTagName('span')[2];
    let completeIcon = this.getElementsByClassName('complete-icon')[0];

    if (completeIcon.classList.contains('hide') == true) {
      liText.style.textDecoration = 'line-through';
      liText.style.color = '#aaa';
      completeIcon.classList.remove('hide');
      completeIcon.classList.add('complete');

      if (btnActive.classList.contains('active') == true) {
        li.classList.add('display-none');
      }

      if (count < 0) {
        countDisplay.innerHTML = 0;
      } else {
        count -= 1;
        countDisplay.innerHTML = count;
      }


    } else {
      liText.style.textDecoration = 'none';
      liText.style.color = '#333';
      completeIcon.classList.remove('complete');
      completeIcon.classList.add('hide');
      count += 1;
      countDisplay.innerHTML = count;

      if (btnComplete.classList.contains('active') == true) {
        li.classList.add('display-none');
      }
    }
  }

  function addClass(ar, cl) {
    Array.from(ar).forEach(item => {
      item.parentElement.parentElement.classList.add(cl);
    });
  }

  function removeClass(ar, cl) {
    Array.from(ar).forEach(item => {
      item.parentElement.parentElement.classList.remove(cl);
    });
  }

  function addButtonClass(sthg) {
    Array.from(btns).forEach(item => {
      item.classList.remove('active');
    });
    sthg.classList.add('active');
  }

  // ADD
  input.addEventListener('keydown', function (e) {
    if (e.keyCode !== 13) return;

    let item = document.createElement('li');

    if (input.value !== '') {
      item.innerHTML =
      `<span class="complete-btn"><span class="complete-icon hide">&#10003;</span></span>
      <span class="content" contentEditable="false">${input.value}</span>
      <span class="delete-btn">\u00D7</span>`;

      list.appendChild(item);

      input.value = '';
      count += 1;
      countDisplay.innerHTML = count;
      bottom.style.display = 'flex';

      let contentArr = [];

      // EDIT
      Array.from(contents).forEach(item => {
        item.addEventListener('dblclick', function() {
          this.contentEditable = true;
        });
        contentArr.push(item.textContent);
        if (typeof(Storage) !== undefined) {
          localStorage.setItem('list', JSON.stringify(contentArr));
        }
      });

      // DELETE
      Array.from(deleteBtns).forEach(item => {
        item.addEventListener('click', deleteTodo);
      });

      // COMPLETE
      Array.from(completeBtns).forEach(item => {
        item.addEventListener('click', completeTodo);

      });
    }
  });

  // SHOW ACTIVE
  btnActive.addEventListener('click', function () {
    addClass(completeItems, 'display-none');
    removeClass(activeItems, 'display-none');
    addButtonClass(this);
  });

  // SHOW COMPLETED
  btnComplete.addEventListener('click', function () {
    addClass(activeItems, 'display-none');
    removeClass(completeItems, 'display-none');
    addButtonClass(this);
  });

  // SHOW ALL
  btnAll.addEventListener('click', function () {
    Array.from(itemList).forEach(item => {
      item.classList.remove('display-none');
    });
    addButtonClass(this);
  });

});
