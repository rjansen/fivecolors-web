import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
//import {Observable} from 'rxjs/Observable';
import { Guid } from "../../services/index"
import { ValuesPipe, FilterPipe } from "../../pipes/index"

var $ = require('jquery');
import '../../../../node_modules/tether/dist/js/tether.min.js';
import '../../../../node_modules/bootstrap/dist/js/bootstrap.min.js';

@Component({
    selector: 'card',
    templateUrl: './card.html',
    styleUrls: [
        './card.css'
    ]
})
export class Card implements OnInit {
    @Input() card: any;
    @Input() label: string;
    @Input() componentId: string;

    @Input() decreaseOn: boolean = false;
    @Input() increaseOn: boolean = false;
    @Input() removeOn: boolean = false;
    @Input() changeBoardOn: boolean = false;
    @Input() showPopOn: boolean = true;
    @Input() shoppingOn: boolean = true;

    @Output() onDecrease = new EventEmitter<any>();
    @Output() onIncrease = new EventEmitter<any>();
    @Output() onRemove = new EventEmitter<any>();
    @Output() onChangeBoard = new EventEmitter<any>();
    @Output() onShowPop = new EventEmitter<any>();
    @Output() onHidePop = new EventEmitter<any>();
    @Output() onShopping = new EventEmitter<any>();

    private state = {
        popOpen: false
    };

    constructor(
    ) { 
        if (this.componentId == null) {
            this.componentId = Guid();
        }
    }

    ngOnInit() {
    }

    getComponentLabel(): string {
        if (this.label != null) {
            return this.label;
        }
        if (this.card.deckCard == null) {
            return this.card.inventoryCard.quantity.toString();
        }
        if (this.card.inventoryCard.quantity <= 0 || this.card.inventoryCard.quantity >= this.card.deckCard.quantity) {
            return this.card.deckCard.quantity.toString();
        } else {
            return `${this.card.inventoryCard.quantity}/${this.card.deckCard.quantity}`;
        }
    }

    decrease() {
        // this.card.deckCard.quantity -= 1;
        this.onDecrease.emit(this.card);
    }

    increase() {
        // this.card.deckCard.quantity += 1;
        this.onIncrease.emit(this.card);
    }

    remove() {
        this.onRemove.emit(this.card);
    }

    changeBoard() {
        this.onChangeBoard.emit(this.card);
    }

    showPop() {
        var cardComponent = ($(`#${this.componentId}`) as any)
        if (this.state.popOpen) {
            cardComponent.popover('dispose');
            this.state.popOpen = false;
            // this.onShowPop.emit(this.card);
            return
        }
        var cardComponentOffset = cardComponent.offset();
        //260 x 385
        var placement = 'left';
        var offset = '0 0';
        if (cardComponentOffset.top > 370) {
            placement = 'top';
            if (cardComponentOffset.left < 100) {
                offset = '0 -30px';
            } else if (cardComponentOffset.left > 1000) {
                offset = '0 25px';
            }
        } else if (cardComponentOffset.left < 300) {
            placement = 'right';
        }
        cardComponent = cardComponent.popover(
            {
                template: 
                `<div class="popover" role="tooltip">
                    <div class="popover-arrow"></div>
                    <div class="card-header card-pop-header text-xs-center">
                        <span class="searchResultsItemTitle"><strong class="popover-title" style="padding: 0px; border: none;"></strong></span>
                        <img src="/api/assets/${this.card.expansion.idAsset}" style="height: 18px; vertical-align: middle;" />
                    </div>
                    <div class="popover-content"></div>
                </div>`,
                content: `<img class="card-img-large" src="/api/assets/${this.card.idAsset}" />`,
                trigger: 'manual',
                html: true,
                placement: placement,
                offset: offset,
                title: this.card.name
            }
        );
        cardComponent.popover('show');
        this.state.popOpen = true;
        this.onShowPop.emit(this.card);
    }

    hidePop() {
        console.log(`HideCard Card=${this.card.name}`);
        var cardComponent = ($(`#${this.componentId}`) as any)
        // cardComponent.popover('dispose');
        this.onHidePop.emit(this.card);
    }

    shopping() {
        console.log(`Card.shopping id='${this.componentId}' cardId=${this.card.id} name='${this.card.name}'`);
        var win = window.open(`http://ligamagic.com.br/?view=cards%2Fsearch&card=${encodeURIComponent(this.card.name).replace(/'/g, "%27")}`, '_blank');
        win.focus();
        this.onShopping.emit(this.card);
    }
}