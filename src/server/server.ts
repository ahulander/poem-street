/*
    
    Server Entry Point

*/

import * as express from "express";
import * as http from 'http';
import * as bodyParse from "body-parser";
import { setupEndpoints } from "./endpoints/endpoints";
import { createWebSocketServer } from "./network/ws-server";
import { Game } from "./game/game";

const app = express();

app.use(express.static("public"));
app.use(bodyParse.json());

const server = http.createServer(app);
const wss = createWebSocketServer(server);

const game = new Game(wss);

setupEndpoints(app);

//initialize a simple http server

game.run();

//start our server
server.listen(8080, () => {
    console.log(`Server started :)`);
});

//TODO: come up with a good way of sharing stuff around
export default game;