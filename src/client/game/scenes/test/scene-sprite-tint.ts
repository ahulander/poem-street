import { Scene } from "../scene";
import { SceneNames } from "../scene-utility";
import { Assets } from "../../../assets/assets";

function createColorPicker(onchange) {
    const result = document.createElement("div");
    result.style.position = "absolute";

    const input = document.createElement("input");
    input.type = "color";
    input.onchange = onchange;
    result.appendChild(input);

    return result;
}

export class SceneSpriteTint extends Scene {
    
    private colorPicker: HTMLElement;

    private color: number[] = [1,0,0,1];

    constructor() {
        super(SceneNames.TestSpriteTint);
    }

    hello() {
        // Setup color picker
        this.colorPicker = createColorPicker(event => {
            const hexColor = <string>event.target.value;
            const r = parseInt(hexColor.substr(1, 2), 16);
            const g = parseInt(hexColor.substr(3, 2), 16);
            const b = parseInt(hexColor.substr(5, 2), 16);

            this.color[0] = r / 255;
            this.color[1] = g / 255;
            this.color[2] = b / 255;
        });
        document.body.appendChild(this.colorPicker);

        this.inputManager.registerKeyboardShortcut("Space", () => {
            console.log("S P A C E");
        }, "Space!");
    }

    goodbye() {
        // Remove color picker
        this.colorPicker.remove();
        this.colorPicker = null;
    }

    update() {
        this.fovRenderer.clear();
        this.spriteRenderer.draw({
            x: 0,
            y: 0,
            height: 128,
            width: 128,
            textureName: Assets.Textures.Tiles,
            textureRect: [0,0,128,128],
            tint: this.color
        });
    }
}
