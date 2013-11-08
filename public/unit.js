/*
  Exeter craigslist unit tests.
*/
asyncTest("View Posts", function() {
  expect(4);

  $.ajax({
    url: "/craigslist/view_posts",
    datatype: "json",
    success: function(data) {
      //Quick tests
      ok(data.hasOwnProperty("posts"), "General formatting O.K.")
      ok(data.posts.length === 10, "Length O.K.");
      
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
    }
  });
});
