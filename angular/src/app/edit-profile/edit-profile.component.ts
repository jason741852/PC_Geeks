import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/currentuser.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  currentUser: User;
  model: any = {};
  loading = false;
  error_messages: any = {};

  constructor(
    private userService: CurrentUserService,
    private router: Router,
    private alertService: AlertService
  ) {
}

  ngOnInit() {
    this.loadSelf();
  }

  private loadSelf() {
    this.userService.getUser().then((currentUser: User) => { this.currentUser = currentUser; });
  }

  update() {
    this.loading = true;
    this.userService.update(this.model)
      .then(() => {
        this.alertService.success('Your profile has been updated!', true);
        this.router.navigate(['/profile']);
      }, (error: any) => {
        this.error_messages = error.json();
        this.loading = false;
      });
  }




}
