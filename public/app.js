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
            },
            '000000123': {
                title: 'physics textbook',
                description: "this reminds me of the worst year of my life, but nothing is written in it and as a matter of fact, it's never really been opened. #physics #textbook #advanced",
                date: "2013-10-16T02:53:50.322Z",
                price: "$100",
                category: 'textbooks'
                //image:
            },
            '400700192': {
                title: 'greek dictionary',
                description: "by definition, the most useless thing in this century",
                date: "2013-10-16T02:53:50.322Z",
                price: "$100",
                category: 'textbooks'
                //image: 
            },
            '400700192': {
                title: 'greek dictionary',
                description: "by definition, the most useless thing in this century",
                date: "2013-10-16T02:53:50.322Z",
                price: "$100",
                category: 'textbooks'
                //image: 
            },
            '202750144': {
                title: 'TI-84',
                description: "so old you can donate it to a museum. prices according to a priceless relic #calculator #ti84",
                date: "2013-10-16T02:53:50.322Z",
                price: "$90",
                category: 'electronics'
                //image: 
            },
            '202750145': {
                title: 'TI-84',
                description: "don't want it anymore because it is useless for math + science here...but you should buy it anyways! ps missing all its keys pps bateries not included ppps neither is the screen #ti84 #calculator",
                date: "2013-10-16T02:53:50.322Z",
                price: "$200",
                category: 'electronics'
                //image: 
            },
            '202750150': {
                title: 'graph paper',
                description: "graph paper (used) but it's good for scratch work i guess #graphpaper",
                date: "2013-10-16T02:53:50.322Z",
                price: "$5",
                category: 'supplies'
                //image: 
            },
            '202750153': {
                title: 'hammock',
                description: "good for spring term. napping. #hammock #furniture ",
                date: "2013-10-16T02:53:50.322Z",
                price: "$15",
                category: 'supplies'
                //image: 
            },
            '202750169': {
                title: 'pencil',
                description: "warning: i chewed on it, but i cleaned it with hand sanitizer, so it should all be ok. (caution: 2 inches left, ready for compost) #pencil",
                date: "2013-10-16T02:53:50.322Z",
                price: "$1",
                category: 'supplies'
                //image: 
            },
            '202750169': {
                title: 'leftovers',
                description: "las olas leftovers...don't know what it is exactly, but it's green, squishy, and smells like fine cheese. #food #lasolas",
                date: "2013-10-16T02:53:50.322Z",
                price: "$0",
                category: 'other'
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

Backbone.View.prototype.close = function() {
	this.undelegateEvents();
	if (this.onClose) {
		this.onClose();
	}
}


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
			contentController.show("NewPostView");
		},
		my_posts: function() {
			console.log('my posts...');
			contentController.show("MyPostsView");
		},
	    	render: function() {
			console.log('Rendering AuthedView');
			this.$el.html($("#account-template").html());
		}
	});

//PostsView stuff
//Content Stuff
	var contentController = new (function() {
		var views = {
			PostsView: Backbone.View.extend({
				el: '#content',
				events: {
					"click #posts-mode-list": "renderListPostsView",
					"click #posts-mode-grid": "renderGridPostsView"
				},
				subviewController: new (function() {
					var views = {
						ListPostsView: Backbone.View.extend({
							el: "#posts-content",
							render: function() {
								var posts = MODE.get_posts();
								//Better method?
								this.$el.html('<pre>' + JSON.stringify(posts,undefined, 4) + '</pre>');
							}
						}),
						GridPostsView: Backbone.View.extend({
							el: "#posts-content",
							render: function() {
								this.$el.html('TODO: implement GridView');
							}
						}),
					};
					this.show = function(viewstring) {
						console.log('showing' + viewstring);
						if (this.currentView){
							this.currentView.close();
						}
						this.currentView = new views[viewstring];

						var that = this;
						$('#posts-content').fadeOut(100, function() {
							that.currentView.render();
						}).fadeIn(200);
					};
				})(),
				renderListPostsView:  function() { this.subviewController.show("ListPostsView")},
				renderGridPostsView:  function() { this.subviewController.show("GridPostsView")},
				render: function() {
					this.$el.html($("#posts-template").html());
					this.subviewController.show("ListPostsView");
				},
				onClose: function() {
					this.subviewController.currentView.close();
				}
			}),


			NewPostView: Backbone.View.extend({
				el: '#content',
				render: function() {
					this.$el.html($("#add-post-template").html());
				}
			}),


			MyPostsView: Backbone.View.extend({
				el: '#content',
				render: function() {
					this.$el.html($("#my-posts-template").html());
				}
			})
		};

		this.show = function(viewstring) {
			if (this.currentView){
				this.currentView.close();
			}
			this.currentView = new views[viewstring];
			var that = this;
			$('#content').fadeOut(100, function() {
				that.currentView.render();
			}).fadeIn(200);
		}


	})()

//Main
	var mainview = new (Backbone.View.extend({
		el: 'body',
		initialize: function() {
			contentController.show("PostsView");
			var authenticated = (function() {
				return !!(Cookies.get('ec_token'));
			})();

			if (authenticated){
				new AuthedView();
			} else {
				new UnauthedView();
			}
		},
	    	events: {
			"click #title": "renderPostsView",
		},
	    	renderPostsView: function() {
			contentController.show("PostsView");
		}
	}));
})(TESTING)});
