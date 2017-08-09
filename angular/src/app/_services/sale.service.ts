import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Sale } from '../_models/sale';
import {Image} from '../_models/image';
import {Rating} from "../_models/rating";

@Injectable()
export class SaleService {

    private salesUrl = 'http://localhost:4200/api/posts/';  // URL to web api


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
    addImage(id: number, url: string): Promise<Image> {
      return this.http.post(
        this.salesUrl + id + '/images/new/',
        JSON.stringify ({url: url}),
        this.createHeader())
      .toPromise()
      .then(response => response.json() as Image)
      .catch(this.handleError);
  }
  addRating(id: number, comment: string, rating:number): Promise<Rating> {
    return this.http.post(
      this.salesUrl + id + '/rate/seller/',
      JSON.stringify ({comment: comment, rating:rating}),
      this.createHeader())
      .toPromise()
      .then(response => response.json() as Rating)
      .catch(this.handleError);
  }


  create(item: string,
            title:string,
            category: string,
            quality: string,
            manufacturer: string,
            price: number,
            location: string,
            latitude: number,
            longitude: number,
            body: string): Promise<Sale> {

    return this.http
            .post(this.salesUrl + "new/",

                JSON.stringify({
                    item: item,
                    title:title,
                    image: {url: "https://images10.newegg.com/NeweggImage/ProductImage/14-487-267-S99.jpg"},
                    category: category,
                    quality: quality,
                    manufacturer: manufacturer,
                    price: price,
                    location: location,
                    latitude: latitude,
                    longitude: longitude,
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
