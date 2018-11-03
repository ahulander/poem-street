import { EventQueue } from "../../common/event-queue";
import { setupMessageHandlers } from "./message-handlers";

export enum EventTypes {
    CreateUnit = 0
}

export interface BaseEvent {
    type: EventTypes;
}

export interface EventCreateUnit extends BaseEvent {
    userId: number;
    unitType: number;
    x: number;
    y: number;
}

function eventToName(type) {
    return type;
}

export class Game {
    
    private eventQueue: EventQueue;

    constructor() {
        
        const eventHandlers: any[] = [];
        eventHandlers[EventTypes.CreateUnit] = this.createUnit.bind(this);
        this.eventQueue = new EventQueue(eventHandlers, eventToName);

        setupMessageHandlers(this.eventQueue);
    }

    run() {
        setInterval(this.tick.bind(this), 1000);
    }

    private createUnit(event: EventCreateUnit) {
        console.log("Create unit:");
        console.log(event);
    }
    
    private tick() {
        this.eventQueue.process();

        // TODO (Alex): Run simulation
        // TODO (Alex): Send messages back to the clients
    }
}
