import { Draggable } from "../common/draggable";
import { UIElement } from "../../ui";
import { SceneManager } from "../../../../game/scenes/scene-manager";
import { SceneNames } from "../../../../game/scenes/scene-utility";

const styleScenes = {
    "width": "200px",
    "padding": "5px"
};

const styleBtn = {
    "margin": "5px"
}

export class UISceneSelector extends UIElement {

    constructor(sceneManager: SceneManager, onDismiss: () => void) {
        super();

        const excludedScenes = [ SceneNames.Game ];
        const scenes: SceneNames[] = Object.keys(sceneManager.scenes).filter(a => !excludedScenes.find(b => a === b)) as SceneNames[];

        this.root = (
            <Draggable title="Open Scene" onDismiss={onDismiss}>
                <div style={styleScenes}>
                {
                    scenes.map(scene => <button style={styleBtn} onClick={() => {sceneManager.gotoScene(scene);}}>{scene}</button>)
                }
                </div>
            </Draggable>
        )
    }
}
