import * as Phaser from "phaser";
import { login } from "../api/authentication";
import { setSocketToken, setSocketMessageHandler, FuncMessageHandler, forceCloseClientSocket } from "../api/ws-client";
import { WSServerMessageTypes } from "../../common/api/ws-messages";

export enum SceneNames {
    Menu = "menu",
    Game = "game"
}

export class SceneMenu extends Phaser.Scene {
    
    private login: HTMLElement;
    private btnLogin: HTMLButtonElement;
    private inputUsername: HTMLInputElement;
    private inputPassword: HTMLInputElement;

    constructor() {
        super({key: SceneNames.Menu});

        this.login = document.getElementById("login");
        this.btnLogin = <HTMLButtonElement>document.getElementById("btn_login");
        this.inputUsername = <HTMLInputElement>document.getElementById("input_username");
        this.inputPassword = <HTMLInputElement>document.getElementById("input_password");

        this.btnLogin.onclick = async () => {
            const response = await login(this.inputUsername.value, this.inputPassword.value);
            if (response) {
                setSocketToken(response.token);
                this.login.classList.add("hidden");
                this.scene.start(SceneNames.Game);
            }
        };
    }

    preload() {
        this.login.classList.remove("hidden");
        this.inputUsername.value = "";
        forceCloseClientSocket();
    }

    create() {
    }
}


export class SceneGame extends Phaser.Scene {
    
    private messageHandlers: FuncMessageHandler[] = [];

    constructor() {
        super({key: SceneNames.Game});

        this.messageHandlers[WSServerMessageTypes.Connected] = (message) => {
            console.log("Connected!");
        };
        this.messageHandlers[WSServerMessageTypes.Disconnected] = (message) => {
            forceCloseClientSocket();
            this.scene.start(SceneNames.Menu);
        }
    }

    preload() {
        setSocketMessageHandler(this.messageHandlers)
    }

    create() {
    }

    update() {
    }
}
