exeter-craigslist
=================
Classifieds for the PEA community.

##Team:
Add your name here!
 - Sean Lee (freshdried)
 - Oishi Banerjee (oishib)
 - Lizzie Wei (lizziew)


##Ideas:
####Potential design directions
 - minimal, craiglist-esque
  - less site, more content

####Ideas for technical stuff:
 - Authentication w/ existing username and password
 - Responsive UI (versus dedicated mobile app)
 - AJAX json driven content population/submition

####Ideas for function:
 - Listings
  - Listing categories:
     - Free
     - Textbooks
         - categorize by subject options
     - Food (Do you really think people will sell food that much?)
     - Electronics (Working laptops, etc) 
     - Furniture
     - Others 
     ** I think "Free" should not be a separate category because if it is then it will be very random.
        We should have a special search button for "free" (and let users indicate if their items are free)
    ^^ agreed - for the "add a listing" page, I put "free" under "price ranges" 
    Clothes?

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
    - tap into pop3 webmail server for authentication
 - Web Server

###Frontend
 - Authentication Page (auth just for posting)
 - Results page
 - Posting page
  - option image upload
  - description (word limit of 300 characters, hashtags for search) 
  - categorization
  - terms/conditions (aka ebook) 
 


##TODO:
 - brainstorm
 - Split up roles
 - How are postings sorted?
  - Sean suggests some thing like [this](http://www.craigslist.org/about/help/repost)
 - think of catchy, not too corny list
  - exeter-list
  - lionslist
