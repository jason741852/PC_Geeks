import { Component, OnInit } from '@angular/core';

import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';

import { FormsModule } from '@angular/forms';

import { User } from '../_models/user';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  currentUser: User;
  message: Message;
  convo: Message[] = [];
  messages: Message[] = [];
  private new_message: string = "";

  constructor(
    private messageService: MessageService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
 }

  ngOnInit():any {
    this.messageService.getConvoHeads().subscribe(messages => this.messages = messages)
  }

  getConversation(post_id: number, buyer_id: number){
    console.log(post_id);
    this.messageService.getConversation(post_id, buyer_id).subscribe(convo => this.convo = convo)
  }

  createMessage(first_message: Message){
    console.log(first_message);
    console.log(this.currentUser);

    console.log(this.new_message);
  }

}
