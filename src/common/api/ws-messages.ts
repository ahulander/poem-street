
// Message types sent by the client to the server
export enum WSClientMessageTypes {
    Connecting = 0,
    CreateUnit
}

export interface ClientMessage {
    // This is set by the ws-client, no need to assign it manually
    token?: string;
    type: WSClientMessageTypes;
}

export interface CMCreateUnit  extends ClientMessage {
    unitType: number;
    x: number;
    y: number;
}

// Message types sent by the server to the client
export enum WSServerMessageTypes {
    Connected = 0,
    Disconnected
}

export interface ServerMessage {
    type: WSServerMessageTypes;
}

export interface SMConnectedToServer extends ServerMessage {
    type: WSServerMessageTypes.Connected;
}
