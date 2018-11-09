import { SceneManager } from "../game/scenes/scene-manager";
import { InputManager } from "../input/input";
import { UI } from "../rendering/ui/ui";
import { UISceneSelector } from "../rendering/ui/components/dev/scene-selector";

interface SceneSelectorState {
    sceneSelector?: UISceneSelector;
    open: boolean;
}

const _state: SceneSelectorState = {
    open: false
};

export function setupSceneSelector(ui: UI, inputManager: InputManager, sceneManager: SceneManager) {

    const sceneSelector = new UISceneSelector(sceneManager, () => {
        ui.remove(_state.sceneSelector);
        _state.open = false;
    });
    _state.sceneSelector = sceneSelector;

    inputManager.registerKeyboardShortcut("Alt+§", () => {
        _state.open = !_state.open;
        if (_state.open) {
            ui.add(_state.sceneSelector);
        } else {
            ui.remove(_state.sceneSelector);
        }
    }, "Toggle scene menu", true);
}
