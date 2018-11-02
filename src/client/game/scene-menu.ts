import { SceneNames } from "./scene-utility";
import CWS from "../api/ws-client";
import * as API from "../api";

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
            const response = await API.login(this.inputUsername.value, this.inputPassword.value);
            if (response) {
                CWS.setToken(response.token);
                this.login.classList.add("hidden");
                this.scene.start(SceneNames.Game);

                setTimeout(() => {
                    console.log("Logout");
                    API.logout(response.token);
                }, 5000);
            }
        };
    }

    preload() {
        this.login.classList.remove("hidden");
        this.inputPassword.value = "";
        CWS.forceClose();
    }

    create() {
    }
}
