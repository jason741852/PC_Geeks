import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router,
  ) { }

  ngOnInit() {

  }

  cpuFilter() {
    this.router.navigate(['/dashboard/CPU'])
    location.reload()
  }

  videoCardFilter() {
    this.router.navigate(['/dashboard/VideoCard'])
    location.reload()
  }

}
