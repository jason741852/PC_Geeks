import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { Sale } from '../sale';
import { SaleService } from '../sale.service';
@Component({
  selector: 'app-dashboard-sale',
  templateUrl: './dashboard-sale.component.html',
  styleUrls: ['./dashboard-sale.component.css'],

})
export class DashboardSaleComponent implements OnInit {
  sales: Sale[] = [];

  constructor(private saleService: SaleService, private router: Router) { }

  ngOnInit(): void {
    this.saleService.getSales()
      .then(sales => this.sales = sales.slice(0));

  }
  search(saleItem: string) {
    this.router.navigate(['/dashboard/' + saleItem])
    location.reload()


  }
}
