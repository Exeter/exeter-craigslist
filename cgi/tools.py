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
  data = None

  def __init__(self, place):
    # Parse headers
    for line in sys.stdin:
      if line == "\n":
        break
      colon = line.index(":")
      self.headers[line[:colon].lower()] = line[colon:] # Lowercase standard

    # Remember the file descriptors
    data = place
