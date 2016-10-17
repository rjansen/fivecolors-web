import { Urls } from './api'
import { CardService } from './cardService'
import { ExpansionService } from './expansionService'
import { SessionService } from './sessionService'
import { InventoryService } from './inventoryService'

export const SERVICE_PROVIDERS = [
    Urls,
    InventoryService,
    CardService,
    ExpansionService,
    SessionService
];

export * from './api'
export * from './cardService'
export * from './expansionService'
export * from './sessionService'
export * from './inventoryService'

