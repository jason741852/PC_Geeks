import { Component, OnInit } from '@angular/core';

import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';

import { FormsModule } from '@angular/forms';

import { User } from '../_models/user';
import { CurrentUserService } from '../_services/currentuser.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  currentUser: User;
  message: Message;
  receipt: Message;
  convo: Message[] = [];
  messages: Message[] = [];
  private new_message: string = "";

  constructor(
    private messageService: MessageService,
    private currentuserService: CurrentUserService
  ) { }

  ngOnInit():any {
    this.messageService.getConvoHeads().subscribe(messages => this.messages = messages);
    this.currentuserService.getUser().then((user: User) => this.currentUser = user);
  }

  getConversation(post_id: number, buyer_id: number){
    console.log(post_id);
    this.messageService.getConversation(post_id, buyer_id).subscribe(convo => this.convo = convo)
  }

  createMessage(first_message: Message){
    console.log(first_message);
    console.log(this.currentUser.id);

    var receiver_id;
    if (this.currentUser.id == parseInt(first_message.owner)){
      receiver_id = first_message.receiver_id;
    }else{
      receiver_id = first_message.owner;
    }
    console.log(receiver_id);

    console.log(this.new_message);

    var message_data_to_send = JSON.stringify({body: this.new_message, receiver_id: receiver_id, parent_message: 1, post_id:first_message.post_id});

    this.messageService.create(message_data_to_send).subscribe(receipt => this.receipt = receipt);

  }

}
