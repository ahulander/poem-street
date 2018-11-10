import * as API from "../../api";
import { Scene } from "./scene";
import { SceneNames } from "./scene-utility";
import CWS, { FuncMessageHandler } from "../../api/ws-client";
import { UnitData, tick, UnitType } from "../../../common/entities/unit";
import { WSServerMessageTypes, SMUnit, CMMoveUnit, CMCreateUnit, WSClientMessageTypes } from "../../../common/api/ws-messages";
import { Assets } from "../../assets/assets";

export class SceneGame extends Scene {
    
    private lastFrame = 0;

    private messageHandlers: FuncMessageHandler[] = [];
    private units: UnitData[] = [];

    constructor() {
        super(SceneNames.Game);

        this.messageHandlers[WSServerMessageTypes.Connected] = (message) => {
            console.log("Wat, I should already be connected!");
        };
        this.messageHandlers[WSServerMessageTypes.Disconnected] = (message) => {
            CWS.forceClose();
            API.setToken(null);
            this.gotoScene(SceneNames.Menu);
        }
        this.messageHandlers[WSServerMessageTypes.Unit] = this.receivedUnit.bind(this);
    }

    hello() {
        CWS.setMessageHandler(this.messageHandlers);

        this.inputManager.onRightClick = (mouse) => {
            const unit = this.units.find(u => u.userId === CWS.getUserId());
            if (unit) { 
                unit.moving = false;
                CWS.sendMessage(<CMMoveUnit>{
                    type: WSClientMessageTypes.MoveUnit,
                    unitId: unit.id,
                    x: mouse.worldX,
                    y: mouse.worldY
                })
            }
        };

        this.inputManager.onLeftClick = (mouse) => {
            const unit = this.units.find(u => u.userId === CWS.getUserId());
            if (!unit) {
                CWS.sendMessage(<CMCreateUnit>{
                    type: WSClientMessageTypes.CreateUnit,
                    unitType: Math.random() > 0.5 ? UnitType.Human : UnitType.Dog,
                    x: mouse.worldX,
                    y: mouse.worldY
                });
            }
        };
    }

    update() {

        for (let i = 0; i < this.units.length; ++i) {
            tick(this.units[i]);
            this.drawUnit(this.units[i]);
        }

    }

    private drawUnit(unit: UnitData) {
        this.spriteRenderer.draw({
            x: unit.position.x,
            y: unit.position.y,
            width: 32,
            height: 32,
            textureName: Assets.Textures.Test,
            textureRect: [
                0,0,
                32,32
            ]
        });

        if (unit.userId === CWS.getUserId()) {
            this.fovRenderer.drawCircle({
                radius: 200,
                x: unit.position.x,
                y: unit.position.y
            });
        }
    }

    private receivedUnit(message: SMUnit) {
        const unit = this.units.find(u => u.id === message.unit.id);
        if (unit) {
            unit.moving = message.unit.moving;
            unit.position = message.unit.position;
            unit.target = message.unit.target;
        }
        else {
            this.units.push(message.unit);
        }
    }
}
