                              var table = $("<table width=80%></table>"); 
                                var headings = $("<tr>" + "<td><b>category</b></td>" + "<td><b>title</b></td>" + "<td><b>author</b></td>" + "<td><b>price</b></td>" + "<tr>"); 
                                table.append(headings); 
                                posts.each(function(post) {
                                    var element = $("<tr>" + "<td>" + post.get("category") + "</td>" + "<td>" + post.get("title") + "</td>" +"<td>" + post.get("author") + "</td>" + "<td>" + post.get("price") + "</td>" +  "</tr>");  
                                    element.click(function() { router.navigate("viewpost/" + post.id, {trigger: true}); });
                                    table.append(element); 
                                });
                                this.$el.html(table);