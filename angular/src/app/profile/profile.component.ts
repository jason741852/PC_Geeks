import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/currentuser.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from "../_services/alert.service";

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User;

  confirm_deletion = false;
  password: any;
  error_messages: any = {};

  constructor(
    private location: Location,
    private auth: AuthenticationService,
    private userService: CurrentUserService,
    private alertService: AlertService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadSelf();
  }

  editUser() {
    this.router.navigate(['/editprofile']);
  }

  changePassword() {
    this.router.navigate(['/changepassword']);
  }

  deleteUser() {
    this.auth.login(this.currentUser.username, this.password).subscribe(
      res => {
        this.userService.delete().then(
          res => this.auth.logout()
        ).catch(
          err => this.alertService.error('Sorry! We could not delete your account. Error: ' + err)
        );
      },
      err => {
        let msg = err.json();
        if (msg.non_field_errors) {
          this.error_messages.password = err.json().non_field_errors;
        }
        else{
          this.error_messages.password = err.json();
        }
      }
    );
  }

  private loadSelf() {
    this.userService.getUser().then((user: User) => this.currentUser = user);
  }

  goBack(): void {
    this.location.back();
  }

  displayDeleteUserConfirmation(val: boolean) {
      this.confirm_deletion = val;
  }

}
