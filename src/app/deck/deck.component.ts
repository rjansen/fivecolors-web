import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
//import {Observable} from 'rxjs/Observable';
import { Board, DeckService } from '../services/index';
import { ValuesPipe, FilterPipe } from "../pipes/index"
import { Line, Bar, Pie } from 'chartist';

var $ = require('jquery');

@Component({
    selector: 'deck',
    templateUrl: './deck.html',
    styleUrls: [
         './deck.css' 
    ]
})
export class Deck implements OnInit, OnChanges {
    //public searchResults = [];
    public parameter = {
        index: undefined,
        expansion: undefined,
        text: undefined,
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
        selectedBoard: 1,
        deckSearchRx: ''
    };

    constructor(
        private deckService: DeckService
    ) { }

    generateDeckStatistics() {
        console.log(`GeneratingDeckStatistics DeckId=${this.deck.id}`);
        var types = { 
            creature: 1,
            artifact: 2,
            enchantment: 3,
            instant: 4,
            sorcery: 5,
            planeswalker: 6,
            land: 7
        }
        var deckCostSet = {}
        var typesChartData = {
            labels: [],
            series: []
        }
        
        for (let card of this.deck.cards) {
            if (card.deckCard.idBoard != Board.Main) {
                continue;    
            }    
            if (card.manacostLabel.trim().length > 0) {
                var convertedManacost = 0;   
                card.manacostLabel.split(', ').forEach((value, idx) => {
                    if (value.match(/\d+/g)) {
                        convertedManacost += parseFloat(value);
                    } else {
                        convertedManacost += 1;
                    }
                });
                if (convertedManacost in deckCostSet) {
                    deckCostSet[convertedManacost] += card.deckCard.quantity;
                } else if (!card.typeLabel.match(/land/ig)) {
                    deckCostSet[convertedManacost] = card.deckCard.quantity;
                }
            }
            var addToData = (key, card) => {
                var idx = typesChartData.labels.indexOf(key);
                if (idx >= 0) {
                    typesChartData.series[idx] += card.deckCard.quantity;
                } else {
                    typesChartData.labels.push(key);
                    typesChartData.series.push(card.deckCard.quantity);
                }
            }
            if (card.typeLabel.match(/creature/ig)) {
                addToData('Creature', card);
            }
            if (card.typeLabel.match(/artifact/ig)) {
                addToData('Artifact', card);
            }
            if (card.typeLabel.match(/enchantment/ig)) {
                addToData('Enchantment', card);
            }
            if (card.typeLabel.match(/instant/ig)) {
                addToData('Instant', card);
            }
            if (card.typeLabel.match(/sorcery/ig)) {
                addToData('Sorcery', card);
            }
            if (card.typeLabel.match(/planeswalker/ig)) {
                addToData('Planeswalker', card);
            }
            if (card.typeLabel.match(/land/ig)) {
                addToData('Land', card);
            }
        }
        var ordDeckCostSet = Object.keys(deckCostSet).sort((n1, n2) => parseFloat(n1) - parseFloat(n2));
        var data = {
            labels: [],
            series: [[]]
        }
        for (let key of ordDeckCostSet) {
            data.labels.push(key);
            data.series[0].push(deckCostSet[key]);
        }
        console.log(`GeneratingGraphs DeckId=${this.deck.id} CostData=${JSON.stringify(data)} TypesData=${JSON.stringify(typesChartData)}`);
        new Line('#lineDeckChart', data,
            {
                // distributeSeries: true,
                low: 0,
                high: 15,
                showArea: true,
                // stackBars: true,
                // horizontalBars: false,
                // seriesBarDistance: 10,
                axisX: {
                    onlyInteger: true,
                    // scaleMinSpace: 5
                    // On the x-axis start means top and end means bottom
                    // position: 'start'
                    // labelOffset: 10
                    // offset: 80
                },
                axisY: {
                    onlyInteger: true,
                    // On the y-axis start means left and end means right
                    // position: 'end',
                    // scaleMinSpace: 20
                },
            }
        );

         new Bar('#barDeckChart', 
            {
                labels: typesChartData.labels,
                series: [typesChartData.series]
            },
            {
                // distributeSeries: true,
                low: 0,
                high: 25,
                // stackBars: false,
                // distributeSeries: true,
                // horizontalBars: false,
                // seriesBarDistance: 1,
                axisX: {
                    onlyInteger: true,
                    // scaleMinSpace: 5
                    // On the x-axis start means top and end means bottom
                    // position: 'start'
                    // labelOffset: 10
                    // offset: 80
                },
                axisY: {
                    onlyInteger: true,
                    // On the y-axis start means left and end means right
                    // position: 'end',
                    // scaleMinSpace: 20
                },
            }
        ); 

        var sum = (a, b) => { return a + b };

        new Pie('#pieDeckChart', typesChartData, 
            {
                labelPosition: 'outside',
                showLabel: true,
                total: 60,
                chartPadding: 20,
                labelOffset: -43,
                labelDirection: 'explode',
                labelInterpolationFnc: (key) => {
                    var idx = typesChartData.labels.indexOf(key);
                    var value = typesChartData.series[idx];
                    var result =   `${key} ${Math.round(value / typesChartData.series.reduce(sum) * 100)}%`;
                    return result
                }
            }
        );
        this.model.selectedBoard = 3
    }

    logFindResult(result: any[]) {
        // console.log(`LogFindResult result=${result}`);
        this.applySearchResults(result);
    }

   logFindNewPageResult(result: any[]) {
        // console.log(`LogFindResult result=${result}`);
        this.applyNewSearchResults(result);
    }

    ngOnInit() {
        this.listExpansions();
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(`ngOnChanges Changes=${changes}`);
    }

    analyseDeckName(event: KeyboardEvent) {
        if (event.keyCode == 9) {
            var deckNameSearchRx = (<any>event.target).value;
            if (deckNameSearchRx.length > 2) {
                console.log(`DeckNameSearchRx=${deckNameSearchRx}`);
                this.list(deckNameSearchRx);
                return false;
            }
        } else if (event.keyCode == 27) {
            this.closeDecksResults()
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

    changeBoard(card) {
        if (card.deckCard.quantity <= 0) {
            return
        }
        var targetBoard = card.deckCard.idBoard == Board.Main ? Board.Side : Board.Main;
        var cardRef = this.getDeckCard(card.deckCard.idBoard, card.id);
        var deckCard = this.getDeckCard(targetBoard, card.id);
        if (deckCard == undefined) {
            deckCard = {
                id: card.id,
                name: card.name,
                expansion: card.expansion,
                idAsset: card.idAsset,
                deckCard: {
                    quantity: 1,
                    idBoard: targetBoard
                },
                inventoryCard: {
                    quantity: card.inventoryCard.quantity
                }
            };
            this.deck.cards.push(deckCard);
        } else {
            deckCard.deckCard.quantity += 1;
        }
        cardRef.deckCard.quantity -= 1;
    }

    addCard(card) {
        var deckCard = this.getDeckCard(this.model.selectedBoard, card.id);
        if (deckCard == undefined) {
            deckCard = {
                id: card.id,
                name: card.name,
                expansion: card.expansion,
                idAsset: card.idAsset,
                manacostLabel: card.manacostLabel,
                typeLabel: card.typeLabel,
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
        // setTimeout(() => this.model.querying = false, 5000); // 5 seconds
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
        } else {
            if (this.model.searchResultsList.length > 0) {
                var resultIndex = this.model.searchResultsList.indexOf(this.model.searchResults);
                this.model.searchResultsList[resultIndex] = [];
            } 
            this.model.searchResults = [];
        } 
    }

    searchOnNewPage() {
        this.model.querying = true;
        // setTimeout(() => this.model.querying = false, 5000); // 5 seconds
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

    copyDeck() {
        this.deck.id = undefined;
        this.deck.name += ' - Copy';
        this.update()
    }

    deleteDeck() {
        console.log(`DeleteDeck: DeckID=${this.deck.id}`);
        this.model.updating = true;
        this.deckService.deleteDeck(this.deck.id)
            .subscribe(
            response => this.applyDeleteResponse(response),
            error => this.logError(error));
    }

    closeDeck() {
        this.deck = {id: undefined, name: undefined, cards: []};
    }

    update() {
        this.model.updating = true;
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
        this.model.updating = false
        console.log("ApplyUpdateStatus=" + JSON.stringify(response));
        if (response.status == 201) {
            this.deck.id = parseInt(response.text(), 10);
        }
    }

    applyDeleteResponse(response) {
        this.model.updating = false
        console.log("ApplyDeleteStatus=" + JSON.stringify(response));
        if (response.status == 200) {
            this.closeDeck();
        }
    }


    find() {
        this.model.finding = true;
        if (this.deck.id != undefined && this.deck.id != '') {
            this.deckService.findDeck(this.deck.id)
                .subscribe(
                data => this.applyFindResult(data),
                error => this.logError(error))
        
        } else if (this.deck.name != undefined && this.deck.name != '') {
            this.deckService.findDeckByName(this.deck.name)
                .subscribe(
                data => this.applyFindResult(data),
                error => this.logError(error))
        } else {
            throw Error(`DeckIdOrNameAreRequiredToFindError: DeckId=${this.deck.id}, DeckName=${this.deck.name}`);
        }
    }

    applyFindResult(result) {
        this.model.finding = false;
        this.deck = result;
        this.model.selectedBoard = Board.Main;
    }

    list(deckNameRx: string) {
        this.clearDecks();
        if (deckNameRx.length == 0) {
            this.model.deckSearchRx = '*';
        } else {
            this.model.deckSearchRx = deckNameRx;
        }
        this.deckService.listDeck(deckNameRx)
            .subscribe(
            data => this.applyListDeckResults(data),
            error => this.logError(error))
    }

    applyListDeckResults(results) {
        this.model.finding = false;
        if (results != undefined) {
            this.model.decks = results;
        } else {
            this.clearDecks();
        }
        this.openDecksResults()
    }

    openDecksResults() {
        ($("#deckSearck") as any).parent().addClass('open');
    }

    closeDecksResults() {
        ($("#deckSearck") as any).parent().removeClass('open');    
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