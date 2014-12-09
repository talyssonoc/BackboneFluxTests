$(function() {

    var TodoAppReflux = {};

    TodoAppReflux.actions = Utils.getRefluxActions();

    TodoAppReflux.store = Reflux.createStore({
        init: function init() {

            this.todos = [];
            this.currentId = 0;

            this.listenTo(TodoAppReflux.actions.create, this.createTodo);
            this.listenTo(TodoAppReflux.actions.toggle, this.toggleTodo);
            this.listenTo(TodoAppReflux.actions.remove, this.removeTodo);
        },

        createTodo: function createTodo(text) {
            var id = this.currentId++;

            this.todos.push({
                id: id,
                complete: false,
                text: text
            });

            this.trigger(this.todos);
        },

        toggleTodo: function toggleTodo(todo) {
            todo.complete = !todo.complete;

            this.trigger(this.todos);
        },

        removeTodo: function removeTodo(id) {
            this.todos.splice(id, 1);

            this.trigger(this.todos);
        }

    });

    TodoAppReflux.appElement = $('#reflux_app')

    TodoAppReflux.store.listen(function(todoList) {


        // Remove all listeners
        TodoAppReflux.appElement.find('.todos > li').off('click');
        TodoAppReflux.appElement.find('todos > li').off('dblclick');

        var todosElement = TodoAppReflux.appElement.find('.todos');

        todosElement.empty();

        for(var t in todoList) {
            
            (function() {

            var todo,
                todoName,
                todoCheckbox,
                currentTodo = todoList[t];

                todoName = $('<span>' + todoList[t].text + '</span>');
                todoCheckbox = $('<input type="checkbox" ' + (currentTodo.complete ? 'checked="checked"' : '') + '/>');
                todoRemoveButton = $('<span class="remove">&nbsp;x</span>');
                todo = $('<li></li>');

                todo.append(todoCheckbox);
                todo.append(todoName);
                todo.append(todoRemoveButton);

                todoCheckbox.click(function() {
                    TodoAppReflux.actions.toggle(currentTodo);
                });

                todoRemoveButton.click(function() {
                    if(confirm("Remove ?")) {
                        TodoAppReflux.actions.remove(currentTodo.id);
                    }
                })

                todosElement.append(todo);

            }())

        }

    });


    TodoAppReflux.appElement.find('button').click(function() {
        TodoAppReflux.actions.create(prompt('Title'));
    });

});
