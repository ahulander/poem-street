/*
    
    Server Entry Point

*/

import * as express from "express";
import * as http from 'http';
import * as WebSocket from 'ws';
import * as bodyParse from "body-parser";
import { setupEndpoints } from "./endpoints";

const app = express();

app.use(express.static("public"));
app.use(bodyParse.json());

setupEndpoints(app);

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket, req) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (messageJson: string) => {
        ws.send(`Hello websocket!`);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(8080, () => {
    console.log(`Server started :)`);
});




