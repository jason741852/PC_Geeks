import { Component, OnInit} from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { Sale } from '../sale';
import { SaleService } from '../sale.service';
@Component({
  selector: 'app-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.css']
})
export class DashboardFilterComponent implements OnInit {

  sales: Sale[] = [];

  //category: string;
  make: string;
  
  constructor(
        private saleService: SaleService,
        private route: ActivatedRoute,
) { }
  
  ngOnInit(): void {
    this.saleService.getSales()
      .then(sales => this.sales = sales.slice(0));

    //this.category = this.concat + this.route.snapshot.params['category'];
    this.make = this.route.snapshot.params['make'];
  }
}

