import { mat4 } from "gl-matrix";

export interface Camera {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CameraMatrices {
    view: mat4;
    projection: mat4;
    camera: Camera;
}

export function setMainCameraMatrices(camera: Camera) {

    const x = Math.floor(camera.x);
    const y = Math.floor(camera.y);
    const hw = camera.width / 2.0;
    const hh = camera.height / 2.0;

    mat4.ortho(_camera.projection, -hw, hw, -hh, hh, -100, 100);
    mat4.lookAt(_camera.view, [x,y,1], [x,y,0], [0, 1, 0]);
    _camera.camera = camera;
}

export function getMainCameraMatrices() {
    return _camera;
}

let _camera: CameraMatrices;
function createCameraMatrices(camera: Camera) {
    const view = mat4.create();
    const projection = mat4.create();

    _camera = {
        view: view,
        projection: projection,
        camera: camera
    };

    setMainCameraMatrices(camera);
}
createCameraMatrices({
    x: 0,
    y: 0,
    width: 800,
    height: 400
});