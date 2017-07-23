import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { AlertService, AuthenticationService } from '../_services/index';

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
    private userService: UserService
  ) {
  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
}

  ngOnInit() {
    this.loadAllUsers();
  }

  deleteUser(id: number) {
    confirm("Are you sure you want to delete?");
    this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    this.logout();
  }
  logout(){
    this.auth.logout();

  }

  private loadAllUsers() {
    this.userService.getAll().subscribe(users => { this.users = users; });
  }

  goBack(): void {
    this.location.back();
  }


}
