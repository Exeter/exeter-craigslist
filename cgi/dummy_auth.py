#!/usr/bin/env python
"""
  Dummy authentication endpoint. Username "dummy@exeter.edu" password "dummy" sesskey "dummy"
"""
import tools
import urllib
import schema
import json

if __name__ == "__main__":
  qwargs = tools.get_qs_dict()
  conn = schema.Connection("/home/daemon/projects/exeter-craigslist/cgi/craigslist.db")

  if (qwargs["uname"] == "dummy@exeter.edu" and qwargs["password"] == "dummy"): # The password just goes over in the clear?
    # Login in the database
    conn.login("dummy@exeter.edu", "dummy")
    
    # Set the client cookie
    print("Content-Type: text/json")
    print("Set-Cookie: ec_username=%s;" % "dummy@exeter.edu")
    print("Set-Cookie: ec_sesskey=%s;" % "dummy")
    print("")

    # Print success
    print(json.dumps({
      "success": True
    }))
  else:
    # Otherwise, respond with failure.
    print("Content-Type: text/json")
    print("")
    print(json.dumps({
      "success": False
    }))
