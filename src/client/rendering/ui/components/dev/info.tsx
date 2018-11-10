import { UIElement } from "../../ui";
import { Draggable } from "../common/draggable";
import { InputManager } from "../../../../input/input";

const styleTable = {
    "width": "600px",
    "margin": "5px"
};

const styleTh = {
    "text-align": "start"
}

export class UIInfo extends UIElement {

    private tbody: HTMLElement;
    private readonly inputManager: InputManager;

    constructor(inputManager: InputManager, onDismiss: () => void) {
        super();

        this.tbody = <tbody></tbody>;
        this.inputManager = inputManager;

        this.root = (
            <Draggable title="Poem Street - Info" onDismiss={onDismiss}>
                <table style={styleTable}>
                    <thead>
                        <tr>
                            <th style={styleTh}>Shortcut</th>
                            <th style={styleTh}>Comment</th>
                            <th style={styleTh}>Global</th>
                        </tr>
                    </thead>
                    {this.tbody}
                </table>
            </Draggable>
        )
    }

    refresh() {
        while (this.tbody.firstChild) {
            this.tbody.removeChild(this.tbody.firstChild);
        }

        this.inputManager.getShortcutInfo().forEach(info => {
            this.tbody.appendChild(
                <tr>
                    <td>{info.shortcut}</td>
                    <td>{info.comment}</td>
                    <td>{info.global ? "True" : "False"}</td>
                </tr>
            );
        });
    }

    enabled() {
        this.refresh();
    }
}
