import { InputManager } from "../input/input";
import { UIElement, UI } from "../rendering/ui/ui";
import { UIInfo } from "../rendering/ui/components/dev/info";

interface InfoMenuState {
    uiElement?: UIElement;
    open: boolean;
}

const _state: InfoMenuState = {
    open: false
};

export function setupInfoMenu(ui: UI, inputManager: InputManager) {
    
    const uiElement = new UIInfo(inputManager, () => {
        _state.open = false;
        ui.remove(_state.uiElement);
    });
    _state.uiElement = uiElement;

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
