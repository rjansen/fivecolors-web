import { Injectable } from '@angular/core';

@Injectable()
export class Urls {
    //private protocol = 'http';
    //private host = `${this.protocol}://localhost:7080`;
    private host = "";
    //private context = `${this.host}/fivecolors/api`;
    private identity = `${this.host}/identity`;
    public sessions = `${this.identity}/sessions/`;  // URL to session REST api
    private api = `${this.host}/api`;
    public players = `${this.api}/players/`;  // URL to player REST api
    public cards = `${this.api}/cards/`;  // URL to card REST api
    public expansions = `${this.api}/expansions/`;  // URL to card REST api
    public inventories = `${this.api}/inventories/`;  // URL to inventory REST api
    public decks = `${this.api}/decks/`;  // URL to inventory REST api
}