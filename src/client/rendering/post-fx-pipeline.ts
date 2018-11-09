import { clearScreenBuffer } from "./context";
import { FullscreenQuad } from "./fullscreen-quad";
import { ProgramInfo, createProgram, setUniform } from "./shader";
import { RenderTarget } from "./render-target";

let _tempPipeline: RenderPipeline;
export abstract class RenderPass {

    readonly gl: WebGLRenderingContext;
    readonly tileMap: RenderTarget;
    readonly spriteMap: RenderTarget;
    readonly glowMap: RenderTarget;
    readonly fovMap: RenderTarget;
    readonly fullscreenQuad: FullscreenQuad;

    constructor() {
        this.gl = _tempPipeline.gl;
        this.tileMap = _tempPipeline.tileMap;
        this.spriteMap = _tempPipeline.spriteMap;
        this.glowMap = _tempPipeline.glowMap;
        this.fovMap = _tempPipeline.fovMap;
        this.fullscreenQuad = _tempPipeline.fullscreenQuad;
    }

    /** NOTE: First pass will receive a "null"-target, following pass will receive the result from the previous pass */
    abstract apply(target: RenderTarget): RenderTarget;
}

export interface RenderPassConstructor {
    new (): RenderPass;
}

export class RenderPipeline {

    private pass: RenderPass[] = [];
    private screenProgram: ProgramInfo;
    
    readonly gl: WebGLRenderingContext;
    readonly tileMap: RenderTarget;
    readonly spriteMap: RenderTarget;
    readonly glowMap: RenderTarget;
    readonly fovMap: RenderTarget;
    readonly fullscreenQuad: FullscreenQuad;
    
    constructor(
        gl: WebGLRenderingContext,
        spriteMap: RenderTarget,
        tileMap: RenderTarget,
        glowMap: RenderTarget,
        fovMap: RenderTarget,
        pass: RenderPassConstructor[]
    ) {
        this.gl = gl;
        this.spriteMap = spriteMap;
        this.tileMap = tileMap;
        this.glowMap = glowMap;
        this.fovMap = fovMap;
        this.fullscreenQuad = new FullscreenQuad(gl);
        
        _tempPipeline = this;
        pass.forEach(ctor => {
            this.pass.push(new ctor())
        });
        _tempPipeline = null;

        this.screenProgram = createProgram(gl, vertexScreenPass, fragmentScreenPass);
    }

    apply() {

        let current: RenderTarget = null;

        const count = this.pass.length;
        for (let i = 0; i < count; ++i) {
            current = this.pass[i].apply(current);
        }

        const gl = this.gl;
        clearScreenBuffer(gl);
        
        this.gl.useProgram(this.screenProgram.program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, current.texture);
        setUniform(this.screenProgram, "uTexture", 0);
        this.fullscreenQuad.draw(this.screenProgram);
        
    }
}


const vertexScreenPass = `
    attribute vec2 aVertexPosition;
    attribute vec2 aUv;

    varying highp vec2 uv;

    void main() {
        uv = vec2(aUv.x, 1.0 - aUv.y);
        gl_Position = vec4(aVertexPosition, 0, 1);
    }
`;

const fragmentScreenPass = `
    varying highp vec2 uv;

    uniform sampler2D uTexture;

    void main() {
        gl_FragColor = texture2D(uTexture, uv);
    }
`;
