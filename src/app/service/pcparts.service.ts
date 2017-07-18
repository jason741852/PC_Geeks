import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Jsonp } from '@angular/http'
import 'rxjs/Rx'

@Injectable()
export class PCPartsService {

    apiKey: string

    constructor(private _http: Http, private jsonp: Jsonp) {
        this.apiKey = '8b6aeacc6e9bcfb0f54cfb35cc5c1828'
    }

    getLatestPCParts() {
        let today = new Date()
        let todayAsString = today.toISOString().slice(0, 10)
        let sevenDaysBefore = new Date()
        sevenDaysBefore.setDate(today.getDate() - 70)
        let sevenDaysBeforeAsString = sevenDaysBefore.toISOString().slice(0, 10)
        let headers = new Headers()
        headers.append('Content-Type', 'application/json')

        // return this._http.get(`https://api.thepcpartdb.org/3/discover/pcpart?primary_release_date.gte=${sevenDaysBeforeAsString}&primary_release_date.lte=${todayAsString}&api_key=${this.apiKey}`, {headers: headers})
        //     .take(10)
        //     .map(x => x.json())

        return this.jsonp.get(`https://api.themoviedb.org/3/discover/movie?callback=JSONP_CALLBACK&primary_release_date.gte=${sevenDaysBeforeAsString}&primary_release_date.lte=${todayAsString}&api_key=${this.apiKey}`)
            .map(x => x.json().results)
    }

    getPCPart(id: string) {
        return this.jsonp.get(`https://api.themoviedb.org/3/movie/${id}?callback=JSONP_CALLBACK&sort_by=popularity.desc&api_key=${this.apiKey}`)
            .map(x => x.json())
    }
}
