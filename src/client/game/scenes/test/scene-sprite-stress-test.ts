import { Scene } from "../scene-manager";
import { TextureNames } from "../../rendering/textures";
import { SceneNames } from "../scene-utility";

export class SceneSpriteStressTest extends Scene {

    private interval: NodeJS.Timeout;
    private frameCount = 0;

    constructor() {
        super(SceneNames.TestSpriteStress);
    }

    hello() {
        this. interval = setInterval(() => {
            console.log(this.frameCount);
            this.frameCount = 0;
        }, 1000);

        this.frameCount = 0;
    }

    goodbye() {
        clearInterval(this.interval);
    }

    update () {
        this.frameCount++;

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
                textureName: TextureNames.Tiles
            });
        }
    }

}
