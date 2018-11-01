/*
    
    Server Entry Point

*/

import * as express from "express";
import * as http from 'http';
import * as bodyParse from "body-parser";
import { setupEndpoints } from "./endpoints";
import { createWebSocketServer } from "./ws-server";
import { WSServerMessageTypes } from "../common/api/ws-messages";

const app = express();

app.use(express.static("public"));
app.use(bodyParse.json());

setupEndpoints(app);

//initialize a simple http server
const server = http.createServer(app);

const wss = createWebSocketServer(server);

setInterval(() => {
    wss.clients.forEach(client => {
        client.send(JSON.stringify({type: WSServerMessageTypes.Sing}));
    })
}, 1000);

//start our server
server.listen(8080, () => {
    console.log(`Server started :)`);
});




