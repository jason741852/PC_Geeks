import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Sale } from '../_models/sale';
import { User } from "../_models/user";

@Injectable()
export class CurrentUserService {

    private baseUrl = 'http://localhost:4200/api/self/';

    constructor(private http: Http) { }

    getUser(): Promise<User> {
        return this.http.get(
            this.baseUrl,
            this.createAuthHeader()
        ).toPromise().then(
            (res: Response) => {
                console.log(res);
                console.log(res.json());
                return res.json() as User;
        }).catch(
            this.handleError
        );
    }

    getPosts(): Promise<Sale> {
        return this.http.get(
            this.baseUrl + "posts/",
            this.createAuthHeader()
        ).toPromise().then(
            (res: Response) => {
                console.log(res);
                console.log(res.json());
                return res.json() as Sale[];
        }).catch(
            this.handleError
        );
    }

    getPostDetails(id: number): Promise<Sale> {
        return this.http.get(
            this.baseUrl + "posts/" + id + "/",
            this.createAuthHeader()
        ).toPromise().then(
            (res: Response) => res.json() as Sale
        ).catch(
            this.handleError
        );
    }

    update(user: User): Promise<> {
        return this.http.patch(
            this.baseUrl + "update/",
            user,
            this.createAuthHeader()
        ).toPromise().then(
            (res: Response) => res.json()
        ).catch(
            this.handleError
        );
    }

    delete(): Promise<> {
        return this.http.get(
            this.baseUrl + "delete/",
            this.createAuthHeader()
        ).toPromise().then(
            (res: Response) => res.json()
        ).catch(
            this.handleError
        );
    }

    /*
    //  Helper functions
    */

    // TODO: implement displaying error messages to the user
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    private createAuthHeader() {
        let token = sessionStorage.getItem('token');
        if (token) {
            let headers = new Headers({ 'Authorization': 'Token ' + token });
            return new RequestOptions({ headers: headers });
        }
    }

}
