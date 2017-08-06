import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/user';

@Injectable()
export class UserService {
    private baseUrl = 'http://localhost:4200/api/users/';

    constructor(private http: Http) { }

    getAll() {
        return this.http.get(
            this.baseUrl,
            this.createHeader()
        ).map(
            (response: Response) => response.json()
        );
    }

    getById(id: number) {
        return this.http.get(
            this.baseUrl + id
        ).map(
            (response: Response) => response.json()
        );
    }

  getSelf() {
    return this.http.get(
      this.baseUrl + "self",
          this.createHeader()
    ).map(
      (response: Response) => response.json() as User
    );
  }

    create(user: User) {
        return this.http.post(
          this.baseUrl + "new/",
            user
        ).map(
            (response: Response) => response.json()
        );
    }

    update(user: User, id:number) {
        return this.http.put(
          this.baseUrl + "update/"+ id +"/",
            user,
            this.createHeader()
        ).map(
            (response: Response) => response.json()
        );
    }

    delete(id: number) {
        return this.http.delete(
            this.baseUrl + "delete/" + id,
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
