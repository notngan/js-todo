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

  const list = document.querySelector('.todo-list');
  const item = document.createElement('div');
  item.classList.add('todo-item');

  if (input.value !== '') {
    item.innerHTML =
    `<input class="complete-btn" type="checkbox"></input>
    <input class="content" disabled></input>
    <span class="delete-btn">\u00D7</span>`

    item.querySelector('.content').value = input.value;

    if (btnComplete.classList.contains('active')) {
      item.classList.add('hide');
    }

    // save to storage
    contentArr.push({
      text: input.value,
      isCompleted: false
    });

    localStorage.clear();
    localStorage.setItem('list', JSON.stringify(contentArr));

    list.appendChild(item);

    // reset input
    input.value = '';
    bottom.classList.remove('hide');
    countActive();

    //console.log(item.querySelector('.content'));
    item.addEventListener('dblclick', editTodo);
    item.querySelector('.complete-btn').addEventListener('change', completeTodo);
    item.querySelector('.delete-btn').addEventListener('click', deleteTodo);
  }
}

function displayStorage() {
  const list = document.querySelector('.todo-list');
  const store = JSON.parse(localStorage.getItem('list')) || [];
  contentArr.push(...store);

  if (!store || store.length < 1) return;

  for (let i = 0; i < store.length; i++) {
    const item = document.createElement('div');
    item.classList.add('todo-item');

    item.innerHTML =
      `<input class="complete-btn" type="checkbox"></input>
      <input class="content" disabled></input>
      <span class="delete-btn">\u00D7</span>`

    item.querySelector('.content').value = store[i].text;
    // console.log(store[i]);
    // add completed style
    if (store[i].isCompleted) {
      item.classList.add('complete');
      item.querySelector('.complete-btn').checked = true;
    }

    list.appendChild(item);
    item.querySelector('.complete-btn').addEventListener('click', completeTodo);
    item.querySelector('.delete-btn').addEventListener('click', deleteTodo);
    item.addEventListener('dblclick', editTodo);

    bottom.classList.remove('hide');
    countActive();
  }
}

function deleteTodo() {
  const todoItems = document.querySelectorAll('.todo-item');
  const item = this.parentElement;
  const list = this.parentElement.parentElement

  const index = Array.prototype.indexOf.call(list.childNodes, item)

  for (let key in contentArr) {
    if (index == key) {
      contentArr.splice(key, 1);
      localStorage.clear();
      localStorage.setItem('list', JSON.stringify(contentArr));
      break;
    }
  }

  list.removeChild(item);

  countActive();

  if (todoItems.length < 2) {
    bottom.classList.add('hide');
  }
}

function editTodo() {
  const content = this.querySelector('.content');
  content.disabled = false;

  // console.log(this);
  content.addEventListener('input', function () {
    const list = this.parentElement.parentElement;
    const item = this.parentElement;
    const index = Array.prototype.indexOf.call(list.childNodes, item)

    for (let key in contentArr) {
      if (key == index) {
        contentArr[key].text = this.value;
        localStorage.clear();
        localStorage.setItem('list', JSON.stringify(contentArr));
        break;
      }
    }
  });
}

function completeTodo() {
  const item = this.parentElement;
  const list = this.parentElement.parentElement
  const index = Array.prototype.indexOf.call(list.childNodes, item)

  // item is completed
  if (!this.checked) {
    item.classList.remove('complete');
    if (btnComplete.classList.contains('active')) {
      item.classList.add('hide');
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
    item.classList.add('complete');
    if (btnActive.classList.contains('active')) {
      item.classList.add('hide');
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
  const actives = document.querySelectorAll('.todo-item:not(.complete');
  const countDisplay = document.querySelector('.item-count');
  countDisplay.innerHTML = actives.length;
}

function showActive() {
  const activeItems = document.querySelectorAll('.todo-item:not(.complete)');
  const completeItems = document.querySelectorAll('.complete');

  Array.from(activeItems).forEach(item => {
    item.classList.remove('hide');
  });

  Array.from(completeItems).forEach(item => {
    item.classList.add('hide');
  });
  addButtonStyle(this);
}

function showComplete() {
  const activeItems = document.querySelectorAll('.todo-item:not(.complete)');
  const completeItems = document.querySelectorAll('.complete');

  Array.from(completeItems).forEach(item => {
    item.classList.remove('hide');
  });

  Array.from(activeItems).forEach(item => {
    item.classList.add('hide');
  });
  addButtonStyle(this);
}

function showAll() {
  const allItems = document.querySelectorAll('.todo-item');
  Array.from(allItems).forEach(item => {
    item.classList.remove('hide');
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
