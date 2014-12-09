var Utils = {};

Utils.getRefluxActions = function() {
	var actions = Reflux.createActions([
				    'create',
				    'toggle',
				    'remove'
				]);

	return actions;
};

Utils.Todo = Backbone.Model.extend({
	defaults: {
		complete: false
	},

	toggle: function() {
		this.set('complete', !this.get('complete'));
	}
});

Utils.TodoCollection = Backbone.Collection.extend({
	model: Utils.Todo,

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
		if(confirm("Remove ?")) {
			this.remove(todo);
			this.trigger('change');
		}
	}
});