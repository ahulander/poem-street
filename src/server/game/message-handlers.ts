import { setMessageHandlers, FuncMessageHandler } from "../network/ws-server";
import { getUserSession } from "../user/user-sessions";
import { ClientMessage, WSServerMessageTypes, WSClientMessageTypes, CMCreateUnit } from "../../common/api/ws-messages";
import { EventQueue } from "../../common/event-queue";
import { EventCreateUnit, EventTypes } from "./game";

/*
    Handles incomming web socket messages and generates the corresponding events
*/

function connecting(message: ClientMessage) {
    const session = getUserSession(message.token);
    session.socket.send(JSON.stringify({
        type: WSServerMessageTypes.Connected
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

export function setupMessageHandlers(eventQueue: EventQueue) {

    const messageHandlers: FuncMessageHandler[] = [];
    messageHandlers[WSClientMessageTypes.Connecting] = connecting;
    messageHandlers[WSClientMessageTypes.CreateUnit] = createUnit.bind(null, eventQueue);

    setMessageHandlers(messageHandlers);
}
