import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Sale } from '../_models/sale';
import { SaleService } from '../_services/sale.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  sales: Sale[];
  selectedSale: Sale;

  manufacturers = [' ', 'AMD', 'Asus', 'ATI',
'BFG', 'Biostar', 'Club 3D', 'Corsair', 'Dell', 'Diamond', 'ECS', 'EVGA', 'Gainward',
'GALAX', 'Galaxy', 'Gigabyte', 'HIS', 'HP', 'Inno3D', 'Jaton', 'KFA2', 'Lenovo', 'MSI',
'NVIDIA', 'OcUK', 'Palit', 'PNY', 'PowerColor', 'Sapphire', 'Sparkle', 'VisionTek', 'XFX', 'Zogis', 'Zotac']

  quality = [' ', 'Excellent', 'Very Good', 'Good', 'Average', 'Poor']

  constructor(
        private router: Router,
        private saleService: SaleService) { }

  getSales(): void {
    this.saleService.getSales().then(sales => this.sales = sales);
  }

  ngOnInit(): void {
    this.getSales();
  }

  add(title: string, item: string, category: string,
      quality: string, price: number): void {
  item.toUpperCase();
  this.saleService.create(title, item, category, quality, price)
    .then(sale => {
      this.sales.push(sale);
      this.selectedSale = null;
    });
  }
}
