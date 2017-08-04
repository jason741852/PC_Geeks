import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { Sale } from '../_models/sale';
import { SaleService } from '../_services/sale.service';

@Component({
  selector: 'app-list-sale',
  templateUrl: './list-sale.component.html',
  styleUrls: ['./list-sale.component.css'],
})
export class ListSaleComponent implements OnInit {
  sales: Sale[] = [];

  constructor(private saleService: SaleService, private router: Router) { }

  ngOnInit(): void {
    this.saleService.getSales()
      .then(sales => this.sales = sales);

  }
  search(saleItem: string) {
    this.router.navigate(['/list/' + saleItem])
    location.reload()
  }
}
