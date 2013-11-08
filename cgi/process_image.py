#!/usr/bin/env python
import fileinput
import tools
import schema
import sys
import json

# Assumes uploaded string follows the following format: 
# 
# <data>
if __name__ == "__main__":
  # Get the query string
  qwargs = tools.get_qs_dict()

  # Read from stdin:
  image_string = sys.stdin.read()

  # Parse out the image data
  image_string = uploadString[uploadString.find("\n\n")+2:]
  image_string = uploadString[uploadString.find("\n\n")+2:uploadString.find("\n")]

  # Write it to the given file
  f = open(qwargs["post_id"], 'w')
  f.write(image_string)
  f.close()

  # Set the image flag in the database
  schema.add_image(int(qwargs["post_id"]))
  
  # If we've gotten here, it was successful.
  print("Content-type: application/json")
  print("")
  print(json.dumps({"success": True})
