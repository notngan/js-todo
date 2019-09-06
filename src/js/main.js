const contentArr = [];
const input = document.querySelector('.new-input');
const btnActive = document.querySelector('.btn-active');
const btnAll = document.querySelector('.btn-all');
const btnComplete = document.querySelector('.btn-complete');
const bottom = document.querySelector('.bottom-wrap');
const list = document.querySelector('.todo-list');
const btnCompleteAll = document.querySelector('.complete-all');

let item =
  `<div class="todo-item %complete% %hide%">
  <input class="complete-btn" type="checkbox" %check%></input>
  <input type="text" class="content" value="%value%" disabled></input>
  <span class="delete-btn">\u00D7</span>
  </div>`;

window.addEventListener('DOMContentLoaded', function () {

  displayStorage();

  input.addEventListener('keydown', addTodo);

  btnActive.addEventListener('click', showActive);

  btnComplete.addEventListener('click', showComplete);

  btnAll.addEventListener('click', showAll);

  btnCompleteAll.addEventListener('click', completeAll);

});

//FUNCTIONS
function addTodo(e) {
  //return if not key Enter
  if (e.keyCode !== 13) return;

  if (input.value !== '') {
    item = item.replace(/%value%/, input.value);

    document.addEventListener('click', function (e) {
      if (hasClass(e.target, 'complete-btn')) {
        completeTodo(e.target);
      } else if (hasClass(e.target, 'delete-btn')) {
        deleteTodo(e.target);
      }
    });

    document.addEventListener('dblclick', function (e) {
      if (hasClass(e.target, 'content')) {
        editTodo(e.target);
      }
    });

    if (btnComplete.classList.contains('active')) {
      item = item.replace(/%hide%/, 'hide');
    }

    list.insertAdjacentHTML('beforeend', item);

    countActive();

    // save to storage
    contentArr.push({
      text: input.value,
      isCompleted: false
    });
    resetStorage();

    // reset input
    input.value = '';

    //show bottom
    bottom.classList.remove('hide');

    resetString();
  }
}

function displayStorage() {
  const store = JSON.parse(localStorage.getItem('list')) || [];

  contentArr.push(...store);

  if (!store || store.length < 1) return;

  for (let i = 0; i < store.length; i++) {
    item = item.replace(/%value%/, store[i].text);

    // add completed style
    document.addEventListener('click', function (e) {
      if (hasClass(e.target, 'complete-btn')) {
        completeTodo(e.target);
      } else if (hasClass(e.target, 'delete-btn')) {
        deleteTodo(e.target);
      }
    });

    document.addEventListener('dblclick', function (e) {
      if (hasClass(e.target, 'content')) {
        editTodo(e.target);
      }
    });

    if (store[i].isCompleted) {
      item = item.replace(/%check%/, 'checked');
      item = item.replace(/%complete%/, 'complete');
    }

    list.insertAdjacentHTML('beforeend', item);

    bottom.classList.remove('hide');

    countActive();
    resetString();
  }
}

function deleteTodo(deleteBtn) {
  const todoItems = document.querySelectorAll('.todo-item');
  const item = deleteBtn.parentElement;
  const list = item.parentElement;

  if (!list || !item) return;

  const index = Array.prototype.indexOf.call(list.childNodes, item);

  for (let key in contentArr) {
    if (index == key) {
      contentArr.splice(key, 1);
      resetStorage();
      break;
    }
  }

  list.removeChild(item);

  countActive();

  if (todoItems.length < 2) {
    bottom.classList.add('hide');
  }
}

function editTodo(content) {
  const todoItems = document.querySelectorAll('.todo-item');

  content.disabled = false;

  content.addEventListener('keydown', function (e) {
    if (e.keyCode !== 13) return;

    const item = content.parentElement;
    const list = item.parentElement;

    if (list == null || item == null) return;

    const index = Array.prototype.indexOf.call(list.childNodes, item);

    // if content empty
    if (content.value == '') {
      for (let key in contentArr) {
        if (index == key) {
          contentArr.splice(key, 1);
          resetStorage();
          break;
        }
      }
      list.removeChild(item);

      countActive();

      if (todoItems.length < 2) {
        bottom.classList.add('hide');
      }
      return;
    };

    for (let key in contentArr) {
      if (key == index) {
        contentArr[key].text = this.value;
        resetStorage();
        break;
      }
    }
  });
}

function completeTodo(checkbox) {
  const item = checkbox.parentElement;
  const index = Array.prototype.indexOf.call(list.childNodes, item);

  // item is completed
  if (checkbox.checked) {
    item.classList.add('complete');

    if (btnActive.classList.contains('active')) {
      item.classList.add('hide');
    }

    countActive();

    for (let key in contentArr) {
      if (index == key) {
        contentArr[key].isCompleted = true;
        resetStorage();
        break;
      }
    }

  } else { // item is active
    item.classList.remove('complete');

    if (btnComplete.classList.contains('active')) {
      item.classList.add('hide');
    }

    countActive();

    for (let key in contentArr) {
      if (index == key) {
        contentArr[key].isCompleted = false;
        resetStorage();
        break;
      }
    }
  }
}

function completeAll() {
  const allItems = document.querySelectorAll('.todo-item');
  let completed = 0;

  Array.from(allItems).forEach(item => {
    const index = Array.prototype.indexOf.call(list.childNodes, item);

    if (item.classList.contains('complete')) {
      completed++;
    } else { // item is uncompleted
      item.classList.add('complete');
      item.querySelector('.complete-btn').checked = true;
      countActive();

      if (btnActive.classList.contains('active')) {
        item.classList.add('hide');
      }

      if (btnComplete.classList.contains('active')) {
        item.classList.remove('hide');
      }

      for (let key in contentArr) {
        if (index == key) {
          contentArr[key].isCompleted = true;
          resetStorage();
          break;
        }
      }
    }

    if (completed === allItems.length) { // all items are completed
      Array.from(allItems).forEach(el => {
        el.classList.remove('complete');
        el.querySelector('.complete-btn').checked = false;
        const index = Array.prototype.indexOf.call(list.childNodes, el);

        countActive();

        if (btnComplete.classList.contains('active')) {
          el.classList.add('hide');
        }

        if (btnActive.classList.contains('active')) {
          el.classList.remove('hide');
        }

        // save to storage
        for (let key in contentArr) {
          if (index == key) {
            contentArr[key].isCompleted = false;
            resetStorage();
            break;
          }
        }
      });
    }
  });

}

function showActive() {
  const allItems =  document.querySelectorAll('.todo-item');
  console.log('active');
  Array.from(allItems).forEach(item => {
    if (!item.classList.contains('complete')) {
      item.classList.remove('hide');
    } else {
      item.classList.add('hide');
    }
  });
  addButtonStyle(this);
}

function showComplete() {
  //const activeItems = document.querySelectorAll('.todo-item:not(.complete)');
  //const completeItems = document.querySelectorAll('.complete');
  const allItems =  document.querySelectorAll('.todo-item');

  Array.from(allItems).forEach(item => {
    if (item.classList.contains('complete')) {
      item.classList.remove('hide');
    } else {
      item.classList.add('hide');
    }
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

function countActive() {
  const actives = document.querySelectorAll('.todo-item:not(.complete');
  const countDisplay = document.querySelector('.item-count');
  countDisplay.innerHTML = actives.length || 0;
}

function resetStorage() {
  localStorage.clear();
  localStorage.setItem('list', JSON.stringify(contentArr));
}

function resetString() {
  item =
  `<div class="todo-item %complete% %hide%">
  <input class="complete-btn" type="checkbox" %check%></input>
  <input type="text" class="content" value="%value%" disabled></input>
  <span class="delete-btn">\u00D7</span>
  </div>`;
}

function hasClass(element, className) {
  return element.className.split(' ').indexOf(className) > -1;
}
