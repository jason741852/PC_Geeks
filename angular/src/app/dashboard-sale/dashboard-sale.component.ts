import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { Sale } from '../_models/sale';
import { SaleService } from '../_services/sale.service';

@Component({
  selector: 'app-dashboard-sale',
  templateUrl: './dashboard-sale.component.html',
  styleUrls: ['./dashboard-sale.component.css'],
})
export class DashboardSaleComponent implements OnInit {
  sell = 'selling';
  sales: Sale[] = [];
  image: string;

  //List Classes
  /*
  listProperty:boolean = false;
  imgProperty:boolean = false;
  divProperty:boolean = false;
  setRow(){
    let classes= {
      listclass: this.listProperty,
    }
    return classes;
  }
  setImg(){
    let classes={
      imgResize: this.imgProperty,
    }
    return classes;
  }
  setCol(){
    let classes={
      divResize: this.divProperty,
    }
    return classes;
  }
  */

  constructor(private saleService: SaleService, private router: Router) { }

  ngOnInit(): void {
    //this.image = 'https://www.w3schools.com/images/w3schools_green.jpg'
    this.saleService.getSales()
      .then(sales => this.sales = sales);

  }
  search(saleItem: string) {
    this.router.navigate(['/dashboard/' + saleItem])
    location.reload()
  }
  
}
