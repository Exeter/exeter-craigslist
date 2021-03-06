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
  
  # Check that they're allowed to renew this post
  if conn.check(cookie["ec_username"], cookie["ec_sesskey"]) and conn.checkOwner(cookie["ec_username"], int(qwargs["post"])):
    # Renew it.
    print(json.dumps({
      "success": conn.renew(int(qwargs["post"]))
    }))

  else:
    print(json.dumps({
      "error": "authentication failed",
      "success": False
    }))

  # Close the connection
  conn.close()
