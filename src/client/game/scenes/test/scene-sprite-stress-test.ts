import { Scene } from "../scene";
import { SceneNames } from "../scene-utility";
import { Assets } from "../../../assets/assets";

export class SceneSpriteStressTest extends Scene {

    constructor() {
        super(SceneNames.TestSpriteStress);
    }

    update () {
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
