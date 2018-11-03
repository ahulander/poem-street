import { parseMessage } from "../../common/utility";
import { ServerMessage, WSClientMessageTypes, ClientMessage, WSServerMessageTypes } from "../../common/api/ws-messages";

export type FuncMessageHandler = (message: ServerMessage) => void;

export interface ClientWebSocket extends WebSocket {
    token: string;
}

let _internalClient: ClientWebSocket = null;
let _internalMessageHandlers: FuncMessageHandler[] = null;

function validateMessage(ws: ClientWebSocket, message: ServerMessage) {
    return message && ws && _internalMessageHandlers && _internalMessageHandlers[message.type];
}

function handleMessage(message: ServerMessage) {
    if (validateMessage(_internalClient, message)) {
        _internalMessageHandlers[message.type](message);
    }
}

function setupClient(token: string) {
    const socket = <ClientWebSocket>new WebSocket(`ws://${location.host}`);
    socket.token = token;

    // Listen for messages
    socket.addEventListener('message', function (event) {
        const message: ServerMessage = parseMessage(event.data);
        handleMessage(message);
    });

    // Connection opened
    socket.addEventListener('open', function (event) {
        console.log("Connecting...");
        sendMessage({type: WSClientMessageTypes.Connecting});
    });

    socket.addEventListener("close", event => {
        console.log("Socket closed!");
        const message: ServerMessage = { type: WSServerMessageTypes.Disconnected };
        handleMessage(message);
        _internalClient = null;
    });

    return socket;
}

function forceClose() {
    if (!_internalClient) {
        return;
    }

    _internalClient.close();
    _internalClient = null;
}

function setMessageHandler(messageHandlers: FuncMessageHandler[]) {
    _internalMessageHandlers = messageHandlers;
}

function connect(token: string) {
    if (_internalClient) {
        console.warn("WS still open! Make sure the connection to the server is closed before opening a new one");
        _internalClient.close();
    }
    
    _internalClient = setupClient(token);

    if (!_internalClient) {
        console.warn("Failed to set ws token! No client socket open");
    }
}

function sendMessage(message: ClientMessage) {
    if (!_internalClient) {
        console.warn("Failed to send ws message! No client socket open");
        return;
    }

    message.token = _internalClient.token;
    _internalClient.send(JSON.stringify(message));
}

const CWS = {
    sendMessage,
    connect,
    setMessageHandler,
    forceClose
};

export default CWS;
