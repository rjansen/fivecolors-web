import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
//import {Observable} from 'rxjs/Observable';
import { Board, DeckService } from '../services/index';
import { ValuesPipe, FilterPipe } from "../pipes/index"


@Component({
    selector: 'deck',
    templateUrl: './deck.html',
    styles: [
        './deck.css'
    ]
    // ,
    // providers: [
    //     SessionService, CardService, ExpansionService, DeckService
    // ],
})
export class Deck implements OnInit {
    //public searchResults = [];
    public parameter = {
        index: undefined,
        expansion: undefined,
        cost: undefined,
        type: undefined,
        name: undefined,
        stockQuantity: undefined,
        isMock: false
    };
    public deck = {
        id: undefined,
        name: undefined,
        cards: []
    };
    public model = {
        querying: false,
        updating: false,
        finding: false,
        searchResultsList: [],
        searchResults: [],
        expansions: [],
        decks: [],
        selectedBoard: 1
    };

    constructor(
        private deckService: DeckService
    ) { }


    logFindResult(result: any[]) {
        console.log(`LogFindResult result=${result}`);
        this.applySearchResults(result);
    }

   logFindNewPageResult(result: any[]) {
        console.log(`LogFindResult result=${result}`);
        this.applyNewSearchResults(result);
    }

    ngOnInit() {
        this.listExpansions();
    }

    analyseDeckName(event: KeyboardEvent) {
        if (event.keyCode == 9) {
            var deckNameSearchRx = (<HTMLInputElement>event.target).value;
            console.log(`DeckNameSearchRx=${deckNameSearchRx}`);
            this.list(deckNameSearchRx);
            return false;
        }
    }

    selectDeck(deck) {
        this.deck.id = deck.id;
        this.find();
    }

    listExpansions() {
        this.deckService.listExpansions({ isMock: false })
            .subscribe(
            data => this.applyListExpansionsResults(data),
            error => this.logError(error));
    }

    applyListExpansionsResults(results) {
        this.model.expansions = results;
    }

    addExpansionParameter(expansion) {
        this.parameter.expansion = expansion;
    }

    calculateMainCardsSize() {
        var mainCardsSize = 0;
        this.deck.cards.forEach(card => {
            if (card.deckCard.idBoard == Board.Main) {
                mainCardsSize += card.deckCard.quantity;
            }
        });
        return mainCardsSize;
    }

    calculateSideCardsSize() {
        var sideCardsSize = 0;
        this.deck.cards.forEach(card => {
            if (card.deckCard.idBoard == Board.Side) {
                sideCardsSize += card.deckCard.quantity;
            }
        });
        return sideCardsSize;
    }

    getCardQuantity(card): number {
        var cardQtd = 0;
        var mainDeckCard = this.getDeckCard(Board.Main, card.id);
        if (mainDeckCard != undefined) {
            cardQtd = card.inventoryCard.quantity - mainDeckCard.deckCard.quantity;
        } else {
            cardQtd = card.inventoryCard.quantity;
        }
        var sideDeckCard = this.getDeckCard(Board.Side, card.id);
        if (sideDeckCard != undefined) {
            cardQtd -= sideDeckCard.deckCard.quantity;
        }
        return cardQtd;
    }

    isChangedCardQuantity(card): boolean {
        var cardQtd = 0;
        var mainDeckCard = this.getDeckCard(Board.Main, card.id);
        if (mainDeckCard == undefined) {
            var sideDeckCard = this.getDeckCard(Board.Side, card.id);
            if (sideDeckCard != undefined) {
                return sideDeckCard.deckCard.quantity > 0;
            } else {
                return false;
            }
        } else {
            return mainDeckCard.deckCard.quantity > 0;
        }
    }

    getDeckItemLabel(deckItem): string {
        if (deckItem.inventoryCard.quantity <= 0 || deckItem.inventoryCard.quantity >= deckItem.deckCard.quantity) {
            return deckItem.deckCard.quantity.toString();
        } else {
            return `${deckItem.inventoryCard.quantity}/${deckItem.deckCard.quantity}`;
        }
    }

    showCard(card) {
        console.log("ShowCard=" + card);
        var win = window.open(`http://ligamagic.com.br/?view=cards%2Fsearch&card=${encodeURIComponent(card.name)}`, '_blank');
        win.focus();
    }

    removeCard(card) {
        var deckCard = this.getDeckCard(this.model.selectedBoard, card.id);
        if (deckCard == undefined) {
            deckCard = {
                id: card.id,
                name: card.name,
                expansion: card.expansion,
                idAsset: card.idAsset,
                deckCard: {
                    quantity: 1,
                    idBoard: this.model.selectedBoard
                }
            };
            var cardsLen = this.deck.cards.push(deckCard);
        } else {
            if (deckCard.deckCard.quantity > 0) {
                deckCard.deckCard.quantity -= 1;
            }
        }
    }

    addCard(card) {
        var deckCard = this.getDeckCard(this.model.selectedBoard, card.id);
        if (deckCard == undefined) {
            deckCard = {
                id: card.id,
                name: card.name,
                expansion: card.expansion,
                idAsset: card.idAsset,
                deckCard: {
                    quantity: 1,
                    idBoard: this.model.selectedBoard
                },
                inventoryCard: {
                    quantity: card.inventoryCard.quantity
                }
            };
            var cardsLen = this.deck.cards.push(deckCard);
        } else {
            deckCard.deckCard.quantity += 1;
        }
    }

    private getDeckCardIdx(idBoard: number, cardId: number) {
        var deckCardIdx: number;
        for (var k: number = 0; k < this.deck.cards.length; k++) {
            var card = this.deck.cards[k];
            if (card.deckCard.idBoard == idBoard && card.id == cardId) {
                deckCardIdx = k;
                break;
            }
        }
        return deckCardIdx;
    }

    private getDeckCard(idBoard: number, cardId: number) {
        var cardIdx = this.getDeckCardIdx(idBoard, cardId);
        if (cardIdx != undefined) {
            return this.deck.cards[cardIdx];
        } else {
            return undefined;
        }
    }

    removeDeckItem(card) {
        var cardIdx = this.getDeckCardIdx(this.model.selectedBoard, card.id)
        console.log(`RemoveDeckItem: Board.Id=${this.model.selectedBoard} Card.Id=${card.id} CardIdx=${cardIdx}`)
        this.deck.cards.splice(cardIdx, 1);
    }

    filterIsInValid(): boolean {
        var filterInValid = this.parameter == null
            || (this.parameter.expansion == null
                && (this.parameter.stockQuantity == null || this.parameter.stockQuantity <= 0)
                && (this.parameter.index == null || this.parameter.index.trim().length <= 0)
                && (this.parameter.name == null || this.parameter.name.trim().length <= 0)
                && (this.parameter.type == null || this.parameter.type.trim().length <= 0)
                && (this.parameter.cost == null || this.parameter.cost.trim().length <= 0));
        return filterInValid;
    }

    search() {
        this.model.querying = true;
        setTimeout(() => this.model.querying = false, 5000); // 5 seconds
        this.deckService.searchCards(this.parameter)
            .subscribe(
            data => this.applySearchResults(data),
            error => this.logError(error));
    }

    applySearchResults(results) {
        this.model.querying = false;
        if (results != undefined) {
            if (this.model.searchResultsList.length > 0) {
                var resultIndex = this.model.searchResultsList.indexOf(this.model.searchResults);
                this.model.searchResultsList[resultIndex] = results;
            } else {
                this.model.searchResultsList.push(results);
            }
            this.model.searchResults = results;
        }
    }

    searchOnNewPage() {
        this.model.querying = true;
        setTimeout(() => this.model.querying = false, 5000); // 5 seconds
        this.deckService.searchCards(this.parameter)
            .subscribe(
            data => this.applyNewSearchResults(data),
            error => this.logError(error));
    }

    applyNewSearchResults(results) {
        this.model.querying = false;
        if (results != undefined) {
            this.model.searchResultsList.push(results);
            this.model.searchResults = results;
        }
    }

    isCurrentSearchResults(resultIndex: number) {
        return resultIndex == this.model.searchResultsList.indexOf(this.model.searchResults);
    }

    selectResult(results, index) {
        this.model.searchResults = results;
    }

    closeSearchResults() {
        var resultIndex = this.model.searchResultsList.indexOf(this.model.searchResults);
        this.model.searchResultsList.splice(resultIndex, 1);
        if (this.model.searchResultsList.length > 0) {
            this.model.searchResults = this.model.searchResultsList[this.model.searchResultsList.length - 1];
        } else {
            this.model.searchResults = [];
        }
    }

    update() {
        this.model.updating = true;
        setTimeout(() => this.model.updating = false, 5000); // 5 seconds
        var deckUpdate = {
            id: this.deck.id == "" ? undefined : this.deck.id,
            name: this.deck.name,
            cards: [],
            isMock: false
        };
        for (var cardId in this.deck.cards) {
            this.deck.cards.forEach(card => {
                deckUpdate.cards.push({
                    id: card.id,
                    deckCard: {
                        idBoard: card.deckCard.idBoard,
                        quantity: card.deckCard.quantity
                    }
                })
            });
        }
        console.log(`PostDeck: DeckUpdate=${JSON.stringify(deckUpdate)}`);
        this.deckService.updateDeck(deckUpdate)
            .subscribe(
            response => this.applyUpdateResponse(response),
            error => this.logError(error));
    }

    applyUpdateResponse(response) {
        console.log("ApplyUpdateStatus=" + JSON.stringify(response));
        if (response.status == 201 || response.status == 202) {
            if (response.status == 201) {
                this.deck.id = parseInt(response.text(), 10);
            }
        }
    }

    find() {
        this.model.finding = true;
        this.deckService.findDeck(this.deck.id)
            .subscribe(
            data => this.applyFindResult(data),
            error => this.logError(error))
    }

    applyFindResult(result) {
        this.model.finding = false;
        this.deck = result;
        this.model.selectedBoard = Board.Main;
    }

    list(deckNameRx: string) {
        this.deckService.listDeck(deckNameRx)
            .subscribe(
            data => this.applyListDeckResults(data),
            error => this.logError(error))
    }

    applyListDeckResults(results) {
        this.model.finding = false;
        console.log(JSON.stringify(results));
        if (results != undefined) {
            this.model.decks = results;
        } else {
            this.clearDecks();
        }
    }

    clearDecks() {
        this.model.decks = [];
    }

    logError(error) {
        this.model.querying = false;
        this.model.updating = false;
        this.model.finding = false;
        this.model.searchResults = [];
        console.error(error);
    }
}