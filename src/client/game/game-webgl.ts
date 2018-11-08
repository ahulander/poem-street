import { setupContex, clearScreenBuffer } from "../rendering/context";
import { Assets } from "../assets/assets";
import { Sprite } from "../rendering/sprite";
import { CombinePass } from "./post_fx/combine-pass";
import { RenderPipeline } from "../rendering/post-fx-pipeline";
import { RenderTarget } from "../rendering/render-target";
import { SpriteRenderer } from "../rendering/sprite-renderer";
import { FieldOfViewRenderer } from "../rendering/fov-renderer";
import { InputManager } from "../input/input";
import { PassBlur } from "./post_fx/pass-blur";
import { PassFog } from "./post_fx/pass-fog";


export function setupWebGLGame() {
    
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    if (!canvas) {
        console.error("Missing canvas");
        return;
    }

    const gl = setupContex(canvas);
    if (!gl) {
        return;
    }
    
    Assets.loadAssets(gl);

    const spriteMap = new RenderTarget(gl, 800, 400);
    const tileMap = new RenderTarget(gl, 800, 400);
    const glowMap = new RenderTarget(gl, 800, 400);
    const fovMap = new RenderTarget(gl, 800, 400);
    
    const spriteRenderer = new SpriteRenderer(gl, spriteMap);
    const fovRenderer = new FieldOfViewRenderer(gl, fovMap);
    const renderPipeline = new RenderPipeline(
        gl,
        spriteMap,
        tileMap,
        glowMap,
        fovMap,
        [
            CombinePass,
            PassBlur,
            PassFog
        ]
     );

    const sprites: Sprite[] = [];
    const count = 400;
    for (let i = 0; i < count; ++i) {
        const x = -200 + Math.random() * 400;
        const y = -100 + Math.random() * 200;

        const newSprite: any = {
            x: x,
            y: y,
            width: 32,
            height: 42,
            textureRect: [0,0,32,42],
            textureName: Assets.Textures.Guy,
            dx: 1.0 - Math.random() * 2.0,
            dy: 1.0 - Math.random() * 2.0
        };
        sprites.push(newSprite);
    }
    
    const lblFrames = document.createElement("span");
    lblFrames.style.position = "absolute";
    document.body.appendChild(lblFrames);

    let frames = 0;
    setInterval(() => {
        lblFrames.textContent = "" + frames;
        frames = 0;
    }, 1000);

    setInterval(() => {
        
        frames++;

        spriteMap.clear();
        fovMap.clear();

        fovRenderer.drawCircle({
            x: 0,
            y: 0,
            radius: 300
        });
        
        for (let i = 0; i < sprites.length; ++i) {
            const sprite: any = sprites[i];
            const n = Date.now() / 1000.0;
            sprite.x += sprite.dx * Math.sin(n * 2);
            sprite.y += sprite.dy * Math.cos(-n);
            spriteRenderer.draw(sprite);
        }

        spriteRenderer.flush();
        
        renderPipeline.apply();
        
    }, 16);
}