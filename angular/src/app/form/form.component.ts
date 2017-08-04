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

  category = [' ', 'CPU', 'CPU Cooler', 'Motherboard', 'Memory', 'Storage', 'Video Card', 'Power Supply', 'Case']

  constructor(
        private router: Router,
        private saleService: SaleService) { }

  getSales(): void {
    this.saleService.getSales().then(sales => this.sales = sales);
  }

  ngOnInit(): void {
    this.getSales();
  }

  add(item: string,
      category: string,
      quality: string,
      manufacturer: string,
      price: number): void {
    this.saleService.create(item, category, quality, manufacturer, price)
      .then(sale => {
        this.sales.push(sale);
        this.selectedSale = null;
      });
  }
}
