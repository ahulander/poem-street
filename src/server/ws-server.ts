
import * as http from 'http';
import * as WebSocket from 'ws';
import { getUserSession, WebSocket2 } from './user-sessions';
import { parseMessage } from '../common/utility';
import { BaseClientMessage, WSServerMessageTypes, WSClientMessageTypes } from '../common/api/ws-messages';


/*
    Message handlers
    NOTE: Only the token and message type have been validated when the message handlers is called.
        any additional data needs to validated first!

    TODO (Alex): Should probably move each handler to its own file.
*/

type FuncMessageHandler = (message: any) => void;

function connecting(message: BaseClientMessage) {
    console.log("Client connecting...");
}

function song(message: BaseClientMessage) {
    console.log("Client is singing a song!");
}

const messageHandlers: FuncMessageHandler[] = [];
messageHandlers[WSClientMessageTypes.Connecting] = connecting;
messageHandlers[WSClientMessageTypes.Song] = song;




/*
    Helper functions
*/

function validateMessage(message: BaseClientMessage) {
    const session = getUserSession(message.token);
    return message && message.token && session && messageHandlers[message.type];
}

function extractReason(message) {
    if (!message) {
        return "No message!";
    }
    if (!message.token) {
        return "No token received!";
    }
    if (!getUserSession(message.token)) {
        return "No user session!";
    }
    if (!messageHandlers[message.type]) {
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
    
    const session = getUserSession(token);
    if (session.socket) {
        disconnectWebSocket(session.socket);
    }

    ws.userToken = token;
    session.socket = ws;
    console.log(`Connected: ${token}`);
}

function handleMessage(message: BaseClientMessage) {
    messageHandlers[message.type](message);
}

export function createWebSocketServer(server: http.Server) {
    
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws: WebSocket2, req) => {

        //connection is up, let's add a simple simple event
        ws.on('message', (messageJson: string) => {
    
            console.log(messageJson);
    
            const message: BaseClientMessage = parseMessage(messageJson);
            if (!message || !validateMessage(message)) {
                const reason = extractReason(message);
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
                disconnectWebSocket(ws);
            }
        });
    
        // Send welcome message to the client!
        ws.send(JSON.stringify({type: WSServerMessageTypes.Welcome}));
    });

    return wss;
}
