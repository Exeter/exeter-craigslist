#!/usr/bin/env python
import os
import tools
import sqlite3
import json
import schema

if __name__ == "__main__":
  # Get qs info
  qwargs = tools.get_qs_dict()

  # Print headers
  print("Content-Type: application/json")
  print("")

  # Open the db connection
  conn = schema.Connection("/home/daemon/projects/exeter-craigslist/cgi/craigslist.db")
  
  # Fetch the posts
  post_list = conn.get_posts(10, 
      timestamp = qwargs["timestamp"] if "timestamp" in qwargs else None,
      category = qwargs["category"] if "category" in qwargs else None)

  formatted_post_list = []
  
  # Format the posts in a quasi-readable json format
  for post in post_list:
    formatted_post_list.append({
      "id": post[0],
      "category": post[1],
      "author": post[2],
      "date": post[4],
      "title": post[5],
      "description": post[6],
      "imageurl": post[7],
      "flags": json.loads(post[8]),
      "price": post[9]
    })

  print(json.dumps({"posts": formatted_post_list}))
  
  # Close the connection
  conn.close()

