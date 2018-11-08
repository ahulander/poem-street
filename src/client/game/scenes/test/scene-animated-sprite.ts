import { Scene } from "../scene";
import { SceneNames } from "../scene-utility";
import { Sprite } from "../../../rendering/sprite";
import { Assets } from "../../../assets/assets";

interface Frame {
    rect: number[];
}

class Animator {

    private currentRect: number[] = [0,0,0,0];
    private nextFrame: number = 0;
    private currentFrame: number = 0;
    
    frames: Frame[] = [];
    timeBetweenFrames: number;
    textureName: Assets.Textures;

    update(sprite: Sprite) {

        const now = Date.now();
        if (now >= this.nextFrame) {
            this.currentRect = this.frames[this.currentFrame].rect;
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.nextFrame = now + this.timeBetweenFrames;
        }

        sprite.textureName = this.textureName;
        sprite.textureRect = this.currentRect;
    }
}

export class SceneAnimatedSprite extends Scene {
    
    private animator: Animator;
    private sprite: Sprite;

    private tiles: Sprite[] = [];

    constructor() {
        super(SceneNames.TestAnimatedSprite)

        this.animator = new Animator();
        this.animator.frames = [
            { rect: [ 0,0, 32,42] },
            { rect: [32,0, 64,42] },
            { rect: [64,0, 96,42] },
            { rect: [96,0,128,42] }
        ];
        this.animator.timeBetweenFrames  = Math.floor((1 / 6) * 1000);
        this.animator.textureName = Assets.Textures.AnimatedGuy;
        this.sprite = {
            x: 0,
            y: 0,
            width: 32,
            height: 42,
            originY: 1,
            textureName: null,
            textureRect: null
        };
        this.animator.update(this.sprite);

        for (let y = -10; y <= 10; ++y) {
            for (let x = -10; x <= 10; ++x) {
                this.tiles.push({
                    x: x * 32,
                    y: y * 32,
                    layer: -10,
                    width: 32,
                    height: 32,
                    textureName: Assets.Textures.Tiles,
                    textureRect: [64, 160, 96, 192]
                });
            }
        }
    }

    update() {

        this.fovRenderer.drawCircle({
            x: 0,
            y: 0,
            radius: 200
        });
        
        for (let i = 0; i < this.tiles.length; ++i) {
            const tile = this.tiles[i];
            tile.x = Math.floor(tile.x - 32 * this.dt);
            
            if (tile.x < -320) {
                tile.x = 320;
            }
            
            this.spriteRenderer.draw(tile);
        }

        this.animator.update(this.sprite);
        this.spriteRenderer.draw(this.sprite);
    }
}
