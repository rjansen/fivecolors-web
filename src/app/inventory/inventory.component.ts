import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
//import {Observable} from 'rxjs/Observable';
import { InventoryService } from '../services/index';
import { ValuesPipe, FilterPipe } from "../pipes/index"

@Component({
    selector: 'inventory',
    templateUrl: './inventory.html',
    styleUrls: [ './inventory.css' ]
})
export class Inventory implements OnInit {
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
    public model = {
        querying: false,
        updating: false,
        searchResultsList: [],
        searchResults: [],
        expansions: [
            {idAsset: 1, name: 'Alpha'},
            {idAsset: 2, name : 'Beta'},
            {idAsset: 3, name: 'Revised'},
            {idAsset: 50, name: 'Very large name of an expansion baby, dont cry ...'}
        ],
        updateQueue: {}
    };
    private valuesPipe = new ValuesPipe();
    
    constructor(
        private inventoryService: InventoryService 
    ) {
//        private routeParams: Params) {
        //this._selectedId = +routeParams.get('id');
    }

    ngOnInit() {
        this.listExpansions();
    }

    listExpansions() {
        this.inventoryService.listExpansions({ isMock: false })
            .subscribe(
            data => this.applyListExpansionsResults(data),
            error => this.logError(error));
    }

    applyListExpansionsResults(results) {
        this.model.expansions = results;
        console.log(`InventoryInit Expansions=${this.model.expansions}`);
    }

    addExpansionParameter(expansion) {
        this.parameter.expansion = expansion;
    }

    createCardQuantityLabel(card): number {
        var updateItem = this.model.updateQueue[card.id];
        if (updateItem == undefined) {
            return card.inventoryCard.quantity;
        } else {
            return this.model.updateQueue[card.id].quantity;
        }
    }

    compareUpdateItemQuantity(updateItem): number {
        var originalQtd = updateItem.card.inventoryCard.quantity;
        var newQtd = updateItem.quantity;
        if (newQtd < originalQtd) {
            return -1;
        } else if (newQtd > originalQtd) {
            return 1;
        } else {
            return 0;
        }
    }

    compareCardQuantity(card): number {
        var updateItem = this.model.updateQueue[card.id];
        if (updateItem == undefined) {
            return 0;
        } else {
            var originalQtd = card.inventoryCard.quantity;
            var newQtd = this.model.updateQueue[card.id].quantity;
            if (newQtd < originalQtd) {
                return -1;
            } else if (newQtd > originalQtd) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    
    showCard(card) {
        console.log("ShowCard=" + card);
        var win = window.open(`http://ligamagic.com.br/?view=cards%2Fsearch&card=${encodeURIComponent(card.name)}`, '_blank');
        win.focus();
    }

    removeCard(card) {
        if (card.inventoryCard.quantity <= 0 && !(card.id in this.model.updateQueue))
            return;
        var updateItem = this.model.updateQueue[card.id];
        if (updateItem == undefined) {
            updateItem = {
                action: "remove",
                card: card,
                quantity: card.inventoryCard.quantity - 1
            };
            this.model.updateQueue[card.id] = updateItem;
        } else {
            if (updateItem.quantity > 0) {
                updateItem.quantity -= 1;
                if (updateItem.quantity < card.inventoryCard.quantity) {
                    updateItem.action = "remove";
                } else {
                    updateItem.action = "add";
                }
            }
        }
    }

    addCard(card) {
        var updateItem = this.model.updateQueue[card.id];
        if (updateItem == undefined) {
            updateItem = {
                action: "add",
                card: card,
                quantity: card.inventoryCard.quantity + 1
            };
            this.model.updateQueue[card.id] = updateItem;
        } else {
            updateItem.quantity += 1;
            if (updateItem.quantity < card.inventoryCard.quantity) {
                updateItem.action = "remove";
            } else {
                updateItem.action = "add";
            }
        }
    }

    cleanUpdateQueue() {
        this.model.updateQueue = [];
    }

    removeUpdateItem(updateItem) {
        delete this.model.updateQueue[updateItem.card.id];
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
        this.inventoryService.searchCards(this.parameter)
            .subscribe(
            data => this.applySearchResults(data),
            error => this.logError(error));
    }

    logFindResult(result: any[]) {
        // console.log(`LogFindResult result=${result}`);
        this.applySearchResults(result);
    }

   logFindNewPageResult(result: any[]) {
        // console.log(`LogFindResult result=${result}`);
        this.applyNewSearchResults(result);
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
        setTimeout(() => this.model.querying = false, 5000); // 5 seconds
        this.inventoryService.searchCards(this.parameter)
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
    
    isCurrentSearchResults(resultIndex:number) {
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
    
    updateQueueIsInvalid() {
        return this.model == null || this.valuesPipe.transform(this.model.updateQueue).length <= 0;
    }
    
    update() {
        this.model.updating = true;
        setTimeout(() => this.model.updating = false, 5000); // 5 seconds
        var inventoryMessage = {
            cards: []
        };
        for (var cardId in this.model.updateQueue) {
            if (this.model.updateQueue.hasOwnProperty(cardId)) {
                var updateItem = this.model.updateQueue[cardId];
                inventoryMessage.cards.push({
                    id: updateItem.card.id,
                    inventoryCard: {
                        quantity: updateItem.quantity
                    }
                });
            }
        }
        this.inventoryService.updateInventory(inventoryMessage)
            .subscribe(
            response => this.applyUpdateResponse(response),
            error => this.logError(error));
    }

    applyUpdateResponse(response) {
        console.log("ApplyUpdateStatus=" + JSON.stringify(response));
        if (response.status == 201 || response.status == 202) {
            // if (response.status == 201) {
            //     this.inventory.id = parseInt(response.text(), 10);
            // }
            for (var cardId in this.model.updateQueue) {
                if (this.model.updateQueue.hasOwnProperty(cardId)) {
                    var updateItem = this.model.updateQueue[cardId];
                    updateItem.card.inventoryCard.quantity = updateItem.quantity;
                }
            }
            this.cleanUpdateQueue();
        }
    }

    logError(error) {
        this.model.querying = false;
        this.model.searchResults = [];
        console.error(error);
    }
}
