/*
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app-navbar',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './navbar.component.css'
  ],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  filter: string;

  private menuItemsArray: any[] = [
    {'title': 'Categories', 'link': '#',
      'subItems': [
        {'title': 'CPU', 'link': '#'},
        {'title': 'Video Card', 'link': '#' },
      ]
    },
    {'title': 'Manufacturers', 'link': '#',
      'subItems': [
      ]
    },
  ];

  constructor(private router: Router,

  ) {}
  public onMenuClose() {
    console.log('menu closed');
  }
  public onMenuOpen() {
    console.log('menu Opened');
  }
  private onItemSelect(item: any) {
    if (item.title === 'CPU') {
      this.filter = 'category'
      this.router.navigate(['/dashboard/CPU'])
      location.reload()
    }
    if (item.title === 'Video Card') {
      this.router.navigate(['/dashboard/VideoCard'])
      location.reload()
    }
  }
  public ngOnInit() {

  }

}
