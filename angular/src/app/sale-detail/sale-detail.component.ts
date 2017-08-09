import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Location } from '@angular/common';

import { Sale } from '../_models/sale';
import { SaleService } from '../_services/sale.service';
import {User} from "../_models/user";
import {UserService} from "../_services/user.service";
import {CurrentUserService} from "../_services/currentuser.service";

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {
    sale: Sale;
    params: ParamMap;
    currentUser: User;
    has_user_loaded = false;

  lat: number;
    lng: number;

    constructor(
      private saleService: SaleService,
      private route: ActivatedRoute,
      private location: Location,
      private userService: CurrentUserService,
      private router: Router
    ) {}

    ngOnInit(): any {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.saleService.getPublicSaleDetails(+params.get('id')))
        .subscribe(sale => {this.sale = sale;
                            this.lat = +this.sale.latitude;
                            this.lng = +this.sale.longitude;
                            console.log(this.sale);
                            console.log(this.lat);
                            console.log(this.lng);
                            });
      this.loadSelf();
     }

  private deletePost() {
    this.userService.deletePost(this.sale["id"]).then((sale: Sale) => {
      this.router.navigate(['/dashboard/'])
    }).catch(
    );
  }


  private loadSelf() {
    this.userService.getUser().then((user: User) => {
      this.currentUser = user;
      this.has_user_loaded = true;
    }).catch(err => {
      this.has_user_loaded = true;
    });
  }
}

