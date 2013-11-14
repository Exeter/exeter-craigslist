/*
  Exeter craigslist unit tests.
*/
asyncTest("View Posts", function() {
  expect(4);

  $.ajax({
    url: "/craigslist/list",
    datatype: "json",
    success: function(data) {
      //Quick tests
      ok(data.hasOwnProperty("posts"), "Response has property 'post'")
      ok(data.posts.length <= 10, "Length at most 10");
      
      //Test specific formatting
      var desired = ["title", "refreshed", "created", "author", "body", "image"], has_desired = true;
      for (var i = 0; i < data.posts.length; i += 1) {
        for (var x = 0; x < desired.length; x += 1) {
          has_desired = has_desired && data.posts[i].hasOwnProperty(desired[x]);
        }
      }
      ok(has_desired, "Specific formatting");

      //Test whether it is ordered by timestamp
      var ordered = true;
      for (var i = 0; i < data.posts.length-1; i += 1) {
        ordered = ordered && data.posts[i].refreshed > data.posts[i+1].refreshed;
      }
      ok(ordered, "Ordering");
      start();
    },
    error: function() { start(); }
  });
});

asyncTest("Search Posts", function() {
  expect(5);

  $.ajax({
    url: "/craigslist/search?search=sofa",
    datatype: "json",
    success: function(data) {
      //Quick tests
      ok(data.hasOwnProperty("posts"), "Response has property 'post'")
      ok(data.posts.length <= 10, "Length at most 10");
      
      //Test specific formatting
      var desired = ["title", "refreshed", "created", "author", "body", "image"], has_desired = true;
      for (var i = 0; i < data.posts.length; i += 1) {
        for (var x = 0; x < desired.length; x += 1) {
          has_desired = has_desired && data.posts[i].hasOwnProperty(desired[x]);
        }
      }
      ok(has_desired, "Specific formatting");

      //Test whether it is ordered by timestamp
      var ordered = true;
      for (var i = 0; i < data.posts.length-1; i += 1) {
        ordered = ordered && data.posts[i].refreshed > data.posts[i+1].refreshed;
      }
      ok(ordered, "Ordering");

      //Test whether the search term appears everywhere
      var searched = true;
      for (var i = 0; i < data.posts.length; i += 1) {
        searched = searched && (data.posts[i].body.indexOf("sofa") >= 0);
      }
      ok(searched, "Search term indeed appears");
      start();
    },
    error: function() { start(); }
  });
});

asyncTest("Login", function() {
  expect(1);

  $.ajax({
    url: "/craigslist/authenticate?uname=" + encodeURIComponent("dummy@exeter.edu") + "&password=dummy",
    datatype: "json",
    success: function(data) {
      ok(data.success, "Returned success");
      start();
    }
  });
});

asyncTest("Create Post", function() {
  expect(2);

  $.ajax({
    url: "/craigslist/post",
    method: "POST",
    data: JSON.stringify({
      "title": "Random Post!",
      "body": "This post is pure white noise. It happens to look like English by chance.",
      "category": "random"
    }),
    datatype: "json",
    success: function(data) {
      ok(data.success, "Server claims success")
      $.ajax({
        url: "/craigslist/search?search=pure%20white%20noise",
        datatype: "json",
        success: function(data) {
          ok(data.posts[0].title == "Random Post!", "Found post via search");
          start();
        }
      });
    }
  });
});
