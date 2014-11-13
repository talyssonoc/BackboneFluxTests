var TodoAppBackbone = Backbone.View.extend({

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

	actions: Utils.getActions()
});

var Todo = Backbone.Model.extend({
	defaults: {
		complete: false
	},

	toggle: function() {
		this.set('complete', !this.get('complete'));
	}

});

var TodoCollection = Backbone.Collection.extend({
	model: Todo,

	createTodo: function(title) {
		this.add({
			title: title
		});
		this.trigger('change');
	},

	toggleTodo: function(todo) {
		todo.toggle();
	},

	removeTodo: function(todo) {
		this.remove(todo);
		this.trigger('change');
	}
});

var TodoView = Backbone.View.extend({
	tagName: 'li',

	template: _.template('<input type=\'checkbox\' <% if(complete) { print(\'checked="checked"\'); } %>/><span><%= title %></span>'),

	events: {
		'click': 'toggle',
		'dblclick': 'remove'
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render.bind(this));
	},

	toggle: function() {
		backboneApp.actions.toggle(this.model);
	},

	remove: function() {
		backboneApp.actions.remove(this.model)
	},

	render: function () {
		this.$el.html(this.template(this.model.attributes));

		return this.$el;
	}
});

var backboneApp;

$(function() {
	backboneApp = new TodoAppBackbone({
		el: document.getElementById('backbone_app')
	});

	backboneApp.render();
});
