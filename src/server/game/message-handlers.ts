import { setMessageHandlers, FuncMessageHandler } from "../network/ws-server";
import { getUserSession } from "../user/user-sessions";
import { ClientMessage, WSServerMessageTypes, WSClientMessageTypes, CMCreateUnit, CMMoveUnit, SMConnectedToServer } from "../../common/api/ws-messages";
import { EventQueue } from "../../common/event-queue";
import { EventCreateUnit, EventTypes, EventMoveUnit } from "./game";

/*
    Handles incomming web socket messages and generates the corresponding events
*/

function connecting(message: ClientMessage) {
    const session = getUserSession(message.token);
    session.socket.send(JSON.stringify(<SMConnectedToServer>{
        type: WSServerMessageTypes.Connected,
        userId: session.userId
    }));
}

function createUnit(eventQueue: EventQueue, message: CMCreateUnit) {
    const session = getUserSession(message.token);
    
    // TODO (Alex): Validate that unit type, x and y is valid values

    eventQueue.queue<EventCreateUnit>({
        type: EventTypes.CreateUnit,
        userId: session.userId,
        unitType: message.type,
        x: message.x,
        y: message.y
    });
}

function moveUnit(eventQueue: EventQueue, message: CMMoveUnit) {
    const session = getUserSession(message.token);

    eventQueue.queue<EventMoveUnit>({
        type: EventTypes.MoveUnit,
        userId: session.userId,
        unitId: message.unitId,
        x: message.x,
        y: message.y
    });
}

export function setupMessageHandlers(eventQueue: EventQueue) {

    const messageHandlers: FuncMessageHandler[] = [];
    messageHandlers[WSClientMessageTypes.Connecting] = connecting;
    messageHandlers[WSClientMessageTypes.CreateUnit] = createUnit.bind(null, eventQueue);
    messageHandlers[WSClientMessageTypes.MoveUnit] = moveUnit.bind(null, eventQueue);

    setMessageHandlers(messageHandlers);
}
