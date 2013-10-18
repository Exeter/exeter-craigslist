var TESTING = {
	get_auth_token: function(creds) {
		console.log('getting session token from server...');
		if (creds.username == "") { //dummy login
			Cookies.set('ec_token', '1337');
			return true;
		}
		return false;
	},
	get_posts: function() {
		var posts = { //dummy posts
			'000000000': {
				title: 'Title',
				description: "This is my Title! Wanna buy it!",
				date: "2013-10-14T02:53:50.322Z",
				category: 'furniture',
				//image:
			},
			'000000001': {
				title: 'Tittle',
				description: "This is a tittle!",
				date: "2013-10-15T02:53:50.322Z",
				price: "$40",
				category: 'furniture',
				//image:
			},
			'000000003': {
				title: 'Titttle',
				description: "This is a titttle!",
				date: "2013-10-16T02:53:50.322Z",
				price: "$40",
				category: 'textbooks'
				//image:
			}
		}
		return posts;
	}

};
var PRODUCTION = {
	get_auth_token: function() {
		//ajax call for session token
	}
};

	
$(document).ready(function() {(function(MODE) {
	var User = Backbone.Model.extend({
		initialize: function() {
			//TODO: implement
		},
	});

	var LoginView = Backbone.View.extend({
		el: '#login-form',
		initialize: function() {
			console.log("loginview initialized!");
			if (!!(Cookies.get('ec_token'))){ //if token exists
				var accountview = new AccountView();
				accountview.render();
			} else {
			}
		},
	    	events: {
			"submit": "get_auth_token",
		},
	    	get_auth_token: function(event) {
			event.preventDefault();
			var creds = {
				username: $("#login_username").val(),
	    			password: $("#login_password").val()
			}
			var success = MODE.get_auth_token(creds);
			if (success) {
				var accountview = new AccountView();
				accountview.render();
			} else {
				this.render_fail();
			}
		},
	    	render_fail: (function() {
			var failed = false;
			return function() {
				if (!failed) {
					this.$el.prepend('<i>try again...<i>');
					failed = true;
				}
			}
		})(),
	});

	var AccountView = Backbone.View.extend({
	});
	var loginview = new LoginView();



})(TESTING)});
