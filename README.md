# PC Part Sale Website

### To run the web app:
1. Use `vagrant up` to launch the VM.
2. Use `vagrant ssh` to get into the VM, then `cd ~/angular/` and `ng serve` to run the Angular server.
3. Access `localhost:4200` on your host machine.
  1. To refresh the Django backend server, use `vagrant ssh` to get into the VM, then `sudo touch reload.ini` to restart the uWSGI server.
 


#PLEASE LOOK AT THE BRANCHES and NETWORK, WE ARE WORKING ON SEPERATE BRANCHES AND CAN'T MERGE IT INTO ONE BRANCH YET
#IF YOU WANT TO SEE A DEMO, GO INTO woody/chris/combined cd angular and run npm install > npm start
#Checkpoint text:
Look at Network to see the progress of the group

    Woody Chen Lin Chang: inside the http/dashboard/form and woody/chris/combined branches.
    Implemented the dashboard, form, detail, the components that make up the page, some css

    Chang Yook Ahn: inside the chang branch:
    The login feature has been implemented which includes the register feature and the view profile.
    In-progress: 1. The PC Parts rating feature 2.Change password 
    
    Alin Paunescu: alin-messaging branch and chris/vagrant branch and userlogin branch.
    Django Backend DB. Django API, GET, POST, DELETE, user ownership, models.
    
    Brandon Tuong Quan Nguyen: brandon/googlemapsapi branch
    Implemented map to show the location of a sale post, using Google Maps API