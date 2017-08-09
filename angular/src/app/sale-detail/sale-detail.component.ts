import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Location } from '@angular/common';

import { Sale } from '../_models/sale';
import { SaleService } from '../_services/sale.service';
import {User} from "../_models/user";
import {UserService} from "../_services/user.service";
import {CurrentUserService} from "../_services/currentuser.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Potential_buyer} from "../_models/potential_buyer";
import {Message} from "../_models/message";
import {PotentialBuyerService} from "../_services/potential_buyer.service";
import { MessageService } from '../_services/message.service';


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
  saleForm: FormGroup;
  rate = ['1', '2', '3', '4', '5'];

  potential_buyer_instance_array: Potential_buyer[];
  potential_buyer_instance: Potential_buyer;
  message: Message;
  private new_message: string = "";


  createRequest = {
    comment: '',
    rate: this.rate[0],
  };

  lat: number;
  lng: number;

  constructor(private saleService: SaleService,
              private route: ActivatedRoute,
              private location: Location,
              private userService: CurrentUserService,
              private router: Router,
              private potentialBuyerService: PotentialBuyerService,
              private messageService: MessageService,) {
  }

  ngOnInit(): any {
    this.saleForm = new FormGroup({
      'comment': new FormControl(this.createRequest.comment),
      'rate': new FormControl(this.createRequest.rate)
    });

    this.route.paramMap
      .switchMap((params: ParamMap) => this.saleService.getPublicSaleDetails(+params.get('id')))
      .subscribe(sale => {
        this.sale = sale;
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


  add(): void {
    if (this.saleForm.valid) {
      this.saleService.addRating(
        this.sale["id"],
        this.saleForm.get('comment').value,
        this.saleForm.get('rate').value)
        .then(sale => {
          alert("Seller has been rated!")
          location.reload()
        }).catch(error => {
          alert("This post has already been rated")

        }
      );

    }
  }

  goBack(): void {
    this.location.back();
  }

  private loadSelf() {
    this.userService.getUser().then((user: User) => {
      this.currentUser = user;
      this.has_user_loaded = true;
    }).catch(err => {
      this.has_user_loaded = true;
    });
  }

  createMessage(): void {
    console.log(this.sale);
    console.log(this.sale["id"]);
    console.log(this.sale["owner_id"]);
    console.log("Verify current user id: " + this.sale["owner_id"]);
    console.log("Verify message is sent to user: " + this.sale["id"]);
    console.log("Verify this conversation is regarding to post: " + this.sale["id"]);
    console.log("Verify message content: " + this.new_message);
    if (this.sale["owner_id"] == this.currentUser.id) {
      alert("This is your own posting!");
      return;
    }
    else {
      var message_data_to_send = JSON.stringify({
        body: this.new_message,
        receiver_id: this.sale["owner_id"],
        post_id: this.sale["id"]
      });
      this.messageService.create(message_data_to_send).subscribe(message => this.message = message);
    }
  }
}


