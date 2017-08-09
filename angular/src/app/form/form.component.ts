import { NgModule, Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';

import { SaleService } from '../_services/sale.service';
import { AlertService } from '../_services/alert.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  saleForm: FormGroup;
  images: any[] = [];
  manufacturer = ['AMD', 'Asus', 'ATI',
'BFG', 'Biostar', 'Club 3D', 'Corsair', 'Dell', 'Diamond', 'ECS', 'EVGA', 'Gainward',
'GALAX', 'Galaxy', 'Gigabyte', 'HIS', 'HP', 'Inno3D', 'Jaton', 'KFA2', 'Lenovo', 'MSI',
'NVIDIA', 'OcUK', 'Palit', 'PNY', 'PowerColor', 'Sapphire', 'Sparkle', 'VisionTek', 'XFX', 'Zogis', 'Zotac', 'Other'];

  quality = ['Excellent', 'Very Good', 'Good', 'Average', 'Poor'];

  category = ['CPU', 'CPU Cooler', 'Motherboard', 'Memory', 'Storage', 'VideoCard', 'Power Supply', 'Case'];

  title = ['Buying','Selling'];

  createRequest = {
      title: '',
      item: '',
      images: [],
      category: this.category[0],
      quality: this.quality[0],
      manufacturer: this.manufacturer[0],
      price: '',
      location: '',
      body: ''
  };

  submitted = false;

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;


  constructor(
        private router: Router,
        private saleService: SaleService,
        private alertService: AlertService,
        private loc: Location,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone
  ) { };


  ngOnInit(): void {
    this.saleForm = new FormGroup({
      'title': new FormControl(this.createRequest.title),
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
      this.submitted = true;
    if (this.saleForm.valid) {
      this.saleService.create(
        this.saleForm.get('item').value,
        this.saleForm.get('title').value,
        this.saleForm.get('category').value,
        this.saleForm.get('quality').value,
        this.saleForm.get('manufacturer').value,
        this.saleForm.get('price').value,
        this.saleForm.get('location').value,
        this.latitude = parseFloat(this.latitude.toFixed(3)),
        this.longitude = parseFloat(this.longitude.toFixed(3)),
        this.saleForm.get('body').value)
        .then(sale => {
          for (let i in this.images) {
            this.saleService.addImage(sale.id, this.images[i]);
          }
          this.alertService.success('Your post has been created!', true);
          this.loc.replaceState('/dashboard');
          this.router.navigate(['/detail/' + sale.id]);
        }).catch(error => {
          console.log(error);
        }
      );
    }
  }

  addImage(img: string) {
    if (this.images.length < 5) {
      this.images.push(img);
      img = '';
    }
    else {
      // error message here
    }
  }

  removeImage(url: string) {
    this.images.splice(this.images.indexOf(url), 1);
  }

  //get title() { return this.saleForm.get('title'); }
  get item() { return this.saleForm.get('item'); }
  get location() { return this.saleForm.get('location'); }
  //get category() { return this.saleForm.get('category'); }
  //get quality() { return this.saleForm.get('quality'); }
  get price() { return this.saleForm.get('price'); }
  get body() { return this.saleForm.get('body'); }

}
