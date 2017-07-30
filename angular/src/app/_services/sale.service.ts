import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Sale } from '../_models/sale';
// import { SALES } from './mock-sales';

@Injectable()
export class SaleService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private salesUrl = 'api/sales';  // URL to web api

  constructor(private http: Http) { }

  getSales(): Promise<Sale[]> {
    return this.http.get(this.salesUrl)
      .toPromise()
      .then(response => response.json().data as Sale[])
      .catch(this.handleError);
    // return Promise.resolve(SALES);
  }

  getSale(id: number): Promise<Sale> {
    // return this.getSales()
    // .then(sales => sales.find(sale => sale.id === id));
    const url = `${this.salesUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Sale)
      .catch(this.handleError);
  }
  // ------
  create(title: string, item: string, category: string,
         quality: string, price: number): Promise<Sale> {
    return this.http
      .post(this.salesUrl, JSON.stringify({title: title, item: item,
        category: category, quality: quality, price: price }), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as Sale)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
