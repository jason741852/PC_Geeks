import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router'

@Injectable()
export class AuthenticationService {

    constructor(private http: Http, private router: Router) {}

    login(username: string, password: string) {
        return this.http.post('http://localhost:4200/api/login/', JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let res = response.json();
                if (res && res.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('token', res.token);
                }

                return res.token;
            });
    }

    isLoggedIn() {
        if (sessionStorage.getItem('token') != null) {
            return true;
        }
        return false;
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
