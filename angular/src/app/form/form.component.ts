import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';

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
  saleForm: FormGroup;
  manufacturers = [' ', 'AMD', 'Asus', 'ATI',
'BFG', 'Biostar', 'Club 3D', 'Corsair', 'Dell', 'Diamond', 'ECS', 'EVGA', 'Gainward',
'GALAX', 'Galaxy', 'Gigabyte', 'HIS', 'HP', 'Inno3D', 'Jaton', 'KFA2', 'Lenovo', 'MSI',
'NVIDIA', 'OcUK', 'Palit', 'PNY', 'PowerColor', 'Sapphire', 'Sparkle', 'VisionTek', 'XFX', 'Zogis', 'Zotac'];

  quality = [' ', 'Excellent', 'Very Good', 'Good', 'Average', 'Poor'];

  category = [' ', 'CPU', 'CPU Cooler', 'Motherboard', 'Memory', 'Storage', 'Video Card', 'Power Supply', 'Case'];

  createRequest = { 
      item: '',
      category: this.category[0],
      quality: this.quality[0],
      manufacturer: this.manufacturers[0],
      price: ''};

  constructor(
        private router: Router,
        private saleService: SaleService) { };

  getSales(): void {
    this.saleService.getSales().then(sales => this.sales = sales);
  }

  ngOnInit(): void {
    this.getSales();
    this.saleForm = new FormGroup({
    'item': new FormControl(this.createRequest.item, [Validators.required]),
    'category': new FormControl(this.createRequest.category),
    'quality': new FormControl(this.createRequest.quality),
    'manufacturer': new FormControl(this.createRequest.manufacturer),
    'price': new FormControl(this.createRequest.price, [Validators.required, Validators.min(0),
    Validators.pattern('0-9')])
  });
  }

  add(): void {
    this.saleService.create(
    this.saleForm.get('item').value, 
    this.saleForm.get('category').value, 
    this.saleForm.get('quality').value,
    this.saleForm.get('manufacturer').value,
    this.saleForm.get('price').value)
      .then(sale => {
        this.sales.push(sale);
        this.selectedSale = null;
      });
  }
  get item() { return this.saleForm.get('item'); }
  get price() { return this.saleForm.get('price'); } 
}
