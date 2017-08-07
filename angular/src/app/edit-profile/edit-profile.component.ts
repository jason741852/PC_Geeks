import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/currentuser.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  registerForm: FormGroup;
  currentUser: User;
  users: User[] = [];
  model: any = {};
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    private userService: CurrentUserService,
    private router: Router,
    private alertService: AlertService
  ) {
}

  ngOnInit() {
    this.loadSelf();
  }

  deleteUser(id: number) {
    this.userService.delete().then(() => {
        // notify the user? redirect to main page?
    });
    this.logout();
  }

  logout(){
    this.auth.logout();
  }

  private loadSelf() {
    this.userService.getUser().then((currentUser: User) => { this.currentUser = currentUser; });
  }

  goBack(): void {
    this.location.back();
  }
  update() {
    this.loading = true;
    this.userService.update(this.model)
      .then(() => {
        this.alertService.success('Registration successful', true);
        this.router.navigate(['/profile']);
      }, (error: any) => {
        this.alertService.error(error);
        this.loading = false;
      });
  }




}
