import CWS, { FuncMessageHandler } from "../../api/ws-client";
import { SceneNames } from "./scene-utility";
import { WSServerMessageTypes, CMCreateUnit, WSClientMessageTypes, SMUnit, CMMoveUnit } from "../../../common/api/ws-messages";
import * as API from "../../api";
import { UnitData, tick } from "../../../common/entities/unit";
import { SpritePool } from "../rendering/sprite-pool";

export class SceneGame extends Phaser.Scene {
    
    private messageHandlers: FuncMessageHandler[] = [];
    
    private sprites: SpritePool;

    private units: UnitData[] = [];

    constructor() {
        super({key: SceneNames.Game});

        this.sprites = new SpritePool(this);

        this.messageHandlers[WSServerMessageTypes.Connected] = (message) => {
            console.log("Wat, I should already be connected!");
        };
        this.messageHandlers[WSServerMessageTypes.Disconnected] = (message) => {
            CWS.forceClose();
            API.setToken(null);
            this.scene.start(SceneNames.Menu);
        }
        this.messageHandlers[WSServerMessageTypes.Unit] = this.receivedUnit.bind(this);
    }

    receivedUnit(message: SMUnit) {
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

    preload() {
        CWS.setMessageHandler(this.messageHandlers);
        this.load.image("test", "assets/test.png");
    }

    create() {
        this.input.on("pointerdown", (pointer) => {
            
            if (pointer.buttons === 4) {
                API.logout();
            }

            const unit = this.units.find(u => u.userId === CWS.getUserId());
            if (unit) { 
                unit.moving = false;
                CWS.sendMessage(<CMMoveUnit>{
                    type: WSClientMessageTypes.MoveUnit,
                    unitId: unit.id,
                    x: pointer.worldX,
                    y: pointer.worldY
                })
            }
            else {
                CWS.sendMessage(<CMCreateUnit>{
                    type: WSClientMessageTypes.CreateUnit,
                    unitType: 0,
                    x: pointer.worldX,
                    y: pointer.worldY
                });
            }
        }, this);
    }

    drawUnit(unit: UnitData) {
        const sprite = this.sprites.get();
        sprite.tilePositionX = 32 * unit.type;
        sprite.setPosition(unit.position.x, unit.position.y);
        sprite.setSize(32, 32);
        sprite.setOrigin(0.5, 0.5);
    }

    private lastFrame = 0;

    update() {

        const now = Date.now();
        const dt = (now - this.lastFrame) / 1000.0;
        this.lastFrame = now;

        for (let i = 0; i < this.units.length; ++i) {
            tick(this.units[i], dt);
        }

        this.sprites.clear();
        for (let i = 0; i < this.units.length; ++i) {
            this.drawUnit(this.units[i]);
        }
    }
}
