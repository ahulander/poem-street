import CWS, { FuncMessageHandler } from "../../api/ws-client";
import { SceneNames } from "./scene-utility";
import { WSServerMessageTypes, CMCreateUnit, WSClientMessageTypes } from "../../../common/api/ws-messages";
import * as API from "../../api";

export class SceneGame extends Phaser.Scene {
    
    private messageHandlers: FuncMessageHandler[] = [];
    
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
            CWS.sendMessage(<CMCreateUnit>{
                type: WSClientMessageTypes.CreateUnit,
                unitType: 0,
                x: pointer.worldX,
                y: pointer.worldY
            });            
        }, this);
    }

    update() {
    }
}
