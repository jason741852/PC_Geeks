import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router'
@Injectable()
export class AuthenticationService {

    constructor(private http: Http, private router: Router) {

    }

    login(username: string, password: string) {
        return this.http.post('localhost:4200/api/login/', JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let res = response.json();
                if (res && res.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('token', res.token);
                    console.log('success');
                }

                return res.token;
            });
    }

    isLoggedIn() {
      if (sessionStorage.getItem('token') != null) {
        //this.http.post('localhost:8000/login')
        return true;
      }

      return false;
    }

    getFirstName() {
      return JSON.parse(localStorage.getItem('currentUser'))['firstName'] ;
    }
    getLastName() {
      return JSON.parse(localStorage.getItem('currentUser'))['lastName'] ;
    }
    getID() {
      return JSON.parse(localStorage.getItem('currentUser'))['id'] ;
    }
    getEmail() {
      return JSON.parse(localStorage.getItem('currentUser'))['email'] ;
    }
    getUsername() {
      return JSON.parse(localStorage.getItem('currentUser'))['username'] ;
    }
    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
