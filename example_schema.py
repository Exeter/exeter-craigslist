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
      CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY ASC, email TEXT, sesskey TEXT, bookmarks TEXT);
      CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY ASC, author TEXT, created INTEGER, edited INTEGER, title TEXT, body TEXT, tag TEXT, image BLOB, bookmarked TEXT);
      CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY ASC, tag TEXT, tagged TEXT);
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
      self.c.execute("INSERT INTO users (email, sesskey, bookmarks) VALUES (?, ?, ?)", (email, sesskey, "[]"))
    
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

  def bookmark(self, email, post):
    # Get this user's current bookmarks
    self.c.execute("SELECT bookmarks FROM users WHERE email=?", (email,))
    current_bookmarks = json.loads(self.c.fetchone()[0])

    # Update it
    current_bookmarks.append(post)
    self.c.execute("UPDATE users WHERE email=? SET bookmarks=?", (json.dumps(current_bookmarks)))

    # Get this post's current bookmarkers
    self.c.execute("SELECT bookmarkers FROM users WHERE email=?", (email,))
    current_bookmarkers = json.loads(self.c.fetchone()[0])

    # Update them
    current_bookmarkers.append(email)
    self.c.execute("UPDATE users WHERE email=? SET bookmarkers=?", (json.dumps(current_bookmarkers),))

    # Commit
    self.conn.commit()

  def get_posts_by_creation(self, timestamp, content_search, tag_search):
    # Fetch all matching posts
    self.c.execute("SELECT * FROM posts WHERE created>? AND body LIKE ? AND tag LIKE ? ORDER BY created DESC LIMIT 10", (timestamp, "%%%s%%" % content_search, "%%%s%%" % tag_search))
    return self.c.fetchall()

  def get_posts_by_edition(self, timestamp, content_search, tag_search):
    # Fetch all matching posts
    self.c.execute("SELECT * FROM posts WHERE edited>? AND body LIKE ? AND tag LIKE ? ORDER BY edited DESC LIMIT 10", (timestamp, "%%%s%%" % content_search, "%%%s%%" % tag_search))
    return self.c.fetchall()
  
  def post(self, author, title, body, tag, image):
    # Create this post
    self.c.execute("INSERT INTO posts (author, created, edited, title, body, tag, image, bookmarked) VALUES (?, ?, ?, ?, ?, ?, ?, '[]')", author, time.time(), time.time(), title, body, tag, image)
    
    # Commit
    self.conn.commit()

  def edit_post(self, post_id, title, body, tag, image):
    # Update this post
    self.c.execute("UPDATE posts SET title=?, body=?, tag=?, image=?, edited=? WHERE id=?", (title, body, tag, image, time.time(), post_id))
  
    # Commit
    self.conn.commit()

  def close(self):
    # Do any last-minute commits and then close
    self.conn.commit()
    self.conn.close()

  def __del__(self):
    self.close()

  def __exit__(self):
    self.close()
