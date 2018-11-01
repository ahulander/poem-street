import { parseMessage } from "../../common/utility";
import { BaseServerMessage, WSClientMessageTypes, BaseClientMessage, WSServerMessageTypes } from "../../common/api/ws-messages";

export type FuncMessageHandler = (message: BaseServerMessage) => void;

export interface ClientWebSocket extends WebSocket {
    token: string;
    messageHandlers: FuncMessageHandler[];
}

function validateMessage(ws: ClientWebSocket, message: BaseServerMessage) {
    return message && ws && ws.messageHandlers && ws.messageHandlers[message.type];
}

function handleMessage(message: BaseServerMessage) {
    if (validateMessage(_internalClient, message)) {
        _internalClient.messageHandlers[message.type](message);
    }
}

function setupClient() {
    const socket = <ClientWebSocket>new WebSocket(`ws://${location.host}`);

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        const message: BaseServerMessage = parseMessage(event.data);
        handleMessage(message);
    });

    // Connection opened
    socket.addEventListener('open', function (event) {
        console.log("Connecting...");
        sendMessage({type: WSClientMessageTypes.Connecting});
    });

    socket.addEventListener("close", event => {
        console.log("Socket closed!");
        const message: BaseServerMessage = { type: WSServerMessageTypes.Disconnected };
        handleMessage(message);
        _internalClient = null;
    });

    return socket;
}

let _internalClient: ClientWebSocket = null;
function getClientSocket() {
    if (!_internalClient) {
        _internalClient = setupClient();
    }

    return _internalClient;
}

export function forceCloseClientSocket() {
    if (!_internalClient) {
        return;
    }

    _internalClient.close();
    _internalClient = null;
}

export function setSocketMessageHandler(messageHandlers: FuncMessageHandler[]) {
    const client = getClientSocket();

    if (!client) {
        console.warn("Failed to set message handlers! No client socket open");
        return;
    }

    client.messageHandlers = messageHandlers;
}

export function setSocketToken(token: string) {
    const client = getClientSocket();

    if (!client) {
        console.warn("Failed to set ws token! No client socket open");
        return;
    }

    client.token = token;
}

export function sendMessage(message: BaseClientMessage) {
    const client = getClientSocket();

    if (!client) {
        console.warn("Failed to send ws message! No client socket open");
        return;
    }

    message.token = client.token;
    client.send(JSON.stringify(message));
}

