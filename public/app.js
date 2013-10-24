/*
 * Where do we verify authentication?
 */

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
		el: '#account-area',
		initialize: function() {
			console.log("loginview initialized!");
			this.render();
		},
	    	events: {
			"submit #login-form": "get_auth_token",
		},
	    	get_auth_token: function(event) {
			event.preventDefault();
			var creds = {
				username: $("#login_username").val(),
	    			password: $("#login_password").val()
			}
			var success = MODE.get_auth_token(creds);
			if (success) {
				this.toAccountView();
			} else {
				this.render_fail();
			}
		},
		toAccountView: function() {
			var accountview = new AccountView();
		},
		render: function() {
			this.$el.html($("#login-template").html());
		},
	    	render_fail: (function() {
			var failed = false;
			return function() {
				if (!failed) {
					$("#login-form").prepend('<i>try again...');
					failed = true;
				}
			}
		})(),
	});

	var AccountView = Backbone.View.extend({
		el: '#account-area',
		initialize: function() {
			console.log('AccountView initialized');
			this.render();
		},
		events: {
			"click #logout": "logout",
			"click #new-post": "new_post",
			"click #my-posts": "my_posts"
		},
	    	logout: function() {
			console.log("Logging out!");
			Cookies.expire('ec_token');
			location.reload();
		},
	    	new_post: function() {
			console.log('new post!');
			alert('new post!');
			//initialize new_post view
		},
		my_posts: function() {
			console.log('my posts...');
			alert('my posts...');
			//initialize my_posts view
		},
	    	render: function() {
			console.log('Rendering AccountView');
			this.$el.html($("#account-template").html());
		}
	});

	var ContentView = Backbone.View.extend({
		el: '#content',
	    	initialize: function() {
			console.log('ContentView initialized!');
			this.render();
		},
	    	render: function() {
			this.$el.html('This is just a test. Login with blank username.');
		}
		
	});


	//Main
	var contentview = new ContentView();
	var authenticated = (function() {
		return !!(Cookies.get('ec_token'));
	})();
	if (authenticated){
		var accountview = new AccountView();
	} else {
		var loginview = new LoginView();
	}
})(TESTING)});
