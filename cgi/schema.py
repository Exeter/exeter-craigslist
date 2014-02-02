#!/usr/bin/env python
import sqlite3
import json
import time

"""
  An intial db schema for Craigslist (doesn't yet implement tags).
"""

class Connection:
  # We remember the database connection here
  conn = None
  c = None
  place = None

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
      CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY ASC, category TEXT, author TEXT, created INTEGER, refresh INTEGER, title TEXT, body TEXT, image TEXT, flags TEXT, unlink INTEGER, price TEXT);
      CREATE INDEX IF NOT EXISTS refresh_index ON posts(refresh);
      CREATE INDEX IF NOT EXISTS created_index ON posts(created);
      CREATE INDEX IF NOT EXISTS category_index ON posts(category);
      CREATE INDEX IF NOT EXISTS author_index ON posts(author);
      CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY ASC, name TEXT, posts TEXT);
    """)
    
    # Commit the table creation
    conn.commit()

    # Remember this database connection
    self.conn = conn
    self.c = c
    self.place = place

  def refresh(self):
    # Clear the database. DEBUGGING ONLY
    self.c.executescript("""
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS posts;
      DROP INDEX IF EXISTS refresh_index;
      DROP INDEX IF EXISTS created_index;
      DROP INDEX IF EXISTS category_index;
      DROP INDEX IF EXISTS author_index;
      DROP INDEX IF EXISTS categories;
    """)

    # Restart the database
    self.__init__(self.place)

  def __enter__(self):
    # For the python "with" statement
    return self

  def login(self, email, sesskey):
    # Check to see if we already have a user record for this email
    self.c.execute("SELECT EXISTS(SELECT email FROM users WHERE email=? LIMIT 1)", (email,))
    
    if (self.c.fetchone() == 1):
      # If so, update their session key
      self.c.execute("UPDATE users SET sesskey=? WHERE email=?", (email,))

    else:
      # Otherwise, create an empty user record and set its session key
      self.c.execute("INSERT INTO users (email, sesskey) VALUES (?, ?)", (email, sesskey))
    
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
    self.c.execute("SELECT flags FROM posts WHERE id=?", (post,))
    current_bookmarkers = json.loads(self.c.fetchone()[0])

    # If we haven't already flagged this yet with this users, do so
    if email not in current_bookmarkers:
      current_bookmarkers.append(email)
      self.c.execute("UPDATE posts SET flags=? WHERE id=?", (json.dumps(current_bookmarkers), post))

    # Commit
    self.conn.commit()
  
  def get_posts(self, limit, timestamp=None, category=None):
    # Make the request to the database (cases with timestamp and category given or not)
    if timestamp is None and category is None:
      self.c.execute("SELECT * FROM posts WHERE unlink!=1 ORDER BY refresh DESC LIMIT ?", (limit,))
    elif category is None:
      self.c.execute("SELECT * FROM posts WHERE unlink!=1 AND refresh<? ORDER BY refresh DESC LIMIT ?", (timestamp, limit)) 
    elif timestamp is None:
      self.c.execute("SELECT * FROM posts WHERE unlink!=1 AND category=? ORDER BY refresh DESC LIMIT ?", (category, limit))
    else:
      self.c.execute("SELECT * FROM posts WHERE unlink!=1 AND category=? AND refresh<? ORDER BY refresh DESC LIMIT ?", (category, timestamp, limit))
    
    # Fetch all matching posts.
    return self.c.fetchall()

  def search_posts(self, search, limit, timestamp=None, category=None):
    # Make the request to the database (cases with timestamp and category given or not)
    if timestamp is None and category is None:
      self.c.execute("SELECT * FROM posts WHERE unlink!=1 ORDER BY refresh DESC LIMIT ?", (limit,))
    elif category is None:
      self.c.execute("SELECT * FROM posts WHERE unlink!=1 AND refresh<? ORDER BY refresh DESC LIMIT ?", (timestamp, limit)) 
    elif timestamp is None:
      self.c.execute("SELECT * FROM posts WHERE unlink!=1 AND category=? ORDER BY refresh DESC LIMIT ?", (category, limit))
    else:
      self.c.execute("SELECT * FROM posts WHERE unlink!=1 AND category=? AND refresh<? ORDER BY refresh DESC LIMIT ?", (category, timestamp, limit))

    # Iterate over the rows to find the results
    produced_rows = []

    for row in self.c:
      # If this result matches, append it
      produced_rows.append(row) if search in row[6] else 0

      # If we have enough results, return
      if len(produced_rows) > limit:
        return produced_rows
    
    # If we haven't already, return
    return produced_rows

  def get_post(self, post_id):
    # Get the requested post
    self.c.execute("SELECT * FROM posts WHERE unlink!=1 AND id?", (post_id,))
    return self.c.fetchone()
  
  def post(self, author, category, title, body, price, image=None):
    # Create this post
    self.c.execute("INSERT INTO posts (author, created, refresh, title, body, category, image, flags, unlink, price) VALUES (?, ?, ?, ?, ?, ?, ?, '[]', 0, ?)", (author, time.time(), time.time(), title, body, category, image, price))
    
    # Commit
    self.conn.commit()

  def edit_post(self, post_id, title, body, price, image=None):
    # Update this post
    self.c.execute("UPDATE posts SET title=?, body=?, image=?, refresh=?, price=? WHERE id=?", (title, body, image, time.time(), price, post_id))
  
    # Commit
    self.conn.commit()

  def renew(self, post_id):
    # Renew this post
    self.c.execute("UPDATE posts SET refresh=? WHERE id=?", (time.time(), post_id))
    
    # Commit
    self.conn.commit()

  def close(self):
    # Do any last-minute commits and then close
    if self.conn is not None:
      self.conn.commit()
      self.conn.close()
    
    # Forget about this database connection (as it is now closed)
    self.conn = None
  
  def delete(self, post_id):
    # Soft delete (unlink)
    self.c.execute("UPDATE posts SET unlink=1 WHERE id=?", (post_id,))
  
    # Commit
    self.conn.commit()

  def checkOwner(self, email, post_id):
    # Check to see whether this email matches the author column in post_id
    self.c.execute("SELECT author FROM posts WHERE id=?", (post_id,))
    return email == self.c.fetchone()[0]

  def garbage_collect(self):
    # Issue the command to grab all the rows
    self.c.execute("SELECT id, flags FROM posts")
    
    # Iterate over the rows
    for row in self.c:
      if len(json.loads(row[1])) > FLAG_UNLINK_THRESHOLD:
        # If a post has been flagged too many times, delete it.
        self.c.execute("UPDATE posts SET unlink=1 WHERE posts=?")

  def add_image(self, post_id, image):
    # Set the image flag on the given post
    self.c.execute("UPDATE posts SET image=? WHERE id=?", post_id, image)

  def del_image(self, post_id):
    # Unset the image flag on the given post
    self.c.execute("UPDATE posts SET image=null WHERE id=?", post_id)

  def __del__(self):
    self.close()

  def __exit__(self):
    self.close()

