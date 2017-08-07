import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/currentuser.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User;


  constructor(
    private location: Location,
    private auth: AuthenticationService,
    private userService: CurrentUserService,
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
    this.userService.delete();
    this.logout();
  }


  logout(){
    this.auth.logout();
  }

  private loadSelf() {
    this.userService.getUser().then((user: User) => this.currentUser = user);
  }

  goBack(): void {
    this.location.back();
  }



}
