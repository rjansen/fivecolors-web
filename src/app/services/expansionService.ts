import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Urls } from './api'

@Injectable()
export class ExpansionService {
    constructor(
        private urls: Urls,
        private http: Http
    ) { }

    ngOnInit() {

    }

    listExpansions(parameter:ExpansionSearch): Observable<any> {
        if (!parameter.isMock) {
            let listUrl = this.urls.expansions;
            return this.http
                .get(listUrl)
                .map(res => res.json())
                .catch(this.handleError);
        } else {
            console.log("MockServer");
            return Observable.create([
                { "id": 3, "name": "Dark Ascension", "label": "Dark Ascension - (2/171)", "idAsset": 21 },
                { "id": 19, "name": "Innistrad", "label": "Innistrad - (3/274)", "idAsset": 2786 }
            ]);
        }
        //return new Promise<Hero[]>(resolve =>
        //    setTimeout(()=>resolve(HEROES), 2000) // 2 seconds
        //);
    }
    
    //private handleError(error: Response):Observable<any> {
    private handleError(error: Response): Observable<any> {
        console.error(error);
        return Observable.throw(error.json().error || 'ServerError');
    }
}

export interface ExpansionSearch {
    isMock: boolean;
}

export interface Expansion {
    id: number;
    name: string;
    label: string;
    idAsset: number;
    isMock: boolean;
}
