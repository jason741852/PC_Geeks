import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../_services/index';


@Component({
  moduleId: module.id,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthenticationService) {
  }

  ngOnInit() {

  }

  logout() {
    this.auth.logout();
  }

}
