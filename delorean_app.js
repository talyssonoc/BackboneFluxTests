$(function() {

    var Flux = DeLorean.Flux;

    var TodoAppDeLorean = {};

    var DeLoreanStore = Flux.createStore({
        todos: [],
        currentId: 0,

        actions: {
            create: 'createTodo',
            toggle: 'toggleTodo',
            remove: 'removeTodo'
        },

        createTodo: function createTodo(text) {

            var id = this.currentId++;

            this.todos.push({
                id: id,
                complete: false,
                text: text
            });

            this.emit('change');
        },

        toggleTodo: function toggleTodo(todo) {
            todo.complete = !todo.complete;

            this.emit('change');
        },

        removeTodo: function removeTodo(id) {
            this.todos.splice(id, 1);

            this.emit('change');
        }

    });

    TodoAppDeLorean.store = new DeLoreanStore();

    TodoAppDeLorean.dispatcher = Flux.createDispatcher({
        create: function(data) {
            this.dispatch('create', data);
        },
        toggle: function(data) {
            this.dispatch('toggle', data);
        },
        remove: function(data) {
            this.dispatch('remove', data);
        },
        getStores: function () {
            return { increment: TodoAppDeLorean.store };
        }
    });


    TodoAppDeLorean.appElement = $('#delorean_app')

    TodoAppDeLorean.store.onChange(function() {

        var todoList = TodoAppDeLorean.store.store.todos;

        // Remove all listeners
        TodoAppDeLorean.appElement.find('.todos > li').off('click');
        TodoAppDeLorean.appElement.find('todos > li').off('dblclick');

        var todosElement = TodoAppDeLorean.appElement.find('.todos');

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
                    TodoAppDeLorean.dispatcher.toggle(currentTodo);
                });

                todoRemoveButton.click(function() {
                    if(confirm("Remove ?")) {
                        TodoAppDeLorean.dispatcher.remove(currentTodo.id);
                    }
                })

                todosElement.append(todo);

            }())

        }

    });


    TodoAppDeLorean.appElement.find('button').click(function() {
        TodoAppDeLorean.dispatcher.create(prompt('Title'));
    });

});
