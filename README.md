# PC Part Sale Website

### To run the web app:
1. Use `vagrant up` to launch the VM.
2. Use `vagrant ssh` to get into the VM, then `cd ~/angular/` and `ng serve` to run the Angular server.
3. Access `localhost:4200` on your host machine.
  1. To refresh the Django backend server, use `vagrant ssh` to get into the VM, then `sudo touch reload.ini` to restart the uWSGI server.
