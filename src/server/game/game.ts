import * as WebSocket from 'ws';
import { EventQueue } from "../../common/event-queue";
import { setupMessageHandlers } from "./message-handlers";
import { UnitData } from "../../common/entities/unit";
import { vec2 } from "../../common/math/vector2";
import { WSServerMessageTypes } from '../../common/api/ws-messages';

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
    
    private readonly wss: WebSocket.Server;

    private eventQueue: EventQueue;

    private nextUnitId: number = 0;
    private units: UnitData[] = [];
    

    constructor(wss: WebSocket.Server) {
        
        this.wss = wss;

        const eventHandlers: any[] = [];
        eventHandlers[EventTypes.CreateUnit] = this.createUnit.bind(this);
        this.eventQueue = new EventQueue(eventHandlers, eventToName);

        setupMessageHandlers(this.eventQueue);
    }

    run() {
        setInterval(this.tick.bind(this), 1000);
    }

    private createUnit(event: EventCreateUnit) {
        // TODO (Alex): Validate that the user is able to create a new user

        if (this.units.filter(u => u.userId === event.userId).length > 0) {
            console.log("User already have a unit!");
            return;
        }

        this.units.push({
            id: this.nextUnitId++,
            moving: false,
            position: vec2(event.x, event.y),
            target: null,
            type: event.unitType,
            userId: event.userId
        });
    }
    
    private tick() {
        this.eventQueue.process();

        // TODO (Alex): Run simulation

        // TODO (Alex): Do something cleaver here! We don't want to broadcast everything all the time!
        this.broadcastUnits();
        
    }

    private broadcastUnits() {
        const unitCount = this.units.length;
        for (let i = 0; i < unitCount; ++i) {
            const unit = this.units[i];
            this.wss.clients.forEach(ws => {
                ws.send(JSON.stringify({
                    type: WSServerMessageTypes.Unit,
                    unit: unit
                }));
            })
        }
    }
}
