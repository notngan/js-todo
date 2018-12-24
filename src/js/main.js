window.addEventListener('DOMContentLoaded', function () {
  let input = document.querySelector('#new-input');
  let list = document.querySelector('#todo-list');

  const deleteBtns = document.getElementsByClassName('delete-btn');

  input.addEventListener('keyup', function (e) {
    if (e.keyCode == 13) {
      let listItem = document.createElement('li');
      if (input.value !== '') {
        const inputText = document.createTextNode(input.value);
        listItem.appendChild(inputText);
        list.appendChild(listItem);
        input.value = '';

        const span = document.createElement('span');
        const spanText = document.createTextNode("\u00D7");
        span.appendChild(spanText);
        span.classList.add('delete-btn');
        listItem.appendChild(span);

        for (let i = 0; i < deleteBtns.length; i++) {
          deleteBtns[i].onclick = function() {
            var li = this.parentElement;
            li.style.display = "none";
          }
        }
      }
    }
  })

  function deleteItem() {
    console.log('delete');
  }
});
