import { login } from "./api/authentication";
import { WSClientMessageTypes, BaseServerMessage, WSServerMessageTypes } from "../common/api/ws-messages";
import { parseMessage } from "../common/utility";

/*

    Client Main Entry Point!

*/

function welcome(message: BaseServerMessage) {
    console.log("Welcome!");
}

function sing(message: BaseServerMessage) {
    console.log("Server is sing a song");
}

type FuncMessageHandler = (message: any) => void;
const messageHandlers: FuncMessageHandler[] = [];
messageHandlers[WSServerMessageTypes.Welcome] = welcome;
messageHandlers[WSServerMessageTypes.Sing] = sing;

function validateMessage(message: BaseServerMessage) {
    return message && messageHandlers[message.type];
}

function startGame(token: string) {
    console.warn("No game to start!");

    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:8080');

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        const message: BaseServerMessage = parseMessage(event.data);
        if (validateMessage(message)) {
            messageHandlers[message.type](message);
        }
    });

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({token: token, type: WSClientMessageTypes.Connecting}));
    });

    document.getElementById("btn_song").onclick  = () => {
        socket.send(JSON.stringify({token: token, type: WSClientMessageTypes.Song}));
    };

    socket.addEventListener("close", event => {
        console.log("Socket closed!");
    });
}

function setupLogin() {
    const btnLogin = document.getElementById("btn_login");
    btnLogin.onclick = async () => {
        const inputUsername = <HTMLInputElement>document.getElementById("input_username");
        const response = await login(inputUsername.value);
        if (response) {
            startGame(response.token);
        }
    }
}

async function initGame() {
    setupLogin();
}

document.addEventListener("DOMContentLoaded", () => {
    initGame();
});
