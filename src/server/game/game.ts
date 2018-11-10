import * as WebSocket from 'ws';
import { EventQueue } from "../../common/event-queue";
import { setupMessageHandlers } from "./message-handlers";
import { tick } from "../../common/entities/unit";
import { vec2 } from "../../common/math/vector2";
import { WSServerMessageTypes } from '../../common/api/ws-messages';
import { setFixedInterval } from '../../common/utility';
import { UnitManager } from './unit-manager';
import { foreachOpenUserSession } from '../user/user-sessions';
import { Time } from '../../common/time';

export enum EventTypes {
    CreateUnit = 0,
    MoveUnit
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

export interface EventMoveUnit extends BaseEvent {
    userId: number;
    unitId: number;
    x: number;
    y: number;
}

function eventToName(type) {
    return type;
}

export class Game {
    
    private readonly wss: WebSocket.Server;

    private eventQueue: EventQueue;

    private units: UnitManager = new UnitManager();

    constructor(wss: WebSocket.Server) {
        
        this.wss = wss;

        const eventHandlers: any[] = [];
        eventHandlers[EventTypes.CreateUnit] = this.createUnit.bind(this);
        eventHandlers[EventTypes.MoveUnit] = this.moveUnit.bind(this);
        this.eventQueue = new EventQueue(eventHandlers, eventToName);

        setupMessageHandlers(this.eventQueue);
    }

    run() {
        Time.deltaTime = 1.0;
        setFixedInterval(this.tick.bind(this), 1000);
    }

    private moveUnit(event: EventMoveUnit) {

        const unit = this.units.findById(event.unitId);
        if (unit && unit.userId === event.userId) {
            unit.moving = true;
            unit.target = vec2(event.x, event.y);
        }
        else {
            console.warn("Failed to move unit!");
            console.log(event);
            console.log(unit);
        }
    }

    private createUnit(event: EventCreateUnit) {
        // TODO (Alex): Validate that the user is able to create a new user

        this.units.createUnit(event.userId, event.unitType, event.x, event.y);
    }
    
    private tick() {
        this.eventQueue.process();

        this.simulate();

        this.broadcastUnits(); 
    }

    private simulate() {
        this.units.foreach(tick);
    }

    private broadcastUnits() {
        foreachOpenUserSession((session) => {
            
            // TODO: Only send relevant data. No need to broadcast everything
            this.units.foreach(unit => {
                session.socket.send(JSON.stringify({
                    type: WSServerMessageTypes.Unit,
                    unit: unit
                }));
            });

        });
    }
}
