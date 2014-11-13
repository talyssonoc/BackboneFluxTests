$(function() {

    var TodoAppReflux = {};

    TodoAppReflux.actions = Reflux.createActions([
        'create',
        'toggle',
        'remove'
    ]);

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

    TodoAppReflux.appElement = $('#flux_app')

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
                todo = $('<li></li>');

                todo.append(todoCheckbox);
                todo.append(todoName);

                todo.click(function() {
                    TodoAppReflux.actions.toggle(currentTodo);
                });

                todo.dblclick(function() {
                    TodoAppReflux.actions.remove(currentTodo.id);
                })

                todosElement.append(todo);

            }())

        }

    });


    TodoAppReflux.appElement.find('button').click(function() {
        TodoAppReflux.actions.create(prompt('Title'));
    });

});
