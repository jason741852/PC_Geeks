import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Location } from '@angular/common';

import { Sale } from '../_models/sale';
import { SaleService } from '../_services/sale.service';
import {Image} from "../_models/image";
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
    lat: number;
    lng: number;
    currentUser:User

    constructor(
      private saleService: SaleService,
      private userService: CurrentUserService,
      private route: ActivatedRoute,
      private location: Location,
      private router: Router,
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
      this.userService.getUser().then((user: User) => this.currentUser = user);

     }

    goBack(): void {
      this.location.back();
    }
    deletePost() {
      this.userService.deletePost(this.sale["id"]);
      this.router.navigate(['/dashboard/'])
    }
}
