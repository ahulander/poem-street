import { getContext } from "./context";

export interface ProgramInfo {
    program: WebGLProgram;
    attributeLocations: {
        aVertexPosition: number;
        aUvPosition: number;
        aTint: number;
    };
    uniformLocations: {
        uProjectionMatrix: WebGLUniformLocation;
        uViewMatrix: WebGLUniformLocation;
        uSpriteAtlas: WebGLUniformLocation;
    };
}

export function createProgram(vertexSource: string, fragmentSource: string): ProgramInfo {
    
    const gl = getContext();

    const vertex = compileShader(vertexSource, gl.VERTEX_SHADER);
    const fragment = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

    if (!vertex || !fragment) {
        return null;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return null;
    }
    return {
        program: program,
        attributeLocations: {
            aVertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
            aUvPosition: gl.getAttribLocation(program, "aUvPosition"),
            aTint: gl.getAttribLocation(program, "aTint")
        },
        uniformLocations: {
            uViewMatrix: gl.getUniformLocation(program, "uViewMatrix"),
            uProjectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
            uSpriteAtlas: gl.getUniformLocation(program, "uSpriteAtlas")
        }
    };
}

function compileShader(source: string, type) {

    const gl = getContext();

    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}