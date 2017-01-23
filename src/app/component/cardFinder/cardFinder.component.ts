import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
//import {Observable} from 'rxjs/Observable';
import { InventoryService } from '../../services/index';
import { ValuesPipe, FilterPipe } from "../../pipes/index"

@Component({
    selector: 'card-finder',
    templateUrl: './cardFinder.html',
    styleUrls: [
        './cardFinder.css'
    ]
})
export class CardFinder implements OnInit {
    @Input() showResults: boolean = false;
    @Output() onResult = new EventEmitter<any[]>();
    @Output() onNewPageResult = new EventEmitter<any[]>();
    
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
    public model = {
        querying: false,
        searchResultsList: [],
        searchResults: [],
        expansions: []
    };

    constructor(
        private inventoryService: InventoryService
    ) { }

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
    }

    addExpansionParameter(expansion) {
        this.parameter.expansion = expansion;
    }

    filterIsInValid(): boolean {
        var filterInValid = this.parameter == null
            || (this.parameter.expansion == null
                && (this.parameter.stockQuantity == null || this.parameter.stockQuantity <= 0)
                && (this.parameter.index == null || this.parameter.index.trim().length <= 0)
                && (this.parameter.name == null || this.parameter.name.trim().length <= 0)
                && (this.parameter.type == null || this.parameter.type.trim().length <= 0)
                && (this.parameter.text == null || this.parameter.text.trim().length <= 0)
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
        this.onResult.emit(results);
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
        this.onNewPageResult.emit(results);
    }

    isCurrentSearchResults(resultIndex: number) {
        return resultIndex == this.model.searchResultsList.indexOf(this.model.searchResults);
    }

    selectResult(results, index) {
        this.model.searchResults = results;
        this.onResult.emit(results);
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

    logError(error) {
        this.model.querying = false;
        this.model.searchResults = [];
        console.error(error);
    }
}
