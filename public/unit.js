/*
  Exeter craigslist unit tests.
*/
test("View Posts", function() {
  $.ajax({
    url: "/craigslist/view_posts",
    datatype: "json",
    success: function(data) {
      ok(data.hasOwnProperty("posts"), "General formatting O.K.")
      ok(data.posts.length === 10, "Length O.K.");
      ok(data.posts[0].hasOwnProperty("title"), "Title O.K.");
      ok(data.posts[0].refreshed > data.posts[1].refreshed, "Tentative ordering O.K.");
    }
  });
});
