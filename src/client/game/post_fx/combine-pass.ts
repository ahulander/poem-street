import { RenderPass } from "../../rendering/post-fx-pipeline";
import { RenderTarget } from "../../rendering/render-target";
import { ProgramInfo, createProgram, setUniform } from "../../rendering/shader";
import { FullscreenQuad } from "../../rendering/fullscreen-quad";

export class CombinePass extends RenderPass {
    
    private temp: RenderTarget;
    private combineProgram: ProgramInfo;

    constructor() {
        super();
        
        this.temp = new RenderTarget(this.gl, 800, 400);
        this.combineProgram = createProgram(this.gl, FullscreenQuad.defaultFullscreenVertexSource, combineFragment);
    }

    apply(target: RenderTarget): RenderTarget {
        this.temp.clear();
        
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.spriteMap.texture);

        gl.useProgram(this.combineProgram.program);
        setUniform(this.combineProgram, "uSpriteMap", 0);

        this.fullscreenQuad.draw(this.combineProgram);

        return this.temp;
    }
}

const combineFragment = `
    varying highp vec2 uv;

    uniform sampler2D uSpriteMap;

    void main() {
        gl_FragColor = texture2D(uSpriteMap, uv);
    }
`;
