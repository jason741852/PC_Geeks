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

import { User } from '../_models/user';
import { CurrentUserService } from '../_services/currentuser.service';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {
    currentUser: User;
    sale: Sale;
    potential_buyer_instance_array: Potential_buyer[];
    potential_buyer_instance: Potential_buyer;
    params: ParamMap;
    user = User;
    message: Message;
    private new_message: string = "";

    lat: number;
    lng: number;

    constructor(
      private saleService: SaleService,
      private route: ActivatedRoute,
      private location: Location,
      private potentialBuyerService: PotentialBuyerService,
      private messageService: MessageService,
      private currentuserService: CurrentUserService

    ) {}

    ngOnInit(): any {
      this.currentuserService.getUser().then((user: User) => this.currentUser = user);
      this.route.paramMap
        .switchMap((params: ParamMap) => this.saleService.getPublicSaleDetails(+params.get('id')))
        .subscribe(sale => {this.sale = sale;
                            this.lat = +this.sale.latitude;
                            this.lng = +this.sale.longitude;
                            console.log(this.sale);
                            console.log(this.lat);
                            console.log(this.lng);
                            });
     }

    createMessage(): void{
      console.log(this.sale);
      console.log(this.sale["id"]);
      console.log(this.sale["owner_id"]);

      console.log("Verify current user id: " + this.sale["owner_id"]);
      console.log("Verify message is sent to user: " + this.sale["id"]);
      console.log("Verify this conversation is regarding to post: " + this.sale["id"]);
      console.log("Verify message content: " + this.new_message);

      if(this.sale["owner_id"] ==this.currentUser.id ){
        alert("This is your own posting!");
        return;
      }
      else{
        var message_data_to_send = JSON.stringify({body: this.new_message, receiver_id: this.sale["owner_id"], post_id:this.sale["id"]});
        this.messageService.create(message_data_to_send).subscribe(message => this.message = message);
      }


      //this.potentialBuyerService.create(this.sale["id"]);
      //var response = this.messageService.initMessage(this.sale["owner_id"], this.sale["id"]);
      //console.log(response);

    }

    goBack(): void {
      this.location.back();
    }
}
