exeter-craigslist
=================
Classifieds for the PEA community.

##Team:
Add your name here!
 - Sean Lee (freshdried)

##Ideas:
####Potential design directions
 - minimal, craiglist-esque
  - less site, more content

####Ideas for technical stuff:
 - Authentication w/ existing username and password
 - Responsive UI (versus dedicated mobile app)
 - static pages (frontend html generation)
  - AJAX json driven content population/submition

####Ideas for function:
 - Listings
   - Listing categories:
    - Free
    - Textbooks
     - categorize by subject options
    - Furniture
    - Other
   - Features:
    - image upload
    - report spam

##Components:
####Backend
 - Database
  - store entries
  - store images?
  - implementation options:
   - redis
   - mysql
 - Authentication
  - tap into [Exeter Connect authentication webservice](https://connect.exeter.edu/_vti_bin/authentication.asmx)
 - Web Server

###Frontend
 - Authentication Page (auth just for posting)
 - Results page
 - Posting page
  - option image upload
  - description
  - categorization


##TODO:
 - brainstorm
 - Split up roles
 - think of catchy, not too corny list
  - exeter-list
  - lionslist
