import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Urls } from './api';
import { CardService, CardSearch } from './cardService';
import { ExpansionService, ExpansionSearch } from './expansionService';
import { SessionService, Session, Player } from './sessionService';

@Injectable()
export class DeckService {
    constructor(
        private urls: Urls,
        private http: Http,
        private sessionService: SessionService, 
        private cardService: CardService, 
        private expansionService: ExpansionService
    ) {}

    ngOnInit() {
    }

    listExpansions(parameter: ExpansionSearch) {
        return this.expansionService.listExpansions(parameter);
    }

    searchCards(parameter: CardSearch) {
        return this.cardService.searchCards(parameter);
    }

    updateDeck(deck: Deck) {
        let body = JSON.stringify(deck);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http
            .post(this.urls.decks, body, options)
            .catch(this.handleError);
    }

    findDeck(deckId: number) {
        if (deckId == undefined || deckId <= 0) {
            throw Error(`DeckFindRequiredFieldsError: DeckId=${deckId}`);
        }
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http
            .get(this.urls.decks + deckId, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    findDeckByName(deckName: string) {
        if (deckName == undefined || deckName == '') {
            throw Error(`DeckFindRequiredFieldsError: DeckName=${deckName}`);
        }
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http
            .get(this.urls.decks + encodeURIComponent(deckName), options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    listDeck(deckNameRx: string) {
        if (deckNameRx == undefined) {
            throw Error(`DeckListRequiredFieldsError: DeckNameRx=${deckNameRx}`);
        }
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http
            .get(this.urls.decks + `query/${encodeURIComponent(deckNameRx)}`, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    //private handleError(error: Response):Observable<any> {
    private handleError(error: Response): Observable<any> {
        console.error(error);
        return Observable.throw(error.json().error || 'ServerError');
    }
}

export interface Deck {
    name: string;
    id: number;
    idPlayer?: number;
    cards: any[];
    isMock: boolean;
}
