import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Sale } from '../_models/sale';
import { SaleService } from '../_services/sale.service';

import { Potential_buyer } from '../_models/potential_buyer';
import { PotentialBuyerService } from '../_services/potential_buyer.service';

import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {
    sale: Sale;
    potential_buyer_instance_array: Potential_buyer[];
    potential_buyer_instance: Potential_buyer;
    params: ParamMap;

    constructor(
      private saleService: SaleService,
      private route: ActivatedRoute,
      private location: Location,
      private potentialBuyerService: PotentialBuyerService,
      private messageService: MessageService

    ) {}

    ngOnInit(): any {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.saleService.getSale(+params.get('id')))
        .subscribe(sale => this.sale = sale);
      }

    potential_buyer(): void{
      console.log(this.sale);
      console.log(this.sale["id"]);
      console.log(this.sale["owner_id"]);


      this.potentialBuyerService.create(this.sale["id"]);
      var response = this.messageService.initMessage(this.sale["owner_id"], this.sale["id"]);
      console.log(response);

    }

    goBack(): void {
      this.location.back();
    }

}
