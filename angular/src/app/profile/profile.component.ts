import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
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
    private userService: UserService
  ) {
}

  ngOnInit() {
    this.loadAllUsers();
    this.loadSelf();
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
  private loadSelf() {
    this.userService.getSelf().subscribe(currentUser => { this.currentUser = currentUser; });
  }

  goBack(): void {
    this.location.back();
  }


}
