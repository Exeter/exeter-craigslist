#!/usr/bin/env python
import fileinput
import tools
import sys

# Assumes uploaded string follows the following format: 
# 
# <data>
if __name__ == "__main__":
  qwargs = tools.get_qs_dict()
  image_list = sys.stdin.readlines()
  image_string = ''.join(str(elem) for elem in image_list)
  image_string = uploadString[uploadString.find("\n\n")+2:]
  image_string = uploadString[uploadString.find("\n\n")+2:uploadString.find("\n")]
  f = open(qwargs["post_id"], 'w+')
  f.write(image_string)
  f.close()
  return """
Content-Type: application/json

{"success": true}
"""
