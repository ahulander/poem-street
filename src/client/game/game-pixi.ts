import * as PIXI from "pixi.js";
import "pixi-layers";

class SpritePool {

    private group: PIXI.display.Group;
    private container: PIXI.Container;
    private sprites: PIXI.extras.TilingSprite[] = [];
    private next = 0;
    private texture: PIXI.Texture;

    constructor(app: PIXI.Application, texture: PIXI.Texture) {
        this.group = new PIXI.display.Group(0, true);
        this.group.on("sort", sprite => {
            sprite.zOrder = -sprite.y;
        });
        this.container = new PIXI.Container();

        app.stage.addChild(this.container);
        app.stage.addChild(new PIXI.display.Layer(this.group));

        this.texture = texture;
    }

    draw(x, y) {
        if (this.next >= this.sprites.length) {
            const newSprite = new PIXI.extras.TilingSprite(this.texture, 32, 32);
            newSprite.parentGroup = this.group;
            this.container.addChild(newSprite);
            this.sprites.push(newSprite);
        }

        const sprite = this.sprites[this.next++];
        sprite.x = Math.floor(x);
        sprite.y = Math.floor(y);
        sprite.tilePosition.x = 0;
        sprite.tilePosition.y = 0;
        sprite.anchor.set(0.5);
        sprite.visible = true;
    }

    flush() {
        if (this.next === 0) {
            return;
        }

        for (let i = this.next; i < this.sprites.length; ++i) {
            this.sprites[i].visible = false;
        }
        this.next = 0;
    }
}

export function setupPixiGame() {
    
    let type = "WebGL";
    if (!PIXI.utils.isWebGLSupported()) {
        type = "canvas";
    }
    PIXI.utils.sayHello(type);

    var app = new PIXI.Application(800, 600, {backgroundColor: 0x1099bb});
    document.body.appendChild(app.view);

    const stage = new PIXI.display.Stage();
    stage.group.enableSort = true;
    app.stage = stage;

    var texture = PIXI.Texture.fromImage('assets/test.png');

    const spritePool = new SpritePool(app, texture);

    

    const count = 200; // Math.floor(Math.random() * 500);
    console.log(count);
    const entities = [];
    for (let i = 0; i < count; ++i) {
        const x = 200 + Math.random() * 400;
        const y = 100 + Math.random() * 200;
        entities.push({x, y});
    }
    //spritePool.flush();
    
    let ticks = 0;
    setInterval(() => {
        console.log(ticks);
        ticks = 0;
    }, 1000);

    app.ticker.add(() => {

        ticks++;

        entities[0] = app.renderer.plugins.interaction.mouse.global;

        for (let i = 0; i < count; ++i) {
            const e = entities[i];
            spritePool.draw(e.x, e.y);
        }
        spritePool.flush();
    })
}