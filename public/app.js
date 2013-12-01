/*
 * Where do we verify authentication?
 */

var TESTING = (function(){
	var posts = [
		{
			id: 11,
			title: 'Title',
			description: "This is my Title! Wanna buy it!",
			date: "2013-10-14T02:53:50.322Z",
			category: 'furniture',
			imageurl: "http://info.infiniteconferencing.com/Portals/98866/images/catchy%20titles-resized-600.png"
		},
		{
			id: 12,
			title: 'Tittle',
			description: "This is a tittle!",
			date: "2013-10-15T02:53:50.322Z",
			price: "$40",
			category: 'furniture',
    			imageurl: "http://www.daniellebaird.net/blog/wp-content/uploads/2010/12/tittle-typography-01.jpg"
		},
		{
			id: 13,
			title: 'Titttle',
			description: "This is a titttle!",
			date: "2013-10-16T02:53:50.322Z",
			price: "$40",
			category: 'textbooks',
			imageurl: "http://static.fjcdn.com/pictures/Unique+titttle_11423b_3511365.jpg"
		},
		{
			id: 14,
			title: 'physics textbook',
			description: "this reminds me of the worst year of my life, but nothing is written in it and as a matter of fact, it's never really been opened. #physics #textbook #advanced",
			date: "2013-10-16T02:53:50.322Z",
			price: "$100",
			category: 'textbooks',
			imageurl: "http://www.hwscience.com/physics/apphysicsc/SJ%208th%20Ed.jpg"

		},
		{
			id: 15,
			title: 'greek dictionary',
			description: "by definition, the most useless thing in this century",
			date: "2013-10-16T02:53:50.322Z",
			price: "$100",
			category: 'textbooks',
			imageurl: "http://bibliagora.co.uk/images/P/etymologiko_babiniotis.jpg"
		},
		{
			id: 17,
			title: 'Extra TI-84',
			description: "so old you can donate it to a museum. prices according to a priceless relic #calculator #ti84",
			date: "2013-10-16T02:53:50.322Z",
			price: "$90",
			category: 'electronics',
			imageurl: "http://www.ticalc.org/images/calcs/84plus-big.gif"
		},
		{
			id: 18,
			title: 'TI-84 Plus Silver Edition for sale',
			description: "don't want it anymore because it is useless for math + science here...but you should buy it anyways! ps missing all its keys pps bateries not included ppps neither is the screen #ti84 #calculator",
			date: "2013-10-16T02:53:50.322Z",
			price: "$200",
			category: 'electronics',
			imageurl: 'http://www.ticalc.org/images/calcs/84plus-se-big.gif'
		},
		{
			id: 19,
			title: 'loads of graph paper',
			description: "graph paper (used) but it's good for scratch work i guess #graphpaper",
			date: "2013-10-16T02:53:50.322Z",
			price: "$5",
			category: 'supplies',
			imageurl: 'http://www.northwestern.edu/msa/media/images/stack_of_papers.gif'
		},
		{
			id: 110,
			title: 'nice hammock',
			description: "good for spring term. napping. #hammock #furniture ",
			date: "2013-10-16T02:53:50.322Z",
			price: "$15",
			category: 'supplies',
			imageurl: 'http://www.irunoninsulin.com/wp-content/uploads/2011/11/hammock-between-two-palm-trees-fla517.jpg'
		},
		{
			id: 111,
			title: 'chewed on pencil -- will deliver',
			description: "warning: i chewed on it, but i cleaned it with hand sanitizer, so it should all be ok. (caution: 2 inches left, ready for compost) #pencil",
			date: "2013-10-16T02:53:50.322Z",
			price: "$1",
			category: 'supplies',
			imageurl: 'http://www.acefitness.org/blogs/images/posts/16/chewedpencil.jpg'

		},
		{
			id: 112,
			title: 'leftover food from olas!',
			description: "las olas leftovers...don't know what it is exactly, but it's green, squishy, and smells like fine cheese. #food #lasolas",
			date: "2013-10-16T02:53:50.322Z",
			price: "$0",
			category: 'other',
			imageurl: 'http://hbh.halfbakedharvest.netdna-cdn.com/wp-content/uploads/2013/04/Chipotle-Steak-Burrito-41.jpg'
		}
	];

	return {
	    get_auth_token: function(creds) {
		console.log('getting session token from server...');
		if (creds.username == "") { //dummy login
		    Cookies.set('ec_token', '1337');
		    return true;
		}
		return false;
	    },
	    get_posts: function() { return posts},
	};
})();

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
	var router;

	var posts = new Backbone.Collection(MODE.get_posts());

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
	    	render_fail: function() {
			$('#login_password').val('').attr('placeholder', 'try again...');
		},
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
			Cookies.expire('ec_token');
			location.reload();
		},
	    	new_post: function() {
			router.navigate("newpost", {trigger: true});
		},
		my_posts: function() {
			router.navigate("myposts", {trigger: true});
		},
	    	render: function() {
			console.log('Rendering AuthedView');
			this.$el.html($("#account-template").html());
		}
	});

//Content Stuff
	var contentController = new (function() {
		var current_post = null;
		this.switch_post = function(id) {
			current_post = posts.get(id);
		}
		var _contentController = this;

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
								var list = $("<ul></ul>");

								var that = this;
								posts.each(function(post) {
									var element = $("<li>" + post.get("title") + "</li>");
									element.click(function() { router.navigate("viewpost/" + post.id, {trigger: true}); });
									list.append(element);
								});
								this.$el.html(list);
							}
						}),
						GridPostsView: Backbone.View.extend({
							el: "#posts-content",
							render: function() {
								this.$el.html('TODO: implement GridView');
							}
						}),
					};
					this.currentViewString = "ListPostsView"; //abstract out
					this.show = function(viewstring, override) {
						if (this.currentView && !override){
							if (this.currentViewString == viewstring) return;
							this.currentView.close();
						}
						this.currentView = new views[viewstring];
						this.currentViewString = viewstring;

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
					this.subviewController.show(this.subviewController.currentViewString, true);
				},
				onClose: function() {
					this.subviewController.currentView.close();
				}
			}),


			PostView: Backbone.View.extend({
				el: '#content',
				template: _.template($("#post-template").html()),
				render: function() {
					this.model = current_post;
					var html = this.model.get("description");
					this.$el.html(this.template(this.model.attributes));

				},
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
				if (this.currentViewString == viewstring) return;
				this.currentView.close();
			}
			this.currentView = new views[viewstring];
			this.currentViewString = viewstring;
			var that = this;
			$('#content').fadeOut(100, function() {
				that.currentView.render();
			}).fadeIn(200);
		}


	})()

	var Router = Backbone.Router.extend({
		routes: {
	    		'': "index", 
			"newpost": "newpost",
			"myposts": "myposts",
	    		"viewpost/:id": "viewpost",
	    		"*notFound": 'notFound',
		},
	    	index: function() {
			contentController.show("PostsView");
		},
	    	newpost: function() {
			contentController.show('NewPostView');
		},
	    	myposts: function() {
			contentController.show('MyPostsView');
		},
	    	viewpost: function(id) {
			contentController.switch_post(id);
			contentController.show('PostView');
		},
	    	notFound: function() {
			$("#content").html("page not found!");
		},
	});
	router = new Router;
	Backbone.history.start({pushState: true});

//Main
	var mainview = new (Backbone.View.extend({
		el: 'body',
		initialize: function() {
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
			router.navigate("", {trigger: true});
		}
	}));
})(TESTING)});
