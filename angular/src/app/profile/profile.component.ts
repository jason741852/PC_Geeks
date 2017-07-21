import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { AuthenticationService } from '../../app/service/authentication.service'

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {

  }

  goBack(): void {
    this.location.back();
  }
  getInfo(): void {
    this.auth.getInfo();
  }
}
