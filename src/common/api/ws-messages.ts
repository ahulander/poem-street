
// Message types sent by the server to the client
export enum WSServerMessageTypes {
    Welcome = 0,
    Sing
}

// Message types sent by the client to the server
export enum WSClientMessageTypes {
    Connecting = 0,
    Song
}


export interface BaseClientMessage {
    token: string;
    type: WSClientMessageTypes;
}

export interface BaseServerMessage {
    type: WSServerMessageTypes;
}
