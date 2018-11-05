
let gl: WebGLRenderingContext;

export function setupContex(canvas: HTMLCanvasElement) {
    gl = canvas.getContext("webgl");
    if (!gl) {
        console.error("WebGL not supported");
        return false;
    }

    gl.clearColor(0,1,1,1);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return true;
}

export function clearScreenBuffer() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function getContext() {
    return gl;
}
