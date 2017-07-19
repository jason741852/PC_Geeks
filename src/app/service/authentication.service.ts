import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import 'rxjs/add/operator/map'

import { Router } from '@angular/router';


import { kinvey } from '../utils/constants';

@Injectable()
export class AuthenticationService {

    baseUrl: String;
    appKey: String;
    appSecret: String;

    constructor(private _http: Http, private router: Router) {
        this.baseUrl = kinvey.baseUrl;
        this.appKey = kinvey.appKey;
        this.appSecret = kinvey.appSecret;
    }

    login(username, password) {
        let loginUrl = this.baseUrl + 'user/' + this.appKey + '/login';
        let data = { username: username, password: password }
        let headers = new Headers();
        headers.append('Authorization', "Basic " + btoa(this.appKey + ":" + this.appSecret))
        headers.append('Content-Type', 'application/json');

        return this._http.post(loginUrl, JSON.stringify(data), { headers: headers })
            .map(x => x.json())
            .subscribe(
                res => {
                    // console.log("Response -> " + JSON.stringify(res))
                    this.router.navigate(['/'])
                    localStorage.setItem('profile', JSON.stringify(res))
                },
                err => {
                    // console.log("Error -> " + err)
                    this.router.navigate(['/login'])
                });
    }

    isLoggedIn() {
        if (localStorage.getItem('profile') != null) {
            return true;
        }

        return false;
    }

    logout() {
        let headers = new Headers()

        console.log(JSON.parse(localStorage.getItem('profile'))['_kmd']['authtoken'])

        headers.append('Authorization', ('Kinvey ' + JSON.parse(localStorage.getItem('profile'))['_kmd']['authtoken']))
        headers.append('Content-Type', 'application/json')


        let logoutUrl = this.baseUrl + 'user/' + this.appKey + '/_logout';
        this._http.post(logoutUrl, null, { headers: headers })
            .subscribe(
            res => {
                console.log(res)
                localStorage.clear();
            },
            err => console.log
            )
    }


    register(username, password) {
        let registerUrl = this.baseUrl + 'user/' + this.appKey + '/';
        let data = { username: username, password: password }
        let headers = new Headers();
        headers.append('Authorization', "Basic " + btoa(this.appKey + ":" + this.appSecret))
        headers.append('Content-Type', 'application/json');

        return this._http.post(registerUrl, JSON.stringify(data), { headers: headers })
            .map(x => x.json())
            .subscribe(
            res => {
                this.router.navigate(['/login'])
            },
            err => {
                console.log(err)
            }
            );
    }
}
