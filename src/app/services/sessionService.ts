import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Urls } from './api';
import { CardService, CardSearch } from './cardService';
import { ExpansionService, ExpansionSearch } from './expansionService';

@Injectable()
export class SessionService {
    public session:Session = null;
    public player:Player = null;

    constructor(
        private urls: Urls,
        private http: Http
    ) { }

    loadSession(callback=null) {
        console.log(`LoadingSession: SessionURL=${this.urls.sessions}`);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        this.http
            .get(this.urls.sessions, options)
            .catch(this.handleError)
            .subscribe(res => this.applySession(res, callback));
    }
    
    applySession(response, callback=null) {
        if (response.status != 200) {
            throw Error(`ErrorLoadingSession: SessionURL=${this.urls.sessions}`);
        }
        console.log(`SessionLoaded: Response=${JSON.stringify(response)}`);
        this.session = response.json();
        if (callback != null) {  
            callback(this.session);
        }
    }
    
    loadPlayer(callback=null) {
        console.log(`LoadingPlayer: SessionID=${this.session.id} PlayerURL=${this.urls.players}`);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        this.http
            .get(this.urls.players, options)
            .catch(this.handleError)
            .subscribe(res => this.applyPlayer(res, callback));
    }
    
    applyPlayer(response, callback=null) {
        if (response.status != 200) {
            throw Error(`ErrorLoadingPlayer: PlayerURL=${this.urls.players}`);
        }
        console.log(`PlayerLoaded: Response=${JSON.stringify(response)}`);
        this.player = response.json(); 
        if (callback != null) {  
            callback(this.player);
        }
    }
    
    //private handleError(error: Response):Observable<any> {
    private handleError(error: Response): Observable<any> {
        console.error(error);
        return Observable.throw(error.json().error || 'ServerError');
    }
}

export interface Session {
    id: string;
    username: string;
    token: string;
    isMock?: boolean;
}

export interface Player {
    id: number;
    username: string;
    idInventory?: number;
    idDecks?: number[];
    isMock?: boolean;
}
