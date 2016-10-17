import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Urls } from './api';
import { CardService, CardSearch } from './cardService';
import { ExpansionService, ExpansionSearch } from './expansionService';

@Injectable()
export class InventoryService {
    constructor(
        private urls: Urls,
        private http: Http, 
        private cardService: CardService, 
        private expansionService: ExpansionService
    ) {}

    ngOnInit() {
    }

    listExpansions(parameter:ExpansionSearch) {
        return this.expansionService.listExpansions(parameter);
    }

    searchCards(parameter:CardSearch) {
        return this.cardService.searchCards(parameter);
    }

    updateInventory(inventory:Inventory) {
        let body = JSON.stringify(inventory);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http
            .post(this.urls.inventories, body, options)
            .catch(this.handleError);
    }

    //private handleError(error: Response):Observable<any> {
    private handleError(error: Response): Observable<any> {
        console.error(error);
        return Observable.throw(error.json().error || 'ServerError');
    }
}

export interface Inventory {
    id?: number;
    name?: string;
    cards: any[],
    isMock?: boolean;
}
