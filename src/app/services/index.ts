import { Urls } from './api'
import { CardService } from './cardService'
import { ExpansionService } from './expansionService'
import { SessionService } from './sessionService'
import { InventoryService } from './inventoryService'
import { DeckService } from './deckService'

export const SERVICE_PROVIDERS = [
    Urls,
    CardService,
    ExpansionService,
    SessionService,
    InventoryService,
    DeckService
];

export * from './api'
export * from './cardService'
export * from './expansionService'
export * from './sessionService'
export * from './inventoryService'
export * from './deckService'
