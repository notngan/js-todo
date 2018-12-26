const contentArr = [];
const input = document.querySelector('.new-input');
const btnActive = document.querySelector('.btn-active');
const btnAll = document.querySelector('.btn-all');
const btnComplete = document.querySelector('.btn-complete');

window.addEventListener('DOMContentLoaded', function () {

  displayStorage();

  input.addEventListener('keydown', addTodo);

  btnActive.addEventListener('click', showActive);

  btnComplete.addEventListener('click', showComplete);

  btnAll.addEventListener('click', showAll);
});

//FUNCTIONS
function showActive() {
  const activeItems = document.querySelectorAll('.hide');
  const completeItems = document.querySelectorAll('.complete');
  addClass(completeItems, 'display-none');
  removeClass(activeItems, 'display-none');
  addButtonClass(this);
}

function  showComplete() {
  const completeItems = document.querySelectorAll('.complete');
  const activeItems = document.querySelectorAll('.hide');
  addClass(activeItems, 'display-none');
  removeClass(completeItems, 'display-none');
  addButtonClass(this);
}

function showAll() {
  const itemList = document.querySelectorAll('li');
    Array.from(itemList).forEach(item => {
      item.classList.remove('display-none');
    });
  addButtonClass(this);
}

function addTodo(e) {

  //return if not key Enter
  if (e.keyCode !== 13) return;

  const list = document.querySelector('.todo-list');
  const item = document.createElement('li');

  if (input.value !== '') {
    item.innerHTML =
    `<span class="complete-btn"><span class="complete-icon hide">&#10003;</span></span>
    <span class="content" contentEditable="false">${input.value}</span>
    <span class="delete-btn">\u00D7</span>`;

    list.appendChild(item);

    contentArr.push({
      text: input.value,
      isCompleted: false
    });

    localStorage.clear();
    localStorage.setItem('list', JSON.stringify(contentArr));

    // reset input
    input.value = '';
    showBottom();
    countUncomplete();

    // edit
    item.querySelector('.content').addEventListener('dblclick', editTodo);

    item.querySelector('.complete-btn').addEventListener('click', completeTodo);

    item.querySelector('.delete-btn').addEventListener('click', deleteTodo);
  }
}

function displayStorage() {
  const list = document.querySelector('.todo-list');
  const store = JSON.parse(localStorage.getItem('list')) || [];
  contentArr.push(...store);

  if (!store || store.length < 1) return;

  for (let i = 0; i < store.length; i++) {
    let li = document.createElement('li');

    li.innerHTML = `<span class="complete-btn"><span class="complete-icon hide">&#10003;</span></span>
    <span class="content" contentEditable="false">${store[i].text}</span>
    <span class="delete-btn">\u00D7</span>`

    // add completed style
    if (store[i].isCompleted) {
      li.querySelector('.complete-icon').classList.remove('hide');
      li.querySelector('.complete-icon').classList.add('complete');
      li.querySelector('.content').style.color = '#aaa';
      li.querySelector('.content').style.textDecoration = 'line-through';
    }

    li.querySelector('.complete-btn').addEventListener('click', completeTodo);
    li.querySelector('.delete-btn').addEventListener('click', deleteTodo);
    li.querySelector('.content').addEventListener('dblclick', editTodo);

    list.appendChild(li);

    showBottom()
    countUncomplete();
  }
}

function deleteTodo() {
  const todoItems = document.querySelectorAll('li');
  const li = this.parentElement;
  li.parentElement.removeChild(li);

  for (let key in contentArr) {
    contentArr.splice(key, 1);
    localStorage.clear();
    localStorage.setItem('list', JSON.stringify(contentArr));
    break;
  }

  countUncomplete();

  if (todoItems.length < 2) {
    hideBottom();
  }
}

function editTodo() {
  this.contentEditable = true;
  console.log(this);
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
  const liText = li.querySelector('.content');
  const completeIcon = this.querySelector('.complete-icon');
  const index = Array.prototype.indexOf.call(li.parentElement.childNodes, li)

  if (completeIcon.classList.contains('hide')) {
    liText.style.textDecoration = 'line-through';
    liText.style.color = '#aaa';
    completeIcon.classList.remove('hide');
    completeIcon.classList.add('complete');

    // Click uncomplete at completed tab
    if (btnActive.classList.contains('active')) {
      li.classList.add('display-none');
    }

    countUncomplete();

    for (let key in contentArr) {
      if (index == key) {
        contentArr.splice(key, 1);
        contentArr.splice(key, 0, {
          text: liText.textContent,
          isCompleted: true
        });
        localStorage.clear();
        localStorage.setItem('list', JSON.stringify(contentArr));
        break;
      }
    }
  } else {
    liText.style.textDecoration = 'none';
    liText.style.color = '#333';
    completeIcon.classList.remove('complete');
    completeIcon.classList.add('hide');

    // Click complete at active tab
    if (btnComplete.classList.contains('active')) {
      li.classList.add('display-none');
    }

    countUncomplete();

    for (let key in contentArr) {
      if (index == key) {
        contentArr.splice(key, 1);
        contentArr.splice(key, 0, {
          text: liText.textContent,
          isCompleted: false
        });
        localStorage.clear();
        localStorage.setItem('list', JSON.stringify(contentArr));
        break;
      }
    }
  }
}

function addClass(arr, className) {
  Array.from(arr).forEach(item => {
    item.parentElement.parentElement.classList.add(className);
  });
}

function removeClass(arr, className) {
  Array.from(arr).forEach(item => {
    item.parentElement.parentElement.classList.remove(className);
  });
}

function addButtonClass(element) {
  const btns = document.querySelectorAll('.btn');
  Array.from(btns).forEach(item => {
    item.classList.remove('active');
  });
  element.classList.add('active');
}

function countUncomplete() {
  const countDisplay = document.querySelector('#item-count');
  const completeClass = document.querySelectorAll('.hide');
  countDisplay.innerHTML = completeClass.length;
}

function showBottom() {
  const bottom = document.querySelector('.bottom-wrap');
  bottom.style.display = 'flex';
}

function hideBottom() {
  const bottom = document.querySelector('.bottom-wrap');
  bottom.style.display = 'none';
}
