import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Urls } from './api';

@Injectable()
export class CardService {
    constructor(
        private urls: Urls,
        private http: Http
    ) {}

    ngOnInit() {
    }
    
    searchCards(parameter: CardSearch): Observable<any> {
        console.log(`CardService.searchCards parameter=${JSON.stringify(parameter)}`);
        if (!parameter.isMock) {
            let searchQueryParameters = [];
            if (parameter.stockQuantity != undefined && parameter.stockQuantity >= 0) {
                searchQueryParameters.push("q=" + parameter.stockQuantity);
            }
            if (parameter.expansion != undefined && parameter.expansion.id > 0) {
                searchQueryParameters.push("e=" + parameter.expansion.id);
            }
            if (parameter.index != undefined && parameter.index != "") {
                searchQueryParameters.push("n=" + parameter.index);
            }
            if (parameter.name != undefined && parameter.name != "") {
                searchQueryParameters.push("rx_name=" + parameter.name);
            }
            if (parameter.type != undefined && parameter.type != "") {
                searchQueryParameters.push("rx_type=" + parameter.type);
            }
            if (parameter.cost != undefined && parameter.cost != "") {
                searchQueryParameters.push("rx_cost=" + parameter.cost);
            }
            if (parameter.text != undefined && parameter.text != "") {
                searchQueryParameters.push("rx_text=" + parameter.text);
            }
            if (searchQueryParameters.length <= 0) {
                throw new Error("CardSearchEmptyParameters");
            }
            let searchUrl = this.urls.cards + "query/?" + searchQueryParameters.join("&");
            console.log(`CardService.searchCards action='CallServer'`);
            return this.http
                .get(searchUrl)
                .map(res => res.json())
                .catch(this.handleError);
        } else {
            console.log("MockServer");
            return Observable.create([
                { "id": 5118, "name": "Mind Rot", "label": "Mind Rot - (3.480/50)", "manacostLabel": "2, Black", "text": "Target player discards two cards." },
                { "id": 9266, "name": "Read the Bones", "label": "Read the Bones - (3.542/96)", "manacostLabel": "2, Black", "text": "Scry 2, then draw two cards. You lose 2 life. <i>(To scry 2, look at the top two cards of your library, then put any number of them on the bottom of your library and the rest on top in any order.)</i>" }
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

export interface CardSearch {
    index: string;
    expansion: any;
    text: string;
    cost: string;
    type: string;
    name: string;
    stockQuantity?: number;   
    isMock: boolean;
}

export enum Board {Main = 1, Side = 2};