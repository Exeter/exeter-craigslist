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

	var UnauthedView = Backbone.View.extend({
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
				this.toAuthedView();
			} else {
				this.render_fail();
			}
		},
		toAuthedView: function() {
			var authedView = new AuthedView();
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

	var AuthedView = Backbone.View.extend({
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
			newPostView = new NewPostView();
		},
		my_posts: function() {
			console.log('my posts...');
			myPostsView = new MyPostsView();
		},
	    	render: function() {
			console.log('Rendering AuthedView');
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

	var NewPostView = Backbone.View.extend({
		el: '#content',
	        initialize: function() {
			console.log('NewPostView initialized!');
			this.render();
		},
	    	render: function() {
			this.$el.html('New post stuff');
		}
	});

	var MyPostsView = Backbone.View.extend({
		el: '#content',
	        initialize: function() {
			console.log('MyPostsView initialized!');
			this.render();
		},
	    	render: function() {
			this.$el.html('My posts');
		}
	});


	//Main
	var contentview = new ContentView();
	var authenticated = (function() {
		return !!(Cookies.get('ec_token'));
	})();
	if (authenticated){
		var authedView = new AuthedView();
	} else {
		var unauthedView = new UnauthedView();
	}
})(TESTING)});
