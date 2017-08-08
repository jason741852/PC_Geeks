import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';

import { Sale } from '../_models/sale';
import { SaleService } from '../_services/sale.service';
import {Image} from "../_models/image";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  sales: Sale[];
  saleForm: FormGroup;
  manufacturer = [' ', 'AMD', 'Asus', 'ATI',
'BFG', 'Biostar', 'Club 3D', 'Corsair', 'Dell', 'Diamond', 'ECS', 'EVGA', 'Gainward',
'GALAX', 'Galaxy', 'Gigabyte', 'HIS', 'HP', 'Inno3D', 'Jaton', 'KFA2', 'Lenovo', 'MSI',
'NVIDIA', 'OcUK', 'Palit', 'PNY', 'PowerColor', 'Sapphire', 'Sparkle', 'VisionTek', 'XFX', 'Zogis', 'Zotac'];

  quality = [' ', 'Excellent', 'Very Good', 'Good', 'Average', 'Poor'];

  category = [' ', 'CPU', 'CPU Cooler', 'Motherboard', 'Memory', 'Storage', 'VideoCard', 'Power Supply', 'Case'];

  createRequest = {
      title: '',
      item: '',
      images1: '',
      images2: '',
      images3: '',
      images4: '',
      images5: '',
      category: this.category[0],
      quality: this.quality[0],
      manufacturer: this.manufacturer[0],
      price: '',
      location: '',
      body: ''
  };

  constructor(
        private router: Router,
        private saleService: SaleService) { };

  getSales(): void {
    this.saleService.getSales().then(sales => this.sales = sales);
  }

  ngOnInit(): void {
    this.getSales();
    this.saleForm = new FormGroup({
    'title': new FormControl(this.createRequest.title, [Validators.required]),

    'item': new FormControl(this.createRequest.item, [Validators.required]),
    'images1': new FormControl(this.createRequest.images1),
    'images2': new FormControl(this.createRequest.images2),
    'images3': new FormControl(this.createRequest.images3),
    'images4': new FormControl(this.createRequest.images4),
    'images5': new FormControl(this.createRequest.images5),


    'category': new FormControl(this.createRequest.category),
    'quality': new FormControl(this.createRequest.quality),
    'manufacturer': new FormControl(this.createRequest.manufacturer),
    'price': new FormControl(this.createRequest.price, [Validators.required, Validators.min(0),
    Validators.pattern('[0-9]+')]),
    'location': new FormControl(this.createRequest.location, Validators.required),
    'body': new FormControl(this.createRequest.body)
  });
  }

  add(): void {
   this.saleService.create(
      this.saleForm.get('item').value,
      this.saleForm.get('title').value,
      this.saleForm.get('category').value,
      this.saleForm.get('quality').value,
      this.saleForm.get('manufacturer').value,
      this.saleForm.get('price').value,
      this.saleForm.get('location').value,
      this.saleForm.get('body').value)
      .then(sale => {
        console.log(this.saleForm.get('images1').value)
        if (this.saleForm.get('images1').value != '') {
          this.saleService.createImages(
            sale.id,
            this.saleForm.get('images1').value)
            .then(getImage => {
            });
        }
        if (this.saleForm.get('images2').value != '') {
          this.saleService.createImages(
            sale.id,
            this.saleForm.get('images2').value)
            .then(getImage => {
            });
        }
        if (this.saleForm.get('images3').value != '') {
          this.saleService.createImages(
            sale.id,
            this.saleForm.get('images3').value)
            .then(getImage => {
            });
        }
        if (this.saleForm.get('images4').value != '') {
          this.saleService.createImages(
            sale.id,
            this.saleForm.get('images4').value)
            .then(getImage => {
            });
        }
        if (this.saleForm.get('images5').value != '') {
          this.saleService.createImages(
            sale.id,
            this.saleForm.get('images5').value)
            .then(getImage => {
            });
        }
      });



  }

  get title() { return this.saleForm.get('title'); }
  get item() { return this.saleForm.get('item'); }
  get images1() { return this.saleForm.get('images1'); }
  get images2() { return this.saleForm.get('images2'); }
  get images3() { return this.saleForm.get('images3'); }
  get images4() { return this.saleForm.get('images4'); }
  get images5() { return this.saleForm.get('images5'); }

  get location() { return this.saleForm.get('location'); }
  //get category() { return this.saleForm.get('category'); }
  //get quality() { return this.saleForm.get('quality'); }
  get price() { return this.saleForm.get('price'); }
  get body() { return this.saleForm.get('body'); }

}
