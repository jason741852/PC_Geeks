import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Sale } from '../sale';
import { SaleService } from '../sale.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  sales: Sale[];
  selectedSale: Sale;

  constructor(
        private router: Router,
        private saleService: SaleService) { }

  getSales(): void {
    this.saleService.getSales().then(sales => this.sales = sales);
  }

  ngOnInit(): void {
    this.getSales();
  }

  onSelect(sale: Sale): void {
  this.selectedSale = sale;
  }


}
