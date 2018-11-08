import { getMainCameraMatrices } from "../rendering/camera";
import { mat4, vec4 } from "gl-matrix";



export interface MouseState {
    screenX: number;
    screenY: number;
    worldX: number;
    worldY: number;
}

interface FuncKeyboardCallbackMap {
    [hash: string]: {
        callback: () => void;
        comment: string;
    };
}

export class InputManager {

    private mouseState: MouseState = {
        screenX: 0,
        screenY: 0,
        worldX: 0,
        worldY: 0
    };

    onLeftClick: (mouse: MouseState) => void;
    onRightClick: (mouse: MouseState) => void;

    private keyboardShortcuts: FuncKeyboardCallbackMap = {};
    private globalKeyboardShortcuts: FuncKeyboardCallbackMap = {};

    constructor(target: HTMLElement) {
        target.onmousemove = this.onMouseMove.bind(this);
        target.onmousedown = this.onMouseDown.bind(this);
        target.onmouseup = this.onMouseUp.bind(this);
        target.oncontextmenu = this.preventContextMenu.bind(this);
        target.ontouchmove = this.onMouseMove.bind(this);
        target.ontouchend = this.onMouseMove.bind(this);
        document.body.onkeydown = this.onKeyDown.bind(this);
    }

    registerKeyboardShortcut(shortcut: string, callback: ()=>void, comment: string, global = false) {
        
        if (this.globalKeyboardShortcuts[shortcut] || this.keyboardShortcuts[shortcut]) {
            console.warn("Yo! Someone is already using this keybind!");
            return;
        }

        if (global) {
            this.globalKeyboardShortcuts[shortcut] = { callback, comment };
        }
        else {
            this.keyboardShortcuts[shortcut] = { callback, comment };
        }
    }

    getMouseState() {
        return this.mouseState;
    }

    clearAllEventListeners() {
        this.onLeftClick = null;
        this.onRightClick = null;
        this.keyboardShortcuts = {};
    }

    getShortcutInfo() {
        return Object.keys(this.globalKeyboardShortcuts)
            .map(shortcut => ({shortcut, comment: this.globalKeyboardShortcuts[shortcut].comment, global: true}))
            .concat(
                Object.keys(this.keyboardShortcuts)
                .map(shortcut => ({shortcut, comment: this.keyboardShortcuts[shortcut].comment, global: false}))
            );
    }

    private onKeyDown(event: KeyboardEvent) {
        
        const key = [
            event.ctrlKey ? "Ctrl" : null,
            event.altKey ? "Alt" : null,
            event.shiftKey ? "Shift" : null,
            supportedKeys[event.code] ? supportedKeys[event.code] : null
        ].filter(k => k !== null)
         .join("+");

        if (this.globalKeyboardShortcuts[key]) {
            this.globalKeyboardShortcuts[key].callback();
            event.preventDefault();
            return false;
        }
        else if(this.keyboardShortcuts[key]) {
            this.keyboardShortcuts[key].callback();
            event.preventDefault();
            return false;
        }
    }

    private preventContextMenu(event: Event) {
        event.preventDefault();
        return false;
    }

    private onMouseDown(event: MouseEvent) {
        if (event.button === 0 && this.onLeftClick) {
            this.onLeftClick(this.mouseState);
        }
        else if (event.button === 2 && this.onRightClick) {
            this.onRightClick(this.mouseState);
        }
    }

    private onMouseUp(event: MouseEvent) {
        
    }

    private onMouseMove(event: MouseEvent) {
        
        const rect = (<any>event.target).getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.mouseState.screenX = x;
        this.mouseState.screenY = y;
        
    
        // Calculate world position
        const camera = getMainCameraMatrices();

        const hw = camera.camera.width / 2.0;
        const hh = camera.camera.height / 2.0;
        let nx = (x - hw) / hw;
        let ny = -((y - hh) / hh);

        const inv = mat4.create();
        mat4.mul(inv, camera.projection, camera.view);
        mat4.invert(inv, inv);

        const v = vec4.create();
        v[0] = nx;
        v[1] = ny;
        v[2] = 0;
        v[3] = 1;

        vec4.transformMat4(v, v, inv);

        this.mouseState.worldX = v[0];
        this.mouseState.worldY = v[1];
    }
}

const supportedKeys = {
    "Escape": "Esc",
    "Digit0": "0",
    "Digit1": "1",
    "Digit2": "2",
    "Digit3": "3",
    "Digit4": "4",
    "Digit5": "5",
    "Digit6": "6",
    "Digit7": "7",
    "Digit8": "8",
    "Digit9": "9",
    "Tab": "Tab",
    "KeyQ": "Q",
    "KeyW": "W",
    "KeyE": "E",
    "KeyR": "R",
    "KeyT": "T",
    "KeyY": "Y",
    "KeyU": "U",
    "KeyI": "I",
    "KeyO": "O",
    "KeyP": "P",
    "KeyA": "A",
    "KeyS": "S",
    "KeyD": "D",
    "KeyF": "F",
    "KeyG": "G",
    "KeyH": "H",
    "KeyJ": "J",
    "KeyK": "K",
    "KeyL": "L",
    "KeyZ": "Z",
    "KeyX": "X",
    "KeyC": "C",
    "KeyV": "V",
    "KeyB": "B",
    "KeyN": "N",
    "KeyM": "M",
    "Space": "Space",
    "F1": "F1",
    "F2": "F2",
    "F3": "F3",
    "F4": "F4",
    "F5": "F5",
    "F6": "F6",
    "F7": "F7",
    "F8": "F8",
    "F9": "F9",
    "F10": "F10",
    "Numpad7": "7",
    "Numpad8": "8",
    "Numpad9": "9",
    "Numpad4": "4",
    "Numpad5": "5",
    "Numpad6": "6",
    "Numpad1": "1",
    "Numpad2": "2",
    "Numpad3": "3",
    "Numpad0": "0",
    "Backquote": "§"
};
