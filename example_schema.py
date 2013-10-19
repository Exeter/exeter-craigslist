#!/usr/bin/env python
import sqlite
import json

"""
  An intial db schema for Craigslist (doesn't yet implement tags).
"""

class Connection:
  # We remember the database connection here
  conn = None
  c = None

  def __init__(self, place):
    # Connect to the database
    conn = sqlite3.connect(place)
    c = conn.cursor()

    # Avoid needing write permission to parent directory
    c.execute("PRAGMA synchronous=OFF")
    c.execute("PRAGMA temp_store=MEMORY")

    # Ensure that the tables exist
    c.executescript("""
      CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY ASC, email TEXT, sesskey TEXT);
      CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY ASC, category TEXT, author TEXT, created INTEGER, refresh INTEGER, title TEXT, body TEXT, tag TEXT, image BLOB, flagged TEXT, unlink INTEGER);
      CREATE INDEX refresh_index ON posts(refresh);
      CREATE INDEX created_index ON posts(created);
      CREATE INDEX category_index ON posts(category);
      CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY ASC, name TEXT, posts TEXT);
    """)
    
    # Commit the table creation
    conn.commit()

    # Remember this database connection
    self.conn = conn
    self.c = c

  def __enter__(self):
    # For the python "with" statement
    return self

  def login(self, email, sesskey):
    # Check to see if we already have a user record for this email
    self.c.execute("SELECT EXISTS(SELECT 1 FROM users WHERE email=? LIMIT 1)", (email,))
    
    if (self.c.fetchone() == 1):
      # If so, update their session key
      self.c.execute("UPDATE users SET sesskey=? WHERE email=?", (email,))

    else:
      # Otherwise, create an empty user record and set its session key
      self.c.execute("INSERT INTO users (email, sesskey) VALUES (?, ?, ?)", (email, sesskey))
    
    # Commit this database change.
    self.conn.commit()

  def logout(self, email):
    # Unset this user's session key
    self.c.execute("UPDATE users SET sesskey='' WHERE email=?", (email,))

    # Commit
    self.conn.commit()


  def check(self, email, sesskey):
    # See if (sesskey) matches the one in our database
    self.c.execute("SELECT sesskey FROM users WHERE email=?", (email,))
    return (self.c.fetchone()[0] == sesskey)

  def flag(self, email, post):
    # Get this post's current flaggers
    self.c.execute("SELECT flags FROM posts WHERE email=?", (email,))
    current_bookmarkers = json.loads(self.c.fetchone()[0])

    # If we haven't already flagged this yet with this users, do so
    if email not in current_bookmarkers:
      current_bookmarkers.append(email)
      self.c.execute("UPDATE posts SET flags=?", (json.dumps(json.dumps(current_bookmarkers)),))

    # Commit
    self.conn.commit()

  def get_posts(self, timestamp, limit, content_search=None, category=None):
    # Fetch all matching posts
    if category is not None:
      self.c.execute("SELECT * FROM posts WHERE refresh>? AND unlink!=1 ORDER BY refresh DESC") 
    else:
      self.c.execute("SELECT * FROM posts WHERE refersh>? AND unlink!= AND category=? ORDER BY refresh DESC", (category,))

    if content_search is not None:
      # If we're asked to execute a search, do so
      produced_rows = []

      # Iterate over the rows to find the results
      for row in self.c:
        # If this result matches, append it
        produced_rows.append(row) if content_search in row[5] else 0

        # If we have enough results, return
        if len(produced_rows) > limit:
          return produced_rows

    else:
      # Otherwise, return (limit) rows
      return (self.c.fetchone() for _ in range(0, limit))
  
  def post(self, author, title, body, tag, image):
    # Create this post
    self.c.execute("INSERT INTO posts (author, created, refresh, title, body, tag, image, flags, unlink) VALUES (?, ?, ?, ?, ?, ?, ?, '[]', 0)", author, time.time(), time.time(), title, body, tag, image, )
    
    # Commit
    self.conn.commit()

  def edit_post(self, post_id, title, body, tag, image):
    # Update this post
    self.c.execute("UPDATE posts SET title=?, body=?, tag=?, image=?, refresh=? WHERE id=?", (title, body, tag, image, time.time(), post_id))
  
    # Commit
    self.conn.commit()

  def close(self):
    # Do any last-minute commits and then close
    self.conn.commit()
    self.conn.close()

  def garbage_collect(self):
    # Issue the command to grab all the rows
    self.c.execute("SELECT id, flags FROM posts")
    
    # Iterate over the rows
    for row in self.c:
      if len(json.loads(row[1])) > FLAG_UNLINK_THRESHOLD:
        # If a post has been flagged too many times, delete it.
        self.c.execute("UPDATE posts SET unlink=1 WHERE posts=?")

  def __del__(self):
    self.close()

  def __exit__(self):
    self.close()
