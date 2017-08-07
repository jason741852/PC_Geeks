import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SaleService } from '../_services/sale.service';
import { AlertService } from '../_services/alert.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  saleForm: FormGroup;
  manufacturer = ['AMD', 'Asus', 'ATI',
'BFG', 'Biostar', 'Club 3D', 'Corsair', 'Dell', 'Diamond', 'ECS', 'EVGA', 'Gainward',
'GALAX', 'Galaxy', 'Gigabyte', 'HIS', 'HP', 'Inno3D', 'Jaton', 'KFA2', 'Lenovo', 'MSI',
'NVIDIA', 'OcUK', 'Palit', 'PNY', 'PowerColor', 'Sapphire', 'Sparkle', 'VisionTek', 'XFX', 'Zogis', 'Zotac', 'Other'];

  quality = ['Excellent', 'Very Good', 'Good', 'Average', 'Poor'];

  category = ['CPU', 'CPU Cooler', 'Motherboard', 'Memory', 'Storage', 'VideoCard', 'Power Supply', 'Case'];

  createRequest = {
      item: '',
      category: this.category[0],
      quality: this.quality[0],
      manufacturer: this.manufacturer[0],
      price: '',
      location: '',
      body: ''
  };

  submitted = false;

  constructor(
        private router: Router,
        private saleService: SaleService,
        private alertService: AlertService) { };

  ngOnInit(): void {
    this.saleForm = new FormGroup({
    'item': new FormControl(this.createRequest.item, [Validators.required]),
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
    this.submitted = true;
    if (this.saleForm.valid) {
      this.saleService.create(
        this.saleForm.get('item').value,
        this.saleForm.get('category').value,
        this.saleForm.get('quality').value,
        this.saleForm.get('manufacturer').value,
        this.saleForm.get('price').value,
        this.saleForm.get('location').value,
        this.saleForm.get('body').value
      ).then(sale => {
        this.alertService.success('Your post has been created!', true);
        this.router.navigate(['/detail/' + sale.id]);
      }).catch(error => {
        console.log(error);
      });
    }
  }
  get item() { return this.saleForm.get('item'); }
  get location() { return this.saleForm.get('location'); }
  //get category() { return this.saleForm.get('category'); }
  //get quality() { return this.saleForm.get('quality'); }
  get price() { return this.saleForm.get('price'); }
  get body() { return this.saleForm.get('body'); }
  
}
