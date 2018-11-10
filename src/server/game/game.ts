import * as WebSocket from 'ws';
import { EventQueue } from "../../common/event-queue";
import { setupMessageHandlers } from "./message-handlers";
import { UnitData, tick } from "../../common/entities/unit";
import { vec2 } from "../../common/math/vector2";
import { WSServerMessageTypes } from '../../common/api/ws-messages';
import { GameWorld } from './game-world';
import { setFixedInterval } from '../../common/utility';

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

    private nextUnitId: number = 0;
    private units: UnitData[] = [];

    private gameWorld_: GameWorld;

    private static instance_: Game;

    constructor(wss: WebSocket.Server) {
        
        this.wss = wss;

        const eventHandlers: any[] = [];
        eventHandlers[EventTypes.CreateUnit] = this.createUnit.bind(this);
        eventHandlers[EventTypes.MoveUnit] = this.moveUnit.bind(this);
        this.eventQueue = new EventQueue(eventHandlers, eventToName);

        setupMessageHandlers(this.eventQueue);

        this.gameWorld_ = new GameWorld(100);

    }

    public static get instance() : Game {
      return this.instance_ || undefined;
    }

    public getGameWorldViewModel() {
      return this.gameWorld_.getWorldViewModel();
    }

    run() {
        setFixedInterval(this.tick.bind(this), 1000);
    }

    private moveUnit(event: EventMoveUnit) {
        const unit = this.units.find(u => u.id === event.unitId && u.userId === event.userId);
        if (unit) {
            unit.moving = true;
            unit.target = vec2(event.x, event.y);
        }
        else {
            console.warn("Failed to move unit!");
            console.log(event);
        }
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

        this.simulate();

        // TODO (Alex): Do something cleaver here! We don't want to broadcast everything all the time!
        this.broadcastUnits(); 
    }

    private simulate() {
        const unitCount = this.units.length;
        for (let i = 0; i < unitCount; ++i) {
            tick(this.units[i], 1.0);
        }
    }

    private broadcastUnits() {
        const unitCount = this.units.length;
        for (let i = 0; i < unitCount; ++i) {
            const unit = this.units[i];
            this.wss.clients.forEach(ws => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        type: WSServerMessageTypes.Unit,
                        unit: unit
                    }));
                }
            });
        }
    }
}
