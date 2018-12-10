import { IRenderManager, ITextureManager, ISpriteRenderer } from "../render-manager";
import * as PIXI from 'pixi.js';

class PixiTextureManager implements ITextureManager {

    constructor() {

    } 

    load(name: number, url: string) {

    }

    get(name: number) {

    }
}

class PixiSpriteRenderer implements ISpriteRenderer {

    stage: PIXI.Container;
    guy: PIXI.Sprite;

    constructor() {
        this.stage = new PIXI.Container();


        PIXI.loader
            .add("guy", "assets/guy.png")
            .load(() => {
                console.log("Create guy");
                this.guy = new PIXI.Sprite(PIXI.loader.resources["guy"].texture);
                this.stage.addChild(this.guy);
        });        
    }

    draw(sprite) {
        
    }

    flush() {

    }
}

export class PixiRenderManager implements IRenderManager {
    
    readonly textures: ITextureManager;
    readonly spriteRenderer: ISpriteRenderer;
    readonly canvas: HTMLCanvasElement;

    private _app: PIXI.WebGLRenderer;

    constructor() {
        
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;

        this._app = PIXI.autoDetectRenderer(1800, 900, {backgroundColor: 0x1099bb}) as PIXI.WebGLRenderer;
        this.canvas.appendChild(this._app.view);
        
        this.textures = new PixiTextureManager();
        this.spriteRenderer = new PixiSpriteRenderer();
    }

    draw() {
        const sprites = this.spriteRenderer as PixiSpriteRenderer;
        this._app.render(sprites.stage);
    }
}
