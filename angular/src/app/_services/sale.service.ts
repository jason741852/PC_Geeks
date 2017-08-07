import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Sale } from '../_models/sale';

@Injectable()
export class SaleService {

    private salesUrl = 'http://localhost:4200/api/posts/';  // URL to web api
    private privateSaleUrl = 'http://localhost:4200/api/self/posts/';

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

    getPrivateSaleDetails(id: number): Promise<Sale> {
        const url = `${this.privateSaleUrl}${id}/`;
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
            location: string,
            latitude: number,
            longitude: number,
            body: string): Promise<Sale> {
        return this.http
            .post(this.salesUrl + "new/",
                JSON.stringify({
                    item: item,
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
            .then(res => res.json().data as Sale)
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
