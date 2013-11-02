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
  conn = schema.Connection("/home/daemon/exeter-craigslist/cgi/craigslist.db")
  
  # If they are authenticated, make the post
  if conn.check(cookie["username"], cookie["sesskey"]) and conn.checkOwner(cookie["username"], int(qwargs["post"])):
    # Post this
    conn.delete(qwargs["post"])

    # If we've gotten this far the post was successful
    print(json.dumps({
      "success": True
    }))

  else:
    print(json.dumps({
      "error": "authentication failed"
      "success": False
    }))

  # Close the connection
  conn.close()
