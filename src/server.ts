
import * as express from "express";
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();

app.use(express.static("public"));

let nextId = 0;

var users = {};

app.get('/login', (req, res) => {
    
    console.log('Login!');
    res.send({token: nextId});
    users[nextId] = {name: nextId};


    nextId++;
});

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket, req) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (messageJson: string) => {

        const message = JSON.parse(messageJson);

        console.log(users);
        console.log(message);

        if (users[message.token] == undefined) {
            ws.send(`Non no`);
            return;
        }
        
        ws.send(`Have a cookie!`);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(8080, () => {
    console.log(`Server started on port ? :)`);
});




