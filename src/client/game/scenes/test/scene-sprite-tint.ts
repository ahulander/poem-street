import { Scene } from "../scene";
import { SceneNames } from "../scene-utility";
import { Assets } from "../../../assets/assets";
import { UIColorPicker } from "../../../rendering/ui/components/dev/color-picker";

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

    private uiColorPicker: UIColorPicker;

    constructor() {
        super(SceneNames.TestSpriteTint);

        this.uiColorPicker = new UIColorPicker(color => {
            this.color = color;
        });
    }

    hello() {
        this.ui.add(this.uiColorPicker);

        this.inputManager.registerKeyboardShortcut("Space", () => {
            console.log("S P A C E");
        }, "Space!");
    }

    goodbye() {
        this.ui.remove(this.uiColorPicker);
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
