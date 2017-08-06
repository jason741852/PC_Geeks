import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Potential_buyer } from '../_models/potential_buyer';
import { User } from '../_models/user';


@Injectable()
export class PotentialBuyerService{
  private createUrl = 'http://localhost:4200/api/potential_buyer/new/';

  constructor(private http: Http) {}


  create(post_id: number): Promise<Potential_buyer>{
    return this.http
      .post(this.createUrl, JSON.stringify({post_id:post_id}), this.createHeader())
      .toPromise()
      .then(res => res.json().data as Potential_buyer)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
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
