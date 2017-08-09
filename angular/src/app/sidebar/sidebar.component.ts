import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../_services/authentication.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
      public auth: AuthenticationService
  ) {}

    ngOnInit() {}

    sideBar_open() {
        document.getElementById("mySidebar").style.display = "block";
    }

    sideBar_close() {
        document.getElementById("mySidebar").style.display = "none";
    }

}
