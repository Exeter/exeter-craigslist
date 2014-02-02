#!/usr/bin/env python
import os
import tools
import http.cookies
import sqlite3
import json
import schema
import sys

if __name__ == "__main__":
  # Get qs info
  qwargs = tools.get_qs_dict()

  # Get header info
  stdin_data = tools.StdinData()
  
  # Parse cookie info
  cookie = http.cookies.BaseCookie(stdin_data.headers["cookie"])

  # Print headers
  print("Content-Type: application/json")
  print("")

  # Open the db connection
  conn = schema.Connection("/home/daemon/projects/exeter-craigslist/cgi/craigslist.db")
  
  # If they are authenticated, make the post
  if conn.check(cookie["ec_username"].value, cookie["ec_sesskey"].value):
    # We take post data in json
    post_json = json.loads(stdin_data.data)
    conn.post(cookie["ec_username"].value, post_json["category"], post_json["title"], post_json["body"], post_json["price"], image=post_json["image"])
  
  # If we've gotten this far the post was successful
  print(json.dumps({
    "success": True
  }))
  
  # Close the connection
  conn.close()
