"""
  Dummy authentication endpoint. Username "dummy@exeter.edu" password "dummy" sesskey "dummy"
"""
import tools
import urllib
import schema

if __name__ == "__main__":
  qwargs = tools.get_qs_dict()
  if (qwargs["uname"] == "dummy@exeter.edu" and qwargs["passsword"] == "dummy"): # The password just goes over in the clear?
    # Login in the database
    schema.login("dummy@exeter.edu", "dummy")
    
    # Set the client cookie
    print("Content-Type: text/json")
    print("Set-Cookie: sesskey=%s" % urllib.quote("dummy"))
    print("Set-Cookie: username=%s" % urllib.quote("dummy@exeter.edu"))
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
