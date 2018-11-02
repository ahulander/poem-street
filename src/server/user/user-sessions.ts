import * as WebSocket from 'ws';

export interface WebSocket2 extends WebSocket {
    userToken: string;
    sequenceId: number;
}

export interface Map<TType> {
    [key: string]: TType;
}

export interface UserSession {
    name: string;
    socket: WebSocket2;
    expires: number;
}

const userSessions: Map<UserSession> = {}
const usernameToToken: Map<string> = {}

export function kickUserSession(token: string) {
    if (userSessions[token] && userSessions[token].socket) {
        console.log("Kicking out previous user session!");
        userSessions[token].socket.close();
    }
    userSessions[token] = null;
    delete userSessions[token];
}

export function getUserSession(token: string) {
    
    let result = userSessions[token];

    if (result && Date.now() > result.expires) {
        kickUserSession(token);
        result = null;
    }

    return result;
}

export function setUserSession(username: string, token: string) {
    const previousToken = usernameToToken[username];
    if (previousToken && userSessions[previousToken]) {
        kickUserSession(previousToken);
    }
    
    const expiresIn = 12 * 60 * 60 * 1000;
    userSessions[token] = {
        name: username,
        socket: null,
        expires: Date.now() + expiresIn
    };
    usernameToToken[username] = token;
}
