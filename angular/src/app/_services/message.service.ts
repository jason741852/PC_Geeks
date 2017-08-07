import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Potential_buyer } from '../_models/potential_buyer';
import { User } from '../_models/user';
import { Message } from '../_models/message';

@Injectable()
export class MessageService {
  private baseUrl = 'http://localhost:4200/api/messaging/';

  constructor(private http: Http) {}

  getConvoHeads(){
    return this.http.get(
        this.baseUrl + "show/",
        this.createHeader()).map(
            (response: Response) => response.json() as Message[]
        );
  }

  create(message: Message){
    return this.http.post(
      this.baseUrl + "new/",
      message,
      this.createHeader()).map(
          (response: Response) => response.json()
    );
  }

  initMessage(receiver_id: number, post_id: number){
    var init_message = JSON.stringify({receiver_id: receiver_id, post_id: post_id, body:"Hi, I'm interested in your selling item!"});
    return this.http.post(
      this.baseUrl + "new/",
      init_message,
      this.createHeader()).map(
          (response: Response) => response.json()
    );
  }

  getConversation(post_id: number, buyer_id: number){
    return this.http.get(
      this.baseUrl + "post/" + post_id + "/buyer/" + buyer_id,
      this.createHeader()).map(
          (response: Response) => response.json() as Message[]
      );
  }



  // Creates Authorization header
  private createHeader() {
      let token = sessionStorage.getItem('token');
      if (token) {
          let headers = new Headers({ 'Authorization': 'Token ' + token });
          return new RequestOptions({ headers: headers });
      }
  }


}
