import { parse } from "path";
import { stringify } from "querystring";

window.addEventListener('DOMContentLoaded', function () {
  const input = document.querySelector('#new-input');
  const list = document.querySelector('#todo-list');
  const bottom = document.querySelector('.bottom-wrap');
  const countDisplay = document.querySelector('#item-count');
  const contents = document.querySelectorAll('.content');

  const btnAll = document.querySelector('#btn-all');
  const btnActive = document.querySelector('#btn-active');
  const btnComplete = document.querySelector('#btn-complete');
  const btns = document.querySelectorAll('.btn');
  const store = JSON.parse(localStorage.getItem('list'));
  const contentArr = [];
  contentArr.push(...store);

  console.log(contentArr);

  displayStorage();
  function displayStorage() {
    if (!store || store.length < 1) return;

    for (let i = 0; i < store.length; i++) {
      let li = document.createElement('li');
      li.innerHTML = `<span class="complete-btn"><span class="complete-icon hide">&#10003;</span></span>
      <span class="content" contentEditable="false">${store[i]}</span>
      <span class="delete-btn">\u00D7</span>`
      list.appendChild(li);
      li.querySelector('.complete-btn').addEventListener('click', completeTodo);
      li.querySelector('.delete-btn').addEventListener('click', deleteTodo);

      showBottom()
      countUncomplete();
    }
  }

  function deleteTodo() {
    const items = document.querySelectorAll('li');
    const li = this.parentElement;
    li.parentElement.removeChild(li);

    const index = contentArr.indexOf(li.querySelector('.content').textContent);
    contentArr.splice(index, 1);

    //console.log(contentArr);

    localStorage.clear();
    localStorage.setItem('list', JSON.stringify(contentArr));
    countUncomplete();

    if (items.length < 2) {
      hideBottom();
    }
  }

  function completeTodo() {
    const li = this.parentElement;
    const liText = li.querySelector('.content');
    const completeIcon = this.querySelector('.complete-icon');

    if (completeIcon.classList.contains('hide')) {
      liText.style.textDecoration = 'line-through';
      liText.style.color = '#aaa';
      completeIcon.classList.remove('hide');
      completeIcon.classList.add('complete');

      if (btnActive.classList.contains('active')) {
        li.classList.add('display-none');
      }
      countUncomplete();

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

  function countUncomplete() {
    const completeClass = document.querySelectorAll('.hide');
    countDisplay.innerHTML = completeClass.length;
  }

  function showBottom() {
    bottom.style.display = 'flex';
  }

  function hideBottom(s) {
    bottom.style.display = 'none';
  }
  // ADD
  input.addEventListener('keydown', function (e) {
    if (e.keyCode !== 13) return;
    const item = document.createElement('li');
    if (input.value !== '') {
      item.innerHTML =
      `<span class="complete-btn"><span class="complete-icon hide">&#10003;</span></span>
      <span class="content" contentEditable="false">${input.value}</span>
      <span class="delete-btn">\u00D7</span>`;

      list.appendChild(item);
      contentArr.push(input.value);
      console.log(contentArr);
      localStorage.clear();
      localStorage.setItem('list', JSON.stringify(contentArr));
      //RESET INPUT
      input.value = '';

      showBottom();
      countUncomplete();

      // EDIT
      Array.from(contents).forEach(item => {
        item.addEventListener('dblclick', function() {
          this.contentEditable = true;
        });
      });

      // DELETE
      const deleteBtns = document.querySelectorAll('.delete-btn');
      Array.from(deleteBtns).forEach(item => {
        item.addEventListener('click', deleteTodo);
      });

      // COMPLETE
      const completeBtns =  document.querySelectorAll('.complete-btn');
      Array.from(completeBtns).forEach(item => {
        item.addEventListener('click', completeTodo);
      });
    }
  });

  // SHOW ACTIVE
  btnActive.addEventListener('click', function () {
    const activeItems = document.querySelectorAll('.hide');
    const completeItems = document.querySelectorAll('.complete');
    addClass(completeItems, 'display-none');
    removeClass(activeItems, 'display-none');
    addButtonClass(this);
  });
  // SHOW COMPLETED
  btnComplete.addEventListener('click', function () {
    const completeItems = document.querySelectorAll('.complete');
    const activeItems = document.querySelectorAll('.hide');
    addClass(activeItems, 'display-none');
    removeClass(completeItems, 'display-none');
    addButtonClass(this);
  });
  // SHOW ALL
  btnAll.addEventListener('click', function () {
    const itemList = document.querySelectorAll('li');
    Array.from(itemList).forEach(item => {
      item.classList.remove('display-none');
    });
    addButtonClass(this);
  });
});
