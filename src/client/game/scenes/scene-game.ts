import * as API from "../../api";
import { Scene } from "./scene";
import { SceneNames } from "./scene-utility";
import CWS, { FuncMessageHandler } from "../../api/ws-client";
import { UnitData, tick, UnitType } from "../../../common/entities/unit";
import { WSServerMessageTypes, SMUnit, CMMoveUnit, CMCreateUnit, WSClientMessageTypes, SMUnitMoved } from "../../../common/api/ws-messages";
import { Assets } from "../../assets/assets";
import { UnitManager } from "../../../common/entities/unit-manager";

export class SceneGame extends Scene {
    
    private messageHandlers: FuncMessageHandler[] = [];
    private units: UnitManager = new UnitManager();

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
        this.messageHandlers[WSServerMessageTypes.UnitMoved] = this.unitMoved.bind(this);
    }

    hello() {
        CWS.setMessageHandler(this.messageHandlers);

        this.inputManager.onRightClick = (mouse) => {
            const units = this.units.findByUserId(CWS.getUserId());
            if (units && units[0]) { 
                const unit = units[0];
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
            const units = this.units.findByUserId(CWS.getUserId());
            if (!units || !units[0]) {
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

        this.units.foreach(unit => {
            tick(unit);
            this.drawUnit(unit);
        });
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

    private unitMoved(message: SMUnitMoved) {
        const unit = this.units.findById(message.unitId);
        if (unit) {
            unit.target = {
                x: message.targetX,
                y: message.targetY
            }
            unit.moving = true;
        }
    }

    private receivedUnit(message: SMUnit) {
        const unit = this.units.findById(message.unit.id);        
        if (unit) {
            unit.moving = message.unit.moving;
            unit.position = message.unit.position;
            unit.target = message.unit.target;
        }
        else {
            const newUnit = message.unit;
            this.units.createUnit(newUnit.userId, newUnit.type, newUnit.position.x, newUnit.position.y);
        }
    }
}
