import { fail } from "assert";

const contentArr = [];
const input = document.querySelector('.new-input');
const btnActive = document.querySelector('.btn-active');
const btnAll = document.querySelector('.btn-all');
const btnComplete = document.querySelector('.btn-complete');
const bottom = document.querySelector('.bottom-wrap');

window.addEventListener('DOMContentLoaded', function () {
  displayStorage();

  input.addEventListener('keydown', addTodo);

  btnActive.addEventListener('click', showActive);

  btnComplete.addEventListener('click', showComplete);

  btnAll.addEventListener('click', showAll);
});

//FUNCTIONS


function addTodo(e) {
  //return if not key Enter
  if (e.keyCode !== 13) return;

  const ul = document.querySelector('.todo-list');
  const li = document.createElement('li');

  if (input.value !== '') {
    li.innerHTML =
    `<span class="complete-btn"><span class="complete-icon">&#10003;</span></span>
    <span class="content" contentEditable="false">${input.value}</span>
    <span class="delete-btn">\u00D7</span>`;

    if (btnComplete.classList.contains('active')) {
      li.classList.add('display-none');
    }

    ul.appendChild(li);

    // save to storage
    contentArr.push({
      text: input.value,
      isCompleted: false
    });

    localStorage.clear();
    localStorage.setItem('list', JSON.stringify(contentArr));

    // reset input
    input.value = '';
    showBottom();
    countActive();

    li.querySelector('.content').addEventListener('dblclick', editTodo);
    li.querySelector('.complete-btn').addEventListener('click', completeTodo);
    li.querySelector('.delete-btn').addEventListener('click', deleteTodo);
  }
}

function displayStorage() {
  const ul = document.querySelector('.todo-list');
  const store = JSON.parse(localStorage.getItem('list')) || [];
  contentArr.push(...store);

  if (!store || store.length < 1) return;

  for (let i = 0; i < store.length; i++) {
    let li = document.createElement('li');

    li.innerHTML = `<span class="complete-btn"><span class="complete-icon">&#10003;</span></span>
    <span class="content" contentEditable="false">${store[i].text}</span>
    <span class="delete-btn">\u00D7</span>`

    // add completed style
    if (store[i].isCompleted) {
      li.classList.add('complete');
    }

    li.querySelector('.complete-btn').addEventListener('click', completeTodo);
    li.querySelector('.delete-btn').addEventListener('click', deleteTodo);
    li.querySelector('.content').addEventListener('dblclick', editTodo);

    ul.appendChild(li);

    showBottom()
    countActive();
  }
}

function deleteTodo() {
  const todoItems = document.querySelectorAll('li');
  const li = this.parentElement;
  const ul = this.parentElement.parentElement

  for (let key in contentArr) {
    contentArr.splice(key, 1);
    localStorage.clear();
    localStorage.setItem('list', JSON.stringify(contentArr));
    break;
  }

  ul.removeChild(li);

  countActive();

  if (todoItems.length < 2) {
    hideBottom();
  }
}

function editTodo() {
  this.contentEditable = true;
  this.addEventListener('input', function () {
    const ul = this.parentElement.parentElement;
    const li = this.parentElement;
    const index = Array.prototype.indexOf.call(ul.childNodes, li)

    for (let key in contentArr) {
      if (key == index) {
        contentArr[key].text = this.textContent;
        localStorage.clear();
        localStorage.setItem('list', JSON.stringify(contentArr));
        break;
      }
    }
  });
}

function completeTodo() {
  const li = this.parentElement;
  const index = Array.prototype.indexOf.call(li.parentElement.childNodes, li)

  // item is completed
  if (li.classList.contains('complete')) {
    li.classList.remove('complete');
    if (btnComplete.classList.contains('active')) {
      li.classList.add('display-none');
    }

    countActive();

    for (let key in contentArr) {
      if (index == key) {
        contentArr[key].isCompleted = false;
        localStorage.clear();
        localStorage.setItem('list', JSON.stringify(contentArr));
        break;
      }
    }

  } else { // item is active
    li.classList.add('complete');
    if (btnActive.classList.contains('active')) {
      li.classList.add('display-none');
    }

    countActive();

    for (let key in contentArr) {
      if (index == key) {
        contentArr[key].isCompleted = true;
        localStorage.clear();
        localStorage.setItem('list', JSON.stringify(contentArr));
        break;
      }
    }
  }
}

function countActive() {
  const actives = document.querySelectorAll('li:not(.complete');
  const countDisplay = document.querySelector('.item-count');
  countDisplay.innerHTML = actives.length;
}

function showActive() {
  const activeItems = document.querySelectorAll('li:not(.complete)');
  const completeItems = document.querySelectorAll('.complete');

  Array.from(activeItems).forEach(item => {
    item.classList.remove('display-none');
  });

  Array.from(completeItems).forEach(item => {
    item.classList.add('display-none');
  });
  addButtonStyle(this);
}

function showComplete() {
  const activeItems = document.querySelectorAll('li:not(.complete)');
  const completeItems = document.querySelectorAll('.complete');

  Array.from(completeItems).forEach(item => {
    item.classList.remove('display-none');
  });

  Array.from(activeItems).forEach(item => {
    item.classList.add('display-none');
  });
  addButtonStyle(this);
}

function showAll() {
  const allItems = document.querySelectorAll('li');
  Array.from(allItems).forEach(item => {
    item.classList.remove('display-none');
  });
  addButtonStyle(this);
}

function addButtonStyle(element) {
  const btns = document.querySelectorAll('.btn');
  Array.from(btns).forEach(item => {
    item.classList.remove('active');
  });
  element.classList.add('active');
}

function showBottom() {
  bottom.style.display = 'flex';
}

function hideBottom() {
  bottom.style.display = 'none';
}
