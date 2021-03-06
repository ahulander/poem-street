import { Scene } from "../scene";
import { SceneNames } from "../scene-utility";
import { Assets } from "../../../assets/assets";
import { setFixedInterval, FixedTimeout, clearFixedInterval } from "../../../../common/utility";

export class SceneSeizure extends Scene {
    
    private seziueEnabled = false;

    private trailUpdateInterval: FixedTimeout;
    private trail: {x: number, y: number}[] = [];

    constructor() {
        super(SceneNames.TestSeizure);
    }

    hello() {
        this.inputManager.onLeftClick = () => {
            this.seziueEnabled = !this.seziueEnabled;
        }

        this.trailUpdateInterval = setFixedInterval(() => {
            if (this.trail.length > 10) {
                this.trail.splice(0, 1);
            }
            const mouse = this.inputManager.getMouseState();
            this.trail.push({
                x: mouse.worldX,
                y: mouse.worldY
            });
        }, 50);

        this.trail = [];
        this.seziueEnabled = false;
    }

    goodbye() {
        clearFixedInterval(this.trailUpdateInterval);
    }

    update() {
        
        this.fovRenderer.clear();

        if (this.seziueEnabled) {
            const count = Math.floor(Math.random() * 5000);
            for (let i = 0; i < count; ++i) {
                const x = (1 - Math.random() * 2) * 800;
                const y = (1 - Math.random() * 2) * 400;
                const u = Math.floor(Math.random() * 32) * 32;
                const v = Math.floor(Math.random() * 32) * 32;
                this.spriteRenderer.draw({
                    x, y,
                    width: 32, height: 32,
                    textureRect: [
                        u, v,
                        u + 32, v + 32
                    ],
                    // This is like worst case possible
                    textureName: Math.random() > 0.5 ? Assets.Textures.Tiles : Assets.Textures.RedTiles,
                    layer: -10
                });
            }
        }

        for (let i = 0; i < this.trail.length; ++i) {
            const t = this.trail[i];
            this.spriteRenderer.draw({
                x: t.x, y: t.y,
                width: 32.0 * (i + 1.0) / 4.0,
                height: 32.0 * (i + 1.0) / 4.0,
                layer: 10 - i,
                textureRect: [
                    0, 0,
                    32, 32
                ],
                textureName: Assets.Textures.Tiles
            });
        }
    }
}
