import { UIElement } from "../../ui";
import { Draggable } from "../common/draggable";

const styleColorPicker = {
    "width": "200px",
    "padding": "10px"
};

export class UIColorPicker extends UIElement {
    
    private onColorChange: (color: number[]) => void;

    constructor(onColorChange: (color: number[]) => void) {
        super();

        this.onColorChange = onColorChange;
        this.handleColorChange = this.handleColorChange.bind(this);

        this.root = (
            <Draggable title="Color Picker">
                <div style={styleColorPicker}>
                    <div>Pick a fancy color</div>
                    <input type="color" onChange={this.handleColorChange} />
                </div>
            </Draggable>
        )
    }

    private handleColorChange(event: Event) {
        const target = event.target as any;
        const hexColor = target.value as string;
        const r = parseInt(hexColor.substr(1, 2), 16) / 255;
        const g = parseInt(hexColor.substr(3, 2), 16) / 255;
        const b = parseInt(hexColor.substr(5, 2), 16) / 255;

        this.onColorChange([r, g, b, 1]);
    }

}
