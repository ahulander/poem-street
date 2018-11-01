
// Message types sent by the server to the client
export enum WSServerMessageTypes {
    Connected = 0,
    Disconnected
}

// Message types sent by the client to the server
export enum WSClientMessageTypes {
    Connecting = 0,
    
}


export interface BaseClientMessage {
    // This is set by the ws-client, no need to assign it manually
    token?: string;
    type: WSClientMessageTypes;
}

export interface BaseServerMessage {
    type: WSServerMessageTypes;
}
