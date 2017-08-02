import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Sale } from '../sale';
import { SaleService } from '../sale.service';
@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {
    sale: Sale;
    params: ParamMap;


    constructor(
      private saleService: SaleService,
      private route: ActivatedRoute,
      private location: Location
    ) {}

    ngOnInit(): any {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.saleService.getSale(+params.get('id')))
        .subscribe(sale => this.sale = sale);
      }

    goBack(): void {
      this.location.back();
    }

}