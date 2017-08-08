import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/currentuser.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';
import { isNullOrUndefined } from "util";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  currentUser: User;
  model: any = {};
  error_messages: any = {};

  loading = false;
  has_user_loaded = false;
  login_failed = false;

  constructor(
    private userService: CurrentUserService,
    private authService: AuthenticationService,
    private router: Router,
    private alertService: AlertService
  ) {
}

  ngOnInit() {
    this.loadSelf();
  }

  private loadSelf() {
    this.userService.getUser().then((currentUser: User) => {
      this.currentUser = currentUser;
      this.has_user_loaded = true;
    }).catch(err => this.has_user_loaded = true);
  }

  update() {
    if (!this.passwordMismatch()) {
      this.login_failed = false;
      this.loading = true;
      this.authService.login(this.currentUser.username, this.model.current_password)
        .subscribe(user => {
          delete this.model.confirm_password;
          this.userService.update(this.model)
            .then(() => {
              this.alertService.success('Your profile has been updated!', true);
              this.router.navigate(['/profile']);
            }, (error: any) => {
              this.error_messages = error.json();
              this.loading = false;
            });
        }, error => {
            this.login_failed = true;
            this.loading = false;

            delete this.model.current_password;
            delete this.model.password;
            delete this.model.confirm_password;
        });
    }
  }

  passwordMismatch() {
    return this.model.password != this.model.confirm_password;
  }

  private userExists() {
    return isNullOrUndefined(this.currentUser);
  }

  private notLoading() {
    return !this.loading;
  }
}
