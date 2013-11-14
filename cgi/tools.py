#!/usr/bin/env python
import os
import sys
from urllib import parse as urlparse

def get_qs_dict():
  # Parse the query string
  qwargs = urlparse.parse_qs(os.environ["QUERY_STRING"])

  # Enforce one value per argument
  for key in qwargs:
    qwargs[key] = qwargs[key][0]

  return qwargs

class StdinData:
  headers = {}
  data = ""

  def __init__(self):
    # Parse headers, and read out the rest of the file
    getting_headers = True
    for line in sys.stdin:
      if getting_headers and line == "\n":
        getting_headers = False
      if getting_headers:
        colon = line.index(":")
        self.headers[line[:colon].lower()] = line[colon+1:] # Lowercase standard
      else:
        self.data += line
