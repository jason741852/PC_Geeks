/*
 * Angular 2 decorators and services
 */
import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import { Location } from '@angular/common';


@Component({
  moduleId: module.id,
  selector: 'app-navbar',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './navbar.component.css'
  ],
  templateUrl: './navbar.component.html'
})

export class NavbarComponent implements OnInit {
  private menuItemsArray: any[] = [
    {'title': 'Categories', 'link': '#',
      'subItems': [
        {'title': 'CPU', 'link': '#'},
        {'title': 'VideoCard', 'link': '#' },
        {'title': 'CPU Cooler', 'link': '#' },
        {'title': 'Motherboard', 'link': '#' },
        {'title': 'Memory', 'link': '#' },
        {'title': 'Storage', 'link': '#' },
        {'title': 'Power Supply', 'link': '#' },
        {'title': 'Case', 'link': '#' },
      ]
    },
    {'title': 'Manufacturers', 'link': '#',
      'subItems': [
        {'title': 'AMD', 'link': '#'},
        {'title': 'Asus', 'link': '#' },
        {'title': 'ATI', 'link': '#'},
        {'title': 'BFG', 'link': '#'},
        {'title': 'Biostar', 'link': '#'},
        {'title': 'Club 3D', 'link': '#'},
        {'title': 'Corsair', 'link': '#'},
        {'title': 'Dell', 'link': '#'},
        {'title': 'Diamond', 'link': '#'},
        {'title': 'ECS', 'link': '#'},
        {'title': 'EVGA', 'link': '#'},
        {'title': 'Gainward', 'link': '#'},
        {'title': 'GALAX', 'link': '#'},
        {'title': 'Galaxy', 'link': '#'},
        {'title': 'Gigabyte', 'link': '#'},
        {'title': 'HIS', 'link': '#'},
        {'title': 'HP', 'link': '#'},
        {'title': 'Inno3D', 'link': '#'},
        {'title': 'Jaton', 'link': '#'},
        {'title': 'KFA2', 'link': '#'},
        {'title': 'Lenovo', 'link': '#'},
        {'title': 'MSI', 'link': '#'},
        {'title': 'NVIDIA', 'link': '#'},
        {'title': 'OcUK', 'link': '#'},
        {'title': 'Palit', 'link': '#'},
        {'title': 'PNY', 'link': '#'},
        {'title': 'PowerColor', 'link': '#'},
        {'title': 'Sapphire', 'link': '#'},
        {'title': 'Sparkle', 'link': '#'},
        {'title': 'VisionTek', 'link': '#'},
        {'title': 'XFX', 'link': '#'},
        {'title': 'Zogis', 'link': '#'},
        {'title': 'Zotac', 'link': '#'},
      ]
    },
  ];

  public filter: string;
  constructor(
    private router: Router, 
    public auth: AuthenticationService,
    private location: Location
  ) {}
  public onMenuClose() {
    console.log('menu closed');
  }
  public onMenuOpen() {
    console.log('menu Opened');
  }

  private onItemSelect(item: any) {

    if (item.title === 'CPU') {
      this.router.navigate(['/dashboard/CPU'])
      location.reload()

    }
    if (item.title === 'Video Card') {
      this.router.navigate(['/dashboard/VideoCard'])
      location.reload()
    }else if (item.title === 'Manufacturers' || item.title === 'Categories') {

    }else {
      this.router.navigate(['/dashboard/' + item.title])
      location.reload()
    }
  }
  public ngOnInit() {
  }
  logout() {
    this.auth.logout();
  }
  
  sideBar_open() {
    document.getElementById("mySidebar").style.display = "block";
  }
  
  sideBar_close() {
    document.getElementById("mySidebar").style.display = "none";
  }

  goBack(): void {
    this.location.back();
  }

}
