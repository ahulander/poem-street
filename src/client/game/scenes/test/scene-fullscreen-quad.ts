import { Scene } from "../scene";
import { SceneNames } from "../scene-utility";
import { FullscreenQuad } from "../../rendering/fullscreen-quad";
import { clearScreenBuffer } from "../../rendering/context";
import { ProgramInfo, createProgram, setUniform } from "../../rendering/shader";
import { getTexture, TextureNames } from "../../rendering/textures";
import { RenderTarget } from "../../rendering/render-target";

const fragmentSource = `
    varying highp vec2 uv;

    uniform sampler2D uTexture;

    void main() {
        gl_FragColor = texture2D(uTexture, uv);
    }
`;

const vertexUpsideDownStyle = `
    attribute vec2 aVertexPosition;
    attribute vec2 aUv;

    varying highp vec2 uv;

    void main() {
        uv = vec2(aUv.x, 1.0 - aUv.y);
        gl_Position = vec4(aVertexPosition, 0, 1);
    }
`;

export class SceneFullscreenQuad extends Scene {

    private quad: FullscreenQuad;

    private programInfo: ProgramInfo;
    private screenProgramInfo: ProgramInfo;
    private texture: any;
    private renderTarget: RenderTarget;
    
    constructor() {
        super(SceneNames.TestFullscreenQuad);
        this.quad = new FullscreenQuad(this.gl);

        this.texture = getTexture(TextureNames.Tiles);

        this.programInfo = createProgram(this.gl, FullscreenQuad.defaultFullscreenVertexSource, fragmentSource);
        this.screenProgramInfo = createProgram(this.gl, vertexUpsideDownStyle, fragmentSource);

        this.renderTarget = new RenderTarget(this.gl, 200, 100);
    }

    private drawScene(gl) {
        gl.useProgram(this.programInfo.program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        setUniform(this.programInfo, "uTexture", 0);
        this.quad.draw(gl, this.programInfo);

        const mouse = this.inputManager.getMouseState();
        this.spriteRenderer.draw({
            x: mouse.worldX,
            y: mouse.worldY,
            textureName: TextureNames.Test,
            originY: 1,
            textureRect: [0,0,32,32],
            height: 64,
            width: 64,
            layer: 100
        });
        this.spriteRenderer.flush();
    }

    private flushToScreen(gl) {
        // NOTE: We are rendering everything upside down. So we have to flip the final composited image :)
        gl.useProgram(this.screenProgramInfo.program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.renderTarget.texture);
        setUniform(this.screenProgramInfo, "uTexture", 0);
        this.quad.draw(gl, this.screenProgramInfo);
    }

    update() {

        const gl = this.gl;

        this.renderTarget.use(gl);
        this.drawScene(gl);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        clearScreenBuffer(this.gl);
        this.flushToScreen(gl);        
    }

}
