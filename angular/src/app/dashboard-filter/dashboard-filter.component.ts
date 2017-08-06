import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { Sale } from '../_models/sale';
import { SaleService } from '../_services/sale.service';
@Component({
  selector: 'app-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.css']
})
export class DashboardFilterComponent implements OnInit {

  sales: Sale[] = [];

  //category: string;
  make: string;
  filter: string;

  constructor(
        private saleService: SaleService,
        private route: ActivatedRoute,
        private router: Router
) { }

  ngOnInit(): void {

    this.saleService.getSales()
      .then(sales => this.sales = sales.slice(0));

    //this.category = this.concat + this.route.snapshot.params['category'];
    this.make = this.route.snapshot.params['make'];
    console.log(this.make);
  }
  search(saleItem: string) {
    this.router.navigate(['/dashboard/' + saleItem])
    location.reload()

  }
}

