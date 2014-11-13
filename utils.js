var Utils = {

	getActions: function() {
		var actions = Reflux.createActions([
					    'create',
					    'toggle',
					    'remove'
					]);

		return actions;
	}
}