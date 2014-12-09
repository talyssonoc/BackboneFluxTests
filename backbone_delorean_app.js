$(function() {
	var Flux = DeLorean.Flux;

	var Todo = Utils.Todo;

	var DeLoreanStore = Flux.createStore({
	    todos: new Utils.TodoCollection(),

	    actions: {
	        create: 'createTodo',
	        toggle: 'toggleTodo',
	        remove: 'removeTodo'
	    },

	    createTodo: function createTodo(text) {
	        this.todos.createTodo(text);

	        this.emit('change');
	    },

	    toggleTodo: function toggleTodo(todo) {
	        this.todos.toggleTodo(todo);

	        this.emit('change');
	    },

	    removeTodo: function removeTodo(todo) {
	        this.todos.removeTodo(todo);

	        this.emit('change');
	    }

	});

	var TodoAppBackboneDeLorean = Backbone.View.extend({

		events: {
			'click .add': 'create'
		},

		initialize: function() {
			var self = this;

			this.store = new DeLoreanStore();

			this.dispatcher = Flux.createDispatcher({
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
			        return { increment: self.store };
			    }
			});

			this.store.onChange(this.render.bind(self));
		},

		create: function create() {
			this.dispatcher.create(prompt('Title'));
		},

		render: function() {

			var todosElement = this.$el.find('.todos');

			todosElement.empty();

			this.store.store.todos.forEach(function(todo) {
				var todoView = new TodoView({
					model: todo
				});

				todosElement.append(todoView.render());
			});
		},

		actions: Utils.getRefluxActions()
	});


	var TodoView = Backbone.View.extend({
		tagName: 'li',

		template: _.template('<input type=\'checkbox\' <% if(complete) { print(\'checked="checked"\'); } %>/><span><%= title %></span> <span class="remove">x</span>'),

		events: {
			'click input': 'toggle',
			'click .remove': 'remove'
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render.bind(this));
		},

		toggle: function() {
			backboneAppDeLorean.dispatcher.toggle(this.model);
		},

		remove: function() {
			backboneAppDeLorean.dispatcher.remove(this.model)
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));

			return this.$el;
		}
	});

	var backboneAppDeLorean = new TodoAppBackboneDeLorean({
		el: document.getElementById('backbone_delorean_app')
	});

	backboneAppDeLorean.render();
});
