import { login } from "./api/authentication";
import { LoginResponse } from "../common/api/authentication";

/*

    Client Main Entry Point!

*/

function startGame(token: string) {
    console.warn("No game to start!");

    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:8080');

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({token: token}));
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
