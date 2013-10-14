var TESTING = {
	user: {
		load_user_data: function(user) {
			console.log('loading user data from server...');

			if (Cookies.get('exeter_craigslist_token') == '1337') {
				console.log('successfully retrieved data');
				user['first'] = 'Sean';
				user['last'] = 'Lee';
				return true;
			}
			console.log('unable to retrieve data');
			return false;
		},
		get_session_token: function(creds) {
			console.log('getting session token from server...');
			if (creds.username == "") {
				Cookies.set('exeter_craigslist_token', '1337');
				return true;
			}
			return false;
		}
	},
	get_posts: function() {
		var posts = { //dummy posts
			'123456789': {
				title: 'Title',
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				date: "2013-10-14T02:53:50.322Z",
				category: 'furniture'


			}
		}
		return posts;
	}

};
var PRODUCTION = {
	user: {
		load_user_data: function(user) {
			//authenticated ajax call for user data
			//if call fails return false
			//else return true
		},
		get_session_token: function() {
			//ajax call for session token
		}
	}
};

	
(function(MODE) {
	var user = (function() {
		var user = {};

		var existingsession = (function(){
			return !!(Cookies.get('exeter_craigslist_token')); //get truth value
		})();

		function transform_dom() {
			$('#login').css('display', 'none');
			$('#account_stuff').css('display', 'inline');
			$('#my_posts').html(user.first.toLowerCase() + '\'s posts');
		}

		if (existingsession) {
			var userloaded = MODE.user.load_user_data(user);
			if (userloaded) transform_dom();
		}
		$('#login').on('submit', function(e){
			e.preventDefault(); //prevent default submit
			var creds = {
				username: $('#login_username').val(),
				password: $('#login_password').val()
			}

			var authenticated = MODE.user.get_session_token(creds);
			if (!authenticated) {
				$('#login i').css('display', 'inline');
				return;
			}
			var userloaded = MODE.user.load_user_data(user);
			if (userloaded) transform_dom();

		});
		$('#logout').on('click', function(e){
			Cookies.expire('exeter_craigslist_token');
			window.location.reload();

			//refresh
		});
		$('#new_post').on('click', function(e){
			//TODO: implement!
		});
		$('#my_posts').on('click', function(e){
			//TODO: implement!
		});
		return user;
	})();
	var posts = (function() {
		var posts = MODE.get_posts();
		return posts;
	})();


})(TESTING);
