var todoAppForm = document.querySelector('#todo-app');
var todoBody = document.querySelector('#display');

todoBody.addEventListener('click', onListClickHandler, false);
todoAppForm.addEventListener('submit', onSubmitHandler, false);

var helpers = {
  negate: function(func) {
    return function() {
      return !func.apply(this, [].slice.call(arguments));
    }
  },
  isNodeType: function(element, elementTypes) {
    var foundElementType = ~elementTypes.indexOf(element.nodeName.toLowerCase());
    return foundElementType ? element : null;
  }
};

var todo = {
  list: [],
  currentId: null,
  isEqualToCurrentId: function(item) {
    return item.id == Number(this.currentId);
  },
  getAllExcept: function(todoId) {
    this.currentId = todoId;
    var allExcept = helpers.negate(this.isEqualToCurrentId.bind(this));
    return this.list.filter(allExcept);
  },
  getItem: function(todoId) {
    this.currentId = todoId;
    return this.list.filter(this.isEqualToCurrentId.bind(this));
  },
  addItem: function(todo) {
    if (todo.message.trim() == '' || typeof todo.message !== 'string') return;
    this.list.push(todo);
    renderList(this.list);
  },
  updateItem: function updateTodoItem(todoId) {
    var todoItem = this.getItem(todoId)[0];
    todoItem.completed = todoItem.completed ? false : true;
    renderList(this.list);
  },
  removeItem: function(todoId) {
    this.list = this.getAllExcept(todoId);
    renderList(this.list);
  }
};

function onSubmitHandler(event) {
  event.preventDefault();
  var inputElement = event.target['todo-input'];

  todo.addItem({
    message: inputElement.value,
    completed: false,
    id: new Date().getTime()
  });

  // clear input
  inputElement.value = '';
}

function onListClickHandler(event) {
  var removeButton = helpers.isNodeType(event.target, ['button']);
  var checkbox = helpers.isNodeType(event.target, ['input']);
  if (removeButton) {
    var todoId = removeButton.getAttribute('data-id');
    todo.removeItem(todoId);
  }
  if (checkbox) {
    var todoId = checkbox.getAttribute('data-id');
    todo.updateItem(todoId);
  }
}

// render
function renderList(todoList) {
  var listContainer = document.createElement('ul');
  todoBody.innerHTML = '';

  todoList.forEach(function renderItem(todoItem) {
    var className = todoItem.completed ? 'completed' : '';

    var toggleBox = document.createElement('input');
    toggleBox.setAttribute('type', 'checkbox');
    toggleBox.setAttribute('data-id', todoItem.id);
    toggleBox.setAttribute('name', 'todo-completed');
    todoItem.completed && toggleBox.setAttribute('checked', true);

    var removeButton = document.createElement('button');
    removeButton.setAttribute('data-id', todoItem.id);
    removeButton.innerHTML = 'remove';

    var todoListItem = document.createElement('li');
    todoListItem.setAttribute('data-id', todoItem.id);
    todoListItem.className = className;
    todoListItem.appendChild(toggleBox);

    var message = document.createElement('span');
    message.innerHTML = ' ' + todoItem.message + ' ';
    todoListItem.appendChild(message);
    todoListItem.appendChild(removeButton);
    listContainer.appendChild(todoListItem);
  });

  todoBody.appendChild(listContainer);
}
