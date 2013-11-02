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
  conn = schema.Connection("/home/daemon/exeter-craigslist/cgi/craigslist.db")

  # Fetch the posts and print them out
  print(json.dumps({
    "posts": conn.get_posts(10, timestamp = qwargs["timestamp"] if "timestamp" in qwargs else None, category = qwargs["category"] if "category" in qwargs else None)
  }))
  
  # Close the connection
  conn.close()

