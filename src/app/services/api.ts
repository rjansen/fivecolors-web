import { Injectable } from '@angular/core';

@Injectable()
export class Urls {
    //private protocol = 'http';
    //private host = `${this.protocol}://localhost:7080`;
    private host = "";
    //private context = `${this.host}/fivecolors/api`;
    private context = `${this.host}/api`;
    public sessions = `${this.context}/session/`;  // URL to session REST api
    public players = `${this.context}/player/`;  // URL to player REST api
    public cards = `${this.context}/card/`;  // URL to card REST api
    public expansions = `${this.context}/expansion/`;  // URL to card REST api
    public inventories = `${this.context}/inventory/`;  // URL to inventory REST api
    public decks = `${this.context}/deck/`;  // URL to inventory REST api
}