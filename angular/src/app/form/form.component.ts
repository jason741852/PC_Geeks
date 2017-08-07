import { NgModule, Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';

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
  manufacturer = [' ', 'AMD', 'Asus', 'ATI',
'BFG', 'Biostar', 'Club 3D', 'Corsair', 'Dell', 'Diamond', 'ECS', 'EVGA', 'Gainward',
'GALAX', 'Galaxy', 'Gigabyte', 'HIS', 'HP', 'Inno3D', 'Jaton', 'KFA2', 'Lenovo', 'MSI',
'NVIDIA', 'OcUK', 'Palit', 'PNY', 'PowerColor', 'Sapphire', 'Sparkle', 'VisionTek', 'XFX', 'Zogis', 'Zotac'];

  quality = [' ', 'Excellent', 'Very Good', 'Good', 'Average', 'Poor'];

  category = [' ', 'CPU', 'CPU Cooler', 'Motherboard', 'Memory', 'Storage', 'VideoCard', 'Power Supply', 'Case'];

  createRequest = {
      item: '',
      category: this.category[0],
      quality: this.quality[0],
      manufacturer: this.manufacturer[0],
      price: '',
      location: '',
      body: ''
  };

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;



  constructor(
        private router: Router,
        private saleService: SaleService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone
  ) { };

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
      Validators.pattern('[0-9]+')]),
      'location': new FormControl(this.createRequest.location, Validators.required),
      'body': new FormControl(this.createRequest.body)
    });
    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

    private setCurrentPosition() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 12;
        });
      }
    }

  add(): void {
    this.saleService.create(
    this.saleForm.get('item').value,
    this.saleForm.get('category').value,
    this.saleForm.get('quality').value,
    this.saleForm.get('manufacturer').value,
    this.saleForm.get('price').value,
    this.saleForm.get('location').value,
    this.saleForm.get('body').value)
      .then(sale => {
        this.sales.push(sale);
        // this.latitude.push(sale);
        // this.longitude.push(sale);
        this.selectedSale = null;
      });
  }
  get item() { return this.saleForm.get('item'); }
  get location() { return this.saleForm.get('location'); }
  //get category() { return this.saleForm.get('category'); }
  //get quality() { return this.saleForm.get('quality'); }
  get price() { return this.saleForm.get('price'); }
  get body() { return this.saleForm.get('body'); }

}
