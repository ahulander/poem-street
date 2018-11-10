import { InputManager } from "../input/input";
import { UIInfo } from "../rendering/ui/components/dev/info";
import { SceneManager } from "../game/scenes/scene-manager";
import { UI } from "../rendering/ui/ui";

interface InfoMenuState {
    uiElement?: UIInfo;
    open: boolean;
}

const _state: InfoMenuState = {
    open: false
};

export function setupInfoMenu(ui: UI, inputManager: InputManager, sceneManager: SceneManager) {
    
    const uiElement = new UIInfo(inputManager, () => {
        _state.open = false;
        ui.remove(_state.uiElement);
    });
    _state.uiElement = uiElement;

    sceneManager.on("scenechanged", () => {
        _state.uiElement.refresh();
    });

    inputManager.registerKeyboardShortcut("F1", () => {
        _state.open = !_state.open;
        if (_state.open) {
            ui.add(_state.uiElement);
        }
        else {
            ui.remove(_state.uiElement);
        }
    }, "Brings up the help menu", true);
}
