import { Scene } from "../scene";
import { SceneNames } from "../scene-utility";
import { Assets } from "../../../assets/assets";
import { setFixedInterval, FixedTimeout, clearFixedInterval } from "../../../../common/utility";

export class SceneSpriteStressTest extends Scene {

    private interval: FixedTimeout;
    private frameCount = 0;

    constructor() {
        super(SceneNames.TestSpriteStress);
    }

    hello() {
        this. interval = setFixedInterval(() => {
            console.log(this.frameCount);
            this.frameCount = 0;
        }, 1000);

        this.frameCount = 0;
    }

    goodbye() {
        clearFixedInterval(this.interval);
    }

    update () {
        this.frameCount++;

        this.fovRenderer.clear();

        const count = 40000;
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
                textureName: Assets.Textures.Tiles
            });
        }
    }

}
