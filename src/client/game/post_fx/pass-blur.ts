import { RenderPass } from "../../rendering/post-fx-pipeline";
import { RenderTarget } from "../../rendering/render-target";
import { ProgramInfo, createProgram, setUniform } from "../../rendering/shader";
import { FullscreenQuad } from "../../rendering/fullscreen-quad";

export class PassBlur extends RenderPass {
    
    private result: RenderTarget;
    private iteration0: RenderTarget;
    private iteration1: RenderTarget;
    private iteration2: RenderTarget;
    private blitProgram: ProgramInfo;
    private combineProgram: ProgramInfo;

    constructor() {
        super();
        
        this.result = new RenderTarget(this.gl, 800, 400);
        this.iteration0 = new RenderTarget(this.gl, 400, 200);
        this.iteration1 = new RenderTarget(this.gl, 200, 100);
        this.iteration2 = new RenderTarget(this.gl, 100, 50);
        this.blitProgram = createProgram(this.gl, FullscreenQuad.defaultFullscreenVertexSource, blitFragment);
        this.combineProgram = createProgram(this.gl, FullscreenQuad.defaultFullscreenVertexSource, combineFragment);
    }

    apply(target: RenderTarget): RenderTarget {
        this.result.clear();
        this.iteration0.clear();
        this.iteration1.clear();
        this.iteration2.clear();
        
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, target.texture);

        gl.useProgram(this.blitProgram.program);
        setUniform(this.blitProgram, "uSpriteMap", 0);

        this.iteration0.use();
        this.fullscreenQuad.draw(this.blitProgram);

        this.iteration1.use();
        this.fullscreenQuad.draw(this.blitProgram);

        this.iteration2.use();
        this.fullscreenQuad.draw(this.blitProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.iteration0.texture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.iteration1.texture);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.iteration2.texture);

        gl.useProgram(this.combineProgram.program);
        setUniform(this.combineProgram, "uIteration0", 0);
        setUniform(this.combineProgram, "uIteration1", 1);
        setUniform(this.combineProgram, "uIteration2", 2);

        this.result.use();
        this.fullscreenQuad.draw(this.combineProgram);

        return this.result;
    }
}

const blitFragment = `
    varying highp vec2 uv;

    uniform sampler2D uSpriteMap;

    void main() {
        gl_FragColor = texture2D(uSpriteMap, uv);
    }
`;

const combineFragment = `
    varying highp vec2 uv;

    uniform sampler2D uIteration0;
    uniform sampler2D uIteration1;
    uniform sampler2D uIteration2;

    void main() {
        gl_FragColor = (texture2D(uIteration0, uv) + texture2D(uIteration1, uv) + texture2D(uIteration2, uv)) * 0.3333;
    }
`;
