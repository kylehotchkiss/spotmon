# SpotMON
SpotMON is a service that keeps an eye on your SPOT's tracking feature. This is different than the check in and custom message features. This was created more for throwing SPOT trackers onto things you can't directly access. 

It polls the SPOT api every 30 seconds and then it sends you a nice email with a map, along with some sanity checks to help you decide if the data is reliable enough to make decisions off of. 

This repo is for the daemon, that is created to work on Heroku. If you're looking to use SpotMON, [please drop your tracking key and email address in the website](http://spotmon.hotchkissmade.com).

## SPOT Sharing Page Configuration
Here is the ideal setup if you plan on using this:

 * Make sure that the sharing page is public (meaning no password).
 * Only setup one tracker per sharing page.
 * Uncheck all points other than "tracking"
 * Only show the past 24 hours of points.

## Installation

### Configuration

Either in `.env` or `heroku config`, you will need the following variables to run SpotMON:

    MAPBOX_KEY: 
    
    COUCHDB_HOST: 
    COUCHDB_PASS: 
    COUCHDB_PORT: 
    COUCHDB_USER: 
    
    MAILGUN_FROM: 
    MAILGUN_KEY:  
    MAILGUN_URL:  
    
### Starting Daemon

On heroku -

 `git push heroku master`
 
or for you hipsters -
 
 `foreman start`
 
### Interface

You will need to create an interface that creates a SpotMON-compliant object containing a few variables that are needed to run.
