import { getMainCameraMatrices } from "./camera";
import { mat4, vec4 } from "gl-matrix";

export interface MouseState {
    screenX: number;
    screenY: number;
    worldX: number;
    worldY: number;
    
}

export class InputManager {

    private mouseState: MouseState = {
        screenX: 0,
        screenY: 0,
        worldX: 0,
        worldY: 0
    };

    onClick: (mouse: MouseState) => void;

    constructor(target: HTMLElement) {
        target.onmousemove = this.onMouseMove.bind(this);
        target.onmousedown = this.onMouseDown.bind(this);
        target.onmouseup = this.onMouseUp.bind(this);
    }

    update() {
        
    }

    getMouseState() {
        return this.mouseState;
    }

    private onMouseDown(event: MouseEvent) {
        if (this.onClick) {
            this.onClick(this.mouseState);
        }
    }

    private onMouseUp(event: MouseEvent) {
        
    }

    private onMouseMove(event: MouseEvent) {
        
        const x = event.clientX;
        const y = event.clientY;

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
