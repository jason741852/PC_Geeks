import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/currentuser.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  registerForm: FormGroup;
  currentUser: User;
  users: User[] = [];


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    private userService: CurrentUserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadSelf();
  }

  deleteUser(id: number) {
    this.userService.delete();
    this.logout();
  }

  editUser(id: number) {
    this.router.navigate(['/editprofile'])

  }
  logout(){
    this.auth.logout();
  }

  private loadSelf() {
    this.userService.getUser().then((user: User) => this.currentUser = user);
  }
}
