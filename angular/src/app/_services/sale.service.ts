import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Sale } from '../_models/sale';
// import { SALES } from './mock-sales';

@Injectable()
export class SaleService {

  private salesUrl = 'http://localhost:4200/api/all-posts/';  // URL to web api
  private eachUrl = 'http://localhost:4200/api/posts/';
  constructor(private http: Http) { }

  getSales(): Promise<Sale[]> {
    return this.http.get(this.salesUrl)
      .toPromise()
      .then(response => response.json() as Sale[])
      .catch(this.handleError);
    // return Promise.resolve(SALES);
  }

  getSale(id: number): Promise<Sale> {
    // return this.getSales()
    // .then(sales => sales.find(sale => sale.id === id));
    const url = `${this.eachUrl}${id}`;
    return this.http.get(url, this.createHeader())
      .toPromise()
      .then(response => response.json() as Sale)
      .catch(this.handleError);
  }
  // ------
  create(item: string,
         category: string,
         quality: string,
         manufacturer: string,
         price: number,
        body: string): Promise<Sale> {
    return this.http
      .post(this.eachUrl, JSON.stringify({item: item,
        category: category, quality: quality, manufacturer: manufacturer, price: price, body: body}), 
          this.createHeader())
      .toPromise()
      .then(res => res.json().data as Sale)
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
