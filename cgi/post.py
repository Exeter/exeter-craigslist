#!/usr/bin/env python
import os
import tools
import http.cookies
import sqlite3
import json
import schema

if __name__ == "__main__":
  # Get qs info
  qwargs = tools.get_qs_dict()

  # Get header info
  stdin_data = StdinData()
  
  # Parse cookie info
  cookie = http.cookies.BaseCookie(stdin_data.headers["cookie"])

  # Print headers
  print("Content-Type: application/json")
  print("")

  # Open the db connection
  conn = Connection("/home/daemon/exeter-craigslist/cgi/craigslist.db")
  
  # If they are authenticated, make the post
  if conn.check(cookie["username"], cookie["sesskey"]):
    # We take post data in json
    post_json = json.load(sys.stdin)
    conn.post(cookie["username"], post_json["category"], post_json["title"], post_json["body"])
  
  # If we've gotten this far the post was successful
  print(json.dumps({
    "success": True
  }))
  
  # Close the connection
  conn.close()
