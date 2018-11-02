import { SceneNames } from "./scene-utility";
import CWS, { FuncMessageHandler } from "../api/ws-client";
import * as API from "../api";
import { WSClientMessageTypes, WSServerMessageTypes, ConnectedToServer } from "../../common/api/ws-messages";

export class SceneMenu extends Phaser.Scene {
    
    private login: HTMLElement;
    private btnLogin: HTMLButtonElement;
    private inputUsername: HTMLInputElement;
    private inputPassword: HTMLInputElement;

    private messageHandlers: FuncMessageHandler[] = [];

    constructor() {
        super({key: SceneNames.Menu});

        this.login = document.getElementById("login");
        this.btnLogin = <HTMLButtonElement>document.getElementById("btn_login");
        this.inputUsername = <HTMLInputElement>document.getElementById("input_username");
        this.inputPassword = <HTMLInputElement>document.getElementById("input_password");

        this.login.onsubmit = (event) => {
            event.preventDefault();
        }
        this.btnLogin.onclick = this.requestLogin.bind(this);

        this.messageHandlers[WSServerMessageTypes.Connected] = this.connectedToServer.bind(this);
    }

    private async requestLogin() {
        const response = await API.login(this.inputUsername.value, this.inputPassword.value);
        if (response) {
            CWS.connect(response.token);
        }
    }

    private connectedToServer(message: ConnectedToServer) {
        console.log("Connected");
        this.login.classList.add("hidden");
        this.scene.start(SceneNames.Game);
    }

    preload() {
        this.login.classList.remove("hidden");
        this.inputPassword.value = "";
        CWS.setMessageHandler(this.messageHandlers);
        CWS.forceClose();
    }

    create() {
    }
}
