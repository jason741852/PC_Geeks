import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Sale } from '../_models/sale';
import {Image} from '../_models/image';

@Injectable()
export class SaleService {

    private salesUrl = 'http://localhost:4200/api/posts/';  // URL to web api

    private image: Image[] = []


    constructor(private http: Http) { }

    getSales(): Promise<Sale[]> {
        return this.http.get(this.salesUrl)
            .toPromise()
            .then(response => response.json() as Sale[])
            .catch(this.handleError);
    }

    getPublicSaleDetails(id: number): Promise<Sale> {
        const url = `${this.salesUrl}${id}/`;
        return this.http.get(url, this.createHeader())
            .toPromise()
            .then(response => response.json() as Sale)
            .catch(this.handleError);
    }
    // ------
  createImages(id: number, images:[string],): Promise<Image> {
    const url = `${this.salesUrl}${id}/images/new/`;


    return this.http

      .post(url, JSON.stringify ({url: images}),
      this.createHeader())
      .toPromise()
      .then(response => response.json() as Image)
      .catch(this.handleError);
  }

  create(item: string,
            title:string,
            category: string,
            quality: string,
            manufacturer: string,
            price: number,
            location: string,
            body: string): Promise<Sale> {

    return this.http
            .post(this.salesUrl + "new/",

                JSON.stringify({
                    item: item,
                    title:title,
                    category: category,
                    quality: quality,
                    manufacturer: manufacturer,
                    price: price,
                    location: location,
                    body: body
                }),
                this.createHeader())
            .toPromise()
            .then(res => res.json() as Sale)
            .catch(this.handleError);
    }

    // TODO: implement displaying error messages to the user
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
