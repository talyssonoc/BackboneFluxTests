$(function() {
	var TodoAppBackboneReflux = Backbone.View.extend({

		events: {
			'click .add': 'create'
		},

		initialize: function() {
			this.store = new TodoCollection();

			this.actions.create.listen(this.store.createTodo.bind(this.store));
			this.actions.toggle.listen(this.store.toggleTodo.bind(this.store));
			this.actions.remove.listen(this.store.removeTodo.bind(this.store));

			this.listenTo(this.store, 'change', this.render);
		},

		create: function create() {
			this.actions.create(prompt('Title'));
		},

		render: function() {

			var todosElement = this.$el.find('.todos');

			todosElement.empty();

			this.store.forEach(function(todo) {
				var todoView = new TodoView({
					model: todo
				});

				todosElement.append(todoView.render());
			});
		},

		actions: Utils.getRefluxActions()
	});

	var Todo = Utils.Todo;

	var TodoCollection = Utils.TodoCollection;

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
			backboneAppReflux.actions.toggle(this.model);
		},

		remove: function() {
			backboneAppReflux.actions.remove(this.model)
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));

			return this.$el;
		}
	});

	var backboneAppReflux = new TodoAppBackboneReflux({
		el: document.getElementById('backbone_reflux_app')
	});

	backboneAppReflux.render();
});
