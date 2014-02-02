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
  
  if "search" not in qwargs:
    # If we don't have a search term, it's the client's fault.
    print(json.dumps({"error": "missing argument: 'search'"}))
  else:
    # Search for the term we got
    results = conn.search_posts(
         qwargs["search"],
         10,
         timestamp = qwargs["timestamp"] if "timestamp" in qwargs else None,
         category = qwargs["category"] if "category" in qwargs else None)

    # Format it nicely
    formatted_results = []

    for result in results:
      formatted_results.append({
        "id": result[0],
        "category": result[1],
        "author": result[2],
        "created": result[3],
        "refreshed": result[4],
        "title": result[5],
        "body": result[6],
        "image": result[7] == 1,
        "flags": json.loads(result[8])
      })

    print(json.dumps({"posts":formatted_results}))
    
    # Close the connection
    conn.close()
