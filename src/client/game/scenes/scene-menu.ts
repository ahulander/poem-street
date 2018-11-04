import { SceneNames } from "./scene-utility";
import CWS, { FuncMessageHandler } from "../../api/ws-client";
import * as API from "../../api";
import { WSServerMessageTypes, SMConnectedToServer } from "../../../common/api/ws-messages";

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
            API.setToken(response.token);
            CWS.connect(response.token);
        }
        else {
            this.inputPassword.value = "";
            this.inputPassword.focus();
        }
    }

    private connectedToServer(message: SMConnectedToServer) {
        console.log("Connected");
        CWS.setUserId(message.userId);
        this.scene.start(SceneNames.Game);
    }

    preload() {
        this.login.classList.remove("hidden");
        this.inputPassword.value = "";
        this.inputUsername.focus();
        CWS.setMessageHandler(this.messageHandlers);
        CWS.forceClose();
    }

    create() {
        this.events.once("shutdown", () => {
            console.log("shutdown");
            this.login.classList.add("hidden");
        }, this);
    }
}
