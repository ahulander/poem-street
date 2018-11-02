import CWS, { FuncMessageHandler } from "../api/ws-client";
import { SceneNames } from "./scene-utility";
import { WSServerMessageTypes } from "../../common/api/ws-messages";

export class SceneGame extends Phaser.Scene {
    
    private messageHandlers: FuncMessageHandler[] = [];

    constructor() {
        super({key: SceneNames.Game});

        this.messageHandlers[WSServerMessageTypes.Connected] = (message) => {
            console.log("Connected!");
        };
        this.messageHandlers[WSServerMessageTypes.Disconnected] = (message) => {
            CWS.forceClose();
            this.scene.start(SceneNames.Menu);
        }
    }

    preload() {
        CWS.setMessageHandler(this.messageHandlers);
    }

    create() {
    }

    update() {
    }
}
