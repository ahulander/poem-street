import { ProgramInfo, createProgram, setUniform, enableVertexAttribute } from "./shader";
import { vec2 } from "gl-matrix";
import { RenderTarget } from "./render-target";
import { getMainCameraMatrices } from "./camera";


export interface FovCircle {
    x: number;
    y: number;
    radius: number;
}

const SEGMENT_COUNT = 32;
// NOTE: Two extra vertices. One for the center point and one for the final triangle to complete the circle
const VERTEX_COUNT = SEGMENT_COUNT + 2;
function unitCirclePositions(): Float32Array {

    const data: number[] = [0.0, 0.0];

    const TAU = Math.PI * 2.0;
    const segments = SEGMENT_COUNT;
    for (let i = 0; i <= segments; ++i) {
        const x = Math.cos(TAU * i / segments);
        const y = Math.sin(TAU * i / segments);
        data.push(x);
        data.push(y);
    }
    // Final vertex position to complete the circle
    data.push(1.0);
    data.push(0.0);

    return new Float32Array(data);
}

export class FieldOfViewRenderer {

    private readonly gl: WebGLRenderingContext;
    private readonly positionBuffer: WebGLBuffer;
    private readonly fovProgram: ProgramInfo;
    private readonly tempPosition: vec2;
    private readonly fovMap: RenderTarget;

    constructor(gl: WebGLRenderingContext, fovMap: RenderTarget) {
        this.gl = gl;

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, unitCirclePositions(), gl.STATIC_DRAW);

        this.fovProgram = createProgram(gl, fovVertexShader, fovFragmentShader);

        this.tempPosition = vec2.create();

        this.fovMap = fovMap;
    }

    clear() {
        this.fovMap.use();
        this.gl.clearColor(1,1,1,1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    drawCircle(circle: FovCircle) {
        
        this.tempPosition[0] = circle.x;
        this.tempPosition[1] = circle.y;

        this.fovMap.use();
        
        const camera = getMainCameraMatrices();

        const gl = this.gl;

        gl.blendFunc(gl.SRC_COLOR, gl.ONE);

        gl.useProgram(this.fovProgram.program);
        setUniform(this.fovProgram, "uViewMatrix", camera.view);
        setUniform(this.fovProgram, "uProjectionMatrix", camera.projection);
        setUniform(this.fovProgram, "uPosition", this.tempPosition);
        setUniform(this.fovProgram, "uRadius", circle.radius);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        enableVertexAttribute(gl, this.fovProgram, "aVertexPosition");

        gl.drawArrays(gl.TRIANGLE_FAN, 0, VERTEX_COUNT);

        // HACK: Reset blend func
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
}

const fovVertexShader = `
    attribute vec2 aVertexPosition;

    varying highp vec2 uv;

    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform highp vec2 uPosition;
    uniform highp float uRadius;

    void main() {
        uv = aVertexPosition;
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(uPosition + aVertexPosition * uRadius, 0, 1);
    }
`;

const fovFragmentShader = `
    varying highp vec2 uv;

    uniform highp float uRadius;

    void main() {

        highp float a = sqrt(uv.x * uv.x + uv.y * uv.y);
        a = 1.0 - (max(0.0, a - 0.5) / 0.5);

        gl_FragColor = vec4(1,0, 0, a);
    }
`;
