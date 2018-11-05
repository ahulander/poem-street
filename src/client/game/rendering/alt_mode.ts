import { setupContex, clearScreenBuffer } from "./webgl/context";
import { loadTextureAssets, TextureNames } from "./webgl/textures";
import { SpriteRenderer } from "./webgl/sprite-renderer";
import { InputManager } from "./webgl/input";

function stress() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    setupContex(canvas);
    loadTextureAssets();

    const renderer = new SpriteRenderer();

    let frameCounter = 0;
    setInterval(() => {
        console.log(frameCounter);
        frameCounter = 0;
    }, 1000);

    setInterval(() => {
        frameCounter++;
        clearScreenBuffer();

        const count = 40000; // Math.floor(Math.random() * 10000);
        for (let i = 0; i < count; ++i) {
            const x = (1 - Math.random() * 2) * 800;
            const y = (1 - Math.random() * 2) * 400;
            const u = Math.floor(Math.random() * 32) * 32;
            const v = Math.floor(Math.random() * 32) * 32;
            renderer.draw({
                x, y,
                width: 32, height: 32,
                textureRect: [
                    u, v,
                    u + 32, v + 32
                ],
                textureName: TextureNames.Tiles
            });
        }
        renderer.flush();
    });
}

function seizure() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    setupContex(canvas);
    loadTextureAssets();
    
    const inputManager = new InputManager(document.getElementById("canvas"));

    const renderer = new SpriteRenderer();

    let seziueEnabled = false;
    inputManager.onLeftClick = () => {
        seziueEnabled = !seziueEnabled;
    }

    const trail = [];
    setInterval(() => {
        if (trail.length > 10) {
            trail.splice(0, 1);
        }
        const mouse = inputManager.getMouseState();
        trail.push({
            x: mouse.worldX,
            y: mouse.worldY
        });
    }, 50);

    setInterval(() => {

        clearScreenBuffer();

        if (seziueEnabled) {
            const count = Math.floor(Math.random() * 5000);
            for (let i = 0; i < count; ++i) {
                const x = (1 - Math.random() * 2) * 800;
                const y = (1 - Math.random() * 2) * 400;
                const u = Math.floor(Math.random() * 32) * 32;
                const v = Math.floor(Math.random() * 32) * 32;
                renderer.draw({
                    x, y,
                    width: 32, height: 32,
                    textureRect: [
                        u, v,
                        u + 32, v + 32
                    ],
                    textureName: Math.random() > 0.5 ? TextureNames.Tiles : TextureNames.RedTiles,
                    layer: -10
                });
            }
        }

        for (let i = 0; i < trail.length; ++i) {
            const t = trail[i];
            renderer.draw({
                x: t.x, y: t.y,
                width: 32.0 * (i + 1.0) / 4.0,
                height: 32.0 * (i + 1.0) / 4.0,
                layer: 10 - i,
                textureRect: [
                    0, 0,
                    32, 32
                ],
                textureName: TextureNames.Tiles
            });
        }

        renderer.flush();
    });
}

export function initAlt() {

    const runStressTest = false;

    if (runStressTest) {
        stress();
    }
    else {
        seizure();
    }
}
