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
        return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            });
    }
    isLoggedIn() {
      if (localStorage.getItem('currentUser') != null) {
        console.log(localStorage.getItem('currentUser'))
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
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
}
