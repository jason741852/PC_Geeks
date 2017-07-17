import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Router } from '@angular/router';

import { kinvey } from '../utils/constants';

@Injectable()
export class ReviewsService {

    baseUrl: String;
    appKey: String;
    appSecret: String;

    constructor(private _http: Http, private router: Router) {
        this.baseUrl = kinvey.baseUrl;
        this.appKey = kinvey.appKey;
        this.appSecret = kinvey.appSecret;
    }

    addNewComment(comment: string, pcpartId: number) {
        let newComment = {
            pcpartId: pcpartId,
            user: this.getUserDetails(),
            comment: comment
        }

        let url = `${this.baseUrl}appdata/${this.appKey}/comments`
        return this._http.post(url, JSON.stringify(newComment), { headers: this.getUserHeaders() })
    }

    getUserHeaders() {
        let headers = new Headers()
        headers.append('Authorization', 'Kinvey ' + JSON.parse(localStorage.getItem('profile'))['_kmd']['authtoken'])
        headers.append('Content-Type', 'application/json')
        return headers;
    }

    getAllComments(pcpartId) {
        let url = `${this.baseUrl}appdata/${this.appKey}/comments?query={"pcpartId":${pcpartId}}`
        return this._http.get(url, { headers: this.getUserHeaders() }).map(x => x.json())
    }

    addReview(starsCount: number, reviewContnet: string, pcpart: Object) {
        let newReview = {
            user: this.getUserDetails(),
            rating: starsCount,
            content: reviewContnet,
            pcpart: pcpart
        }

        let url = `${this.baseUrl}appdata/${this.appKey}/reviews`
        this._http.post(url, JSON.stringify(newReview), { headers: this.getUserHeaders() }).subscribe((res)=> {
            this.router.navigate(['/reviews'])
            console.log('ok')
            console.log(res.json())
        })
    }

    getUserDetails() {
        return {
            id: JSON.parse(localStorage.getItem('profile'))['_id'],
            username: JSON.parse(localStorage.getItem('profile'))['username']
        }
    }
}
