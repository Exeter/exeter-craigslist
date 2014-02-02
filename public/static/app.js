/*
 * Where do we verify authentication?
 */
/*
 * author
 * id
 * title
 * description
 * refresh
 * imageurl
 */
var TESTING = (function(){
     var posts = [
       {
         author: 'dbau',
         id: 111,
         title: 'chewed on pencil -- will deliver',
         description: "warning: i chewed on it, but i cleaned it with hand sanitizer, so it should all be ok. (caution: 2 inches left, ready for compost) #pencil",
         created: '1384394022.4964797',
         refreshed: '1384394122.4964797',
         price: "$1",
         category: 'supplies',
         imageurl: 'http://www.acefitness.org/blogs/images/posts/16/chewedpencil.jpg'
       },
       {
         author: 'slee2',
         id: 112,
         title: 'leftover food from olas!',
         description: "las olas leftovers...don't know what it is exactly, but it's green, squishy, and smells like fine cheese. #food #lasolas",
         date: "2013-10-16T02:53:50.322Z",
         price: "$0",
         created: '1484394022.4964797',
         refreshed: '1584394122.4964797',
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
    get_posts: function(callback) {
      callback(posts);
    }
  };
})();

var PRODUCTION = {
  get_auth_token: function(creds) {
    //ajax call for session token
    $.ajax({
      url: "/craigslist/authenticate",
      data: {
        "uname": creds.username,
        "password": creds.password
      }
    });
    return true;
  },
  get_posts: function(callback) {
    $.ajax({
      url: "/craigslist/list",
      datatype: "json",
      success: function(data) {
        callback(data.posts);
      }
    });
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

  console.log("Document ready");

  MODE.get_posts(function(data) {

    console.log("Got posts");

    console.log(data);

    var posts = new Backbone.Collection(data);

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
          Cookies.expire('ec_username');
          Cookies.expire('ec_password');
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
                  var table = $("<table width=80%></table>"); 
                  var headings = $("<tr>" + "<td><b>category</b></td>" + "<td><b>title</b></td>" + "<td><b>author</b></td>" + "<td><b>price</b></td>" + "<tr>"); 
                  table.append(headings); 
                  posts.each(function(post) {
                    var element = $("<tr>" + "<td>" + post.get("category") + "</td>" + "<td>" + post.get("title") + "</td>" +"<td>" + post.get("author") + "</td>" + "<td>" + post.get("price") + "</td>" +  "</tr>");  
                    element.click(function() { router.navigate("viewpost/" + post.id, {trigger: true}); });
                    table.append(element); 
                  });
                  this.$el.html(table);
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
            $("#create_post").click(function() {
              post_json = {
                title: $("#post_title").val(),
                body: $("#post_description").val(),
                category: $("#post_category").val(),
                image: $("#post_image").val(),
                price: $("#post_price").val()
              }
              console.log(post_json);
              $.ajax({
                url: "/craigslist/post",
                method: "post",
                data: JSON.stringify(post_json),
                success: function() {
                  router.navigate("", {trigger: true});
                }
              });
            });
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
          "*notFound": 'notFound'
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
    Backbone.history.start();

    //Main
    var mainview = new (Backbone.View.extend({
      el: 'body',
        initialize: function() {
          var authenticated = (function() {
            return !!(Cookies.get('ec_username'));
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
  });
})(PRODUCTION)});
