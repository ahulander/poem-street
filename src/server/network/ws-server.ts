
import * as http from 'http';
import * as WebSocket from 'ws';
import UserSession, { WebSocket2 } from '../user/user-sessions';
import { parseMessage } from '../../common/utility';
import { ClientMessage, WSServerMessageTypes, WSClientMessageTypes } from '../../common/api/ws-messages';

export type FuncMessageHandler = (message: any) => void;

/*
    Helper functions
*/



function validateMessage(message: ClientMessage, socket: WebSocket2) {

    const session = UserSession.getByToken(message.token);
    return message.token
        && session
        && (!session.socket || session.socket.sequenceId === socket.sequenceId)
        && _messageHandlers[message.type];
}

function extractReason(message, socket: WebSocket2) {
    
    if (!message) {
        return "No message!";
    }
    else if (!message.token) {
        return "No token received!";
    }

    const session = UserSession.getByToken(message.token);
    if (!session) {
        return "No user session!";
    }
    else if (session.socket && session.socket.sequenceId !== socket.sequenceId) {
        return "Valid token received from different web socket. Token might have been compromised!";
    }
    else if (!_messageHandlers[message.type]) {
        return `No message handler available for: ${WSClientMessageTypes[message.type]}(${message.type})`;
    }
    return `Unknown error when validating incomming message: "${message}"`;
}

function hasUserSession(ws: WebSocket2) {
    return ws.userToken;
}

function disconnectWebSocket(ws: WebSocket2) {
    console.log(`Disconnected: ${ws.userToken}`);
    ws.userToken = null;
    ws.close();
}

function connectWebSocket(ws: WebSocket2, token: string) {
    
    const session = UserSession.getByToken(token);
    if (session.socket) {
        disconnectWebSocket(session.socket);
    }

    ws.userToken = token;
    session.socket = ws;
}

function handleMessage(message: ClientMessage) {
    _messageHandlers[message.type](message);
}

let _messageHandlers: FuncMessageHandler[];
export function setMessageHandlers(messageHandlers: FuncMessageHandler[]) {
    return _messageHandlers = messageHandlers;
}

let nextWebSocketSequenceId = 0;
export function createWebSocketServer(server: http.Server) {
    
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws: WebSocket2, req) => {

        ws.sequenceId = (nextWebSocketSequenceId + 1) % 10000000;

        //connection is up, let's add a simple simple event
        ws.on('message', (messageJson: string) => {
            const message: ClientMessage = parseMessage(messageJson);
            if (!message || !validateMessage(message, ws)) {
                const reason = extractReason(message, ws);
                console.warn(`Invalid message received from a client!\n${reason}`);
                if (hasUserSession(ws)) {
                    disconnectWebSocket(ws);
                }
                ws.close();
            }
            else {
                if (!hasUserSession(ws)) {
                    connectWebSocket(ws, message.token);
                }
                handleMessage(message);
            }
        });

        ws.on("close", () => {
            console.log("Socket closed!");
            if (hasUserSession(ws)) {
                UserSession.kick(ws.userToken);
                disconnectWebSocket(ws);
            }
        });
    });

    return wss;
}
