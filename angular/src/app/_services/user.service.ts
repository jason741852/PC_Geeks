import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/user';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    getAll() {
        return this.http.get(
            'http://localhost:4200/api/users',
            this.createHeader()
        ).map(
            (response: Response) => response.json()
        );
    }

    getById(id: number) {
        return this.http.get(
            'http://localhost:4200/api/users/' + id
        ).map(
            (response: Response) => response.json()
        );
    }

    create(user: User) {
        return this.http.post(
            'http://localhost:4200/api/users/',
            user
        ).map(
            (response: Response) => response.json()
        );
    }

    update(user: User) {
        return this.http.put(
            'http://localhost:4200/api/users/' + user.id,
            user,
            this.createHeader()
        ).map(
            (response: Response) => response.json()
        );
    }

    delete(id: number) {
        return this.http.delete(
            'http://localhost:4200/api/users/' + id,
            this.createHeader()
        ).map(
            (response: Response) => response.json()
        );
    }

    // private helper methods

    // Creates Authorization header
    private createHeader() {
        let token = sessionStorage.getItem('token');
        if (token) {
            let headers = new Headers({ 'Authorization': 'Token ' + token });
            return new RequestOptions({ headers: headers });
        }
    }
}
