import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/user';

@Injectable()
export class UserService {

    constructor(private http: Http) { }

    getUser(id: number) {
        return this.http.get(
            "http://localhost:4200/api/user/" + id + "/",
            this.createAuthHeader()
        ).map(
            (response: Response) => response.json() as User[]
        );
    }



    register(user: User) {
        return this.http.post(
            "http://localhost:4200/api/register/",
              user
        ).map(
              (response: Response) => response.json()
        );
    }

    // private helper methods

    // Creates Authorization header
    private createAuthHeader() {
        let token = sessionStorage.getItem('token');
        if (token) {
            let headers = new Headers({ 'Authorization': 'Token ' + token });
            return new RequestOptions({ headers: headers });
        }
    }
}
