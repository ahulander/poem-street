import * as PIXI from "pixi.js";
import "pixi-layers";
import { setFixedInterval } from "../../common/utility";

export function setupPixiGame() {
    
    let type = "WebGL";
    if (!PIXI.utils.isWebGLSupported()) {
        type = "canvas";
    }
    PIXI.utils.sayHello(type);

    var app = new PIXI.Application(800, 600, {backgroundColor: 0x1099bb});
    document.body.appendChild(app.view);

    var texture = PIXI.Texture.fromImage('assets/guy.png');

    const stage = new PIXI.display.Stage();
    stage.group.enableSort = true;
    app.stage = stage;

    const group = new PIXI.display.Group(0, true);
    group.on("sort", sprite => {
        sprite.zOrder = -sprite.y;
    });
    const container = new PIXI.Container();

    app.stage.addChild(container);
    app.stage.addChild(new PIXI.display.Layer(group));

    const sprites: PIXI.Sprite[] = [];

    const count = 400;
    for (let i = 0; i < count; ++i) {
        const x = 200 + Math.random() * 400;
        const y = 100 + Math.random() * 200;

        const newSprite: any = new PIXI.Sprite(texture);
        newSprite.x = Math.floor(x);
        newSprite.y = Math.floor(y);
        newSprite.parentGroup = group;
        newSprite.dx = 1.0 - Math.random() * 2.0;
        newSprite.dy = 1.0 - Math.random() * 2.0;
        container.addChild(newSprite);
        app.stage.addChild(newSprite);
        sprites.push(newSprite);
    }
    
    const lblFrames = document.createElement("span");
    lblFrames.style.position = "absolute";
    document.body.appendChild(lblFrames);

    let frames = 0;
    setFixedInterval(() => {
        lblFrames.textContent = "" + frames;
        frames = 0;
    }, 1000);

    app.ticker.add(() => {
        frames++;

        for (let i = 0; i < sprites.length; ++i) {
            const sprite: any = sprites[i];
            const n = Date.now() / 1000.0;
            sprite.x += sprite.dx * Math.sin(n * 2);
            sprite.y += sprite.dy * Math.cos(-n);
        }
    });
}