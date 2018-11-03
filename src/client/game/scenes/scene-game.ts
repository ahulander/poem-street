import CWS, { FuncMessageHandler } from "../../api/ws-client";
import { SceneNames } from "./scene-utility";
import { WSServerMessageTypes } from "../../../common/api/ws-messages";
import * as API from "../../api";

export class SceneGame extends Phaser.Scene {
    
    private messageHandlers: FuncMessageHandler[] = [];
    private clicks = 0;

    constructor() {
        super({key: SceneNames.Game});

        this.messageHandlers[WSServerMessageTypes.Connected] = (message) => {
            console.log("Wat, I should already be connected!");
        };
        this.messageHandlers[WSServerMessageTypes.Disconnected] = (message) => {
            CWS.forceClose();
            API.setToken(null);
            this.scene.start(SceneNames.Menu);
        }
    }

    preload() {
        CWS.setMessageHandler(this.messageHandlers);
        this.load.image("test", "assets/test.png");
    }

    create() {
        this.input.on("pointerdown", (pointer) => {
            
            if (pointer.buttons === 4) {
                API.logout();
            }

            this.clicks += 1;
        }, this);
    }

    update() {
    }
}
