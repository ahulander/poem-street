
/*
    Important About Shader!!

    Attribute and uniform names are parse from the shader source.
    Currently the entire attribute/unifrom must be declare at the same line!

*/

export interface ShaderAttribute {
    size: number;
    location: number;
}

export interface ShaderUniform {
    setValue: (location, value) => void;
    location: WebGLUniformLocation;
}

export interface ProgramInfo {
    program: WebGLProgram;
    attributes: {[name: string]: ShaderAttribute};
    uniforms: {[name: string]: ShaderUniform}
}

function findNamesByType(sourceLines: string[], type: string): any[] {
    return sourceLines.filter(l => l.match(type))
        .map(l => { 
            const parts = l.split(" ");
            return parts.slice(parts.length - 2, parts.length);
        })
        .map(parts => ({
            type: parts[0],
            name: parts[1].replace(/;$/, '')
        }));
}

export function enableVertexAttribute(gl: WebGLRenderingContext, program: ProgramInfo, name: string) {
    
    const attribute = program.attributes[name];
    if (!attribute) {
        console.error(`No vertex attribute named: ${name}`);
        return;
    }

    const location = attribute.location;
    const size = attribute.size;

    gl.vertexAttribPointer(
        location,
        size,
        gl.FLOAT,
        false,
        0,
        0
    );
    gl.enableVertexAttribArray(location);
}

export function setUniform(program: ProgramInfo, name, value: any) {
    const uniform = program.uniforms[name];
    if (!uniform) {
        console.error(`No uniform named "${name}" found in shader program!`);
        return;
    }

    uniform.setValue(uniform.location, value);
}

export function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string): ProgramInfo {
    
    const vertex = compileShader(gl, vertexSource, gl.VERTEX_SHADER);
    const fragment = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);

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

    const vertexLines = vertexSource.split(/\n/g).map(l => l.trim());
    const fragmentLines = fragmentSource.split(/\n/g).map(l => l.trim());
    const attributeNames = findNamesByType(vertexLines, "attribute");
    const uniformNames = findNamesByType(vertexLines, "uniform").concat(findNamesByType(fragmentLines, "uniform"));

    const sizes = {
        "vec2": 2,
        "vec3": 3,
        "vec4": 4
    };

    let attributes = {};
    attributeNames.forEach(attribute => {
        attributes[attribute.name] = {
            size: sizes[attribute.type],
            location: gl.getAttribLocation(program, attribute.name)
        };
    });

    const setters = {
        "mat4": (location, value) => {
            gl.uniformMatrix4fv(location, false, value);
        },
        "sampler2D": (location, value) => {
            gl.uniform1i(location, value);
        },
        "float": (location, value) => {
            gl.uniform1f(location, value);
        },
        "vec2": (location, value) => {
            gl.uniform2fv(location, value);
        }
    }
    const defaultSetter = (location, value) => {
    };

    let uniforms = {};
    uniformNames.forEach(uniform => {
        uniforms[uniform.name] = {
            setValue: setters[uniform.type] || defaultSetter,
            location: gl.getUniformLocation(program, uniform.name)
        };
    });

    return {
        program,
        attributes,
        uniforms
    };
}

function compileShader(gl: WebGLRenderingContext, source: string, type) {

    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}