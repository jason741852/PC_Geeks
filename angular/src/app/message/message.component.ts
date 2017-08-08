import { Component, OnInit } from '@angular/core';

import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';

import { FormsModule } from '@angular/forms';

import { User } from '../_models/user';
import { CurrentUserService } from '../_services/currentuser.service';

import { Sale } from '../_models/sale';
import { SaleService } from '../_services/sale.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  currentUser: User;
  message: Message;
  sale: Sale;
  receipt: Message;
  convo: Message[] = [];
  messages: Message[] = [];
  private new_message: string = "";
  private post_to_send;
  private new_message_receiver;

  constructor(
    private messageService: MessageService,
    private currentuserService: CurrentUserService,
    private saleService: SaleService
  ) { }

  ngOnInit():any {
    this.messageService.getConvoHeads().subscribe(messages => {this.messages = messages; return this.messages}, error => console.log("Error: ", error), () => this.getPostTitle());

    this.currentuserService.getUser().then((user: User) => this.currentUser = user);
  }

  //  For each message in this.messages, get the sale.item and store it in this.message[i].post_item
  getPostTitle(){
    // console.log(this.messages);
    // var aaa;
    // var arrayLength = this.messages.length;
    // for (var i = 0; i < arrayLength; i++) {
    //   this.saleService.getPublicSaleDetails(this.messages[i].post_id)
    //   .then(sale => this.messages[i].post_item = sale.item);
    // }
  }

  getConversation(post_id: number, owner: number, receiver_id: number){
    console.log(this.messages);

    if (this.currentUser.id == receiver_id){
      this.new_message_receiver = owner;
    }else{
      this.new_message_receiver = receiver_id;
    }


    this.post_to_send = post_id;
    this.messageService.getConversation(post_id, owner).subscribe(convo => this.convo = convo);
  }

  createMessage(first_message: Message){
    console.log("Verify current user id: " + this.currentUser.id);
    console.log("Verify message is sent to user: " + this.new_message_receiver);
    console.log("Verify this conversation is regarding to post: " + this.post_to_send);
    console.log("Verify message content: " + this.new_message);

    var message_data_to_send = JSON.stringify({body: this.new_message, receiver_id: this.new_message_receiver, parent_message: 1, post_id:this.post_to_send});

    this.messageService.create(message_data_to_send).subscribe(receipt => this.receipt = receipt, this.ngOnInit());

  }

}
