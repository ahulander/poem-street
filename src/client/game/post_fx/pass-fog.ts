import { RenderPass } from "../../rendering/post-fx-pipeline";
import { RenderTarget } from "../../rendering/render-target";
import { ProgramInfo, createProgram, setUniform } from "../../rendering/shader";
import { FullscreenQuad } from "../../rendering/fullscreen-quad";
import { vec2 } from "gl-matrix";
import { getMainCameraMatrices } from "../../rendering/camera";


export class PassFog extends RenderPass {
    
    private result: RenderTarget;
    private backgroundProgram: ProgramInfo;
    private fogProgram: ProgramInfo;
    private readonly start: number;
    private screenOffset: vec2;

    constructor() {
        super();
        
        this.start = Date.now();
        this.result = new RenderTarget(this.gl, 800, 400);
        this.backgroundProgram = createProgram(this.gl, FullscreenQuad.defaultFullscreenVertexSource, fragmentBackground);
        this.fogProgram = createProgram(this.gl, FullscreenQuad.defaultFullscreenVertexSource, fragment);

        this.screenOffset = vec2.create();
        this.screenOffset[0] = 0;
        this.screenOffset[1] = 0;
    }

    private drawBackground(gl: WebGLRenderingContext, previous: RenderTarget) {
        gl.useProgram(this.backgroundProgram.program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, previous.texture);
        setUniform(this.backgroundProgram, "uSample", 0);

        this.fullscreenQuad.draw(this.backgroundProgram);
    }

    private drawFog(gl: WebGLRenderingContext) {
                
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.fovMap.texture);

        const now = (Date.now() - this.start) / 1000.0;
        
        const camera = getMainCameraMatrices();
        this.screenOffset[0] = camera.camera.x / camera.camera.width;
        this.screenOffset[1] = camera.camera.y / -camera.camera.height;

        gl.useProgram(this.fogProgram.program);
        setUniform(this.fogProgram, "uFovMap", 0);
        setUniform(this.fogProgram, "uTime", now);
        setUniform(this.fogProgram, "uScreenOffset", this.screenOffset);

        this.fullscreenQuad.draw(this.fogProgram);
    }

    apply(previous: RenderTarget): RenderTarget {
        this.result.clear();
        
        const gl = this.gl;
        this.drawBackground(gl, previous);
        this.drawFog(gl);
        
        return this.result;
    }
}

const fragmentBackground = `
varying highp vec2 uv;

uniform sampler2D uSample;

void main() {
    gl_FragColor = texture2D(uSample, uv);
}
`;

const fragment = `
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com
// Based from: https://thebookofshaders.com/13/

varying highp vec2 uv;

uniform highp float uTime;
uniform highp vec2 uScreenOffset;
uniform sampler2D uFovMap;

highp float random (in highp vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(-0.270,-0.200)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
highp float noise (in highp vec2 _st) {
    highp vec2 i = floor(_st);
    highp vec2 f = fract(_st);

    // Four corners in 2D of a tile
    highp float a = random(i);
    highp float b = random(i + vec2(1.0, 0.0));
    highp float c = random(i + vec2(0.0, 1.0));
    highp float d = random(i + vec2(1.0, 1.0));

    highp vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

highp float fbm ( in highp vec2 _st) {
    highp float v = 0.0;
    highp float a = 0.5;
    highp vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    highp mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    highp vec3 color = vec3(0.0);
    
    highp vec2 st = (uv + uScreenOffset) * 4.0;

    highp vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*uTime * 2.0);
    q.y = fbm( st + vec2(1.0));

    highp vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*uTime );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime);

    highp float f = fbm(st+r);

    color = mix(vec3(0.485,0.226,0.208),
                vec3(0.667,0.580,0.663),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                vec3(0.068,0.101,0.180),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.739,0.950,0.824),
                clamp(length(r.x),0.0,1.0));

    // Hack: ?
    highp vec2 fogUv = uv;
    fogUv.y = 1.0 - fogUv.y;
    
    highp float a = texture2D(uFovMap, fogUv).a;
    a = min(color.r * a * 2.0, 1.0);

    gl_FragColor = vec4(color, 1.0 - a * a);
}
`;
