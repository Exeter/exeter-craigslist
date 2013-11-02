#!/usr/bin/env python
import schema
import http.cookies
import tools
import json
import sys

if __name__ == "__main__":
  # Get qs info:
  qwargs = tools.get_qs_dict()

  # Get header info
  stdin_data = tools.StdinData(sys.stdin)

  # Parse cookie info
  cookie = http.cookies.BaseCookie(stdin_data.headers["cookie"])

  # Print headers
  print("Content-Type: application/json")
  print("")

  # Open the db connection
  conn = schema.Connection("/home/daemon/exeter-craigslist/cgi/craigslist.db")
  
  # Make sure we have the arguments we need
  if "post" not in qwargs:
    print(json.dumps({
      "error": "missing argument: 'post'",
      "success": False
    }))
  elif conn.check(cookie["username"].value, cookie["sesskey"].value):
    # If they are who they say they are, flag the post
    conn.flag(cookie["username"].value, int(qwargs["post"]))
    print(json.dumps({
      "success": True
    }))
  else:
    print(json.dumps({
      "error": "authentication failed",
      "success": False
    }))

  conn.close()
