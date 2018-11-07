import { enableVertexAttribute, ProgramInfo } from "./shader";

export class FullscreenQuad {

    static defaultFullscreenVertexSource = `
        attribute vec2 aVertexPosition;
        attribute vec2 aUv;

        varying highp vec2 uv;

        void main() {
            uv = aUv;
            gl_Position = vec4(aVertexPosition, 0, 1);
        }
    `;

    private gl: WebGLRenderingContext;
    private bufferPositions: WebGLBuffer;
    private bufferUvs: WebGLBuffer;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.bufferPositions = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferPositions);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            -1,  1,
             1,  1,

             1,  1,
             1, -1,
            -1, -1
        ]), gl.STATIC_DRAW);

        this.bufferUvs = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferUvs);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 1,
            0, 0,
            1, 0,

            1, 0,
            1, 1,
            0, 1
        ]), gl.STATIC_DRAW);
    }

    draw(program: ProgramInfo) {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferPositions);
        enableVertexAttribute(gl, program, "aVertexPosition");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferUvs);
        enableVertexAttribute(gl, program, "aUv");

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

