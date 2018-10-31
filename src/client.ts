import { Player } from "./common/player";

var player = new Player();
player.name = "Filip";

console.log(player);

console.log("Hej");
console.log("Tjenare");




fetch('/login').then(response => response.json().then(loginResponse => {

    console.log('Login');

    // Create WebSocket connection.
    const socket = new WebSocket('ws://192.168.1.168:8080');

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

    document.getElementById("btn").onclick = function () {
        socket.send(JSON.stringify({token: -1}));
    }

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({token: loginResponse.token}));
    });
}));


