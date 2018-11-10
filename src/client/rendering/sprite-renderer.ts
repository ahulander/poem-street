import { ProgramInfo, createProgram, enableVertexAttribute, setUniform } from "./shader";
import { Texture } from "./textures";
import { getMainCameraMatrices } from "./camera";
import { Assets } from "../assets/assets";
import { Sprite } from "./sprite";
import { RenderTarget } from "./render-target";

const spriteVertexShader = `
    attribute vec3 aVertexPosition;
    attribute vec2 aUvPosition;
    attribute vec4 aTint;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 uv;
    varying highp vec4 tint;

    void main() {
        uv = aUvPosition;
        tint = aTint;
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(aVertexPosition, 1);
    }
`;

const spriteFragmentShader = `

    varying highp vec2 uv;
    varying highp vec4 tint;

    uniform sampler2D uSpriteAtlas;

    void main() {

        highp float cutoff = 0.8;
        highp vec4 col = texture2D(uSpriteAtlas, uv);

        if (col.a < cutoff) {
            discard;
        }

        gl_FragColor = col * tint;
    }
`;

export class SpriteRenderer {

    static readonly MAX_VERTEX_COUNT = 2048 * 3 * 2;
    position_data = new Float32Array(SpriteRenderer.MAX_VERTEX_COUNT * 2);
    uv_data = new Float32Array(SpriteRenderer.MAX_VERTEX_COUNT * 2);
    color_data = new Float32Array(SpriteRenderer.MAX_VERTEX_COUNT * 4);
    vertexCount = 0;
    positions: WebGLBuffer;
    uvs: WebGLBuffer;
    colors: WebGLBuffer;
    programInfo: ProgramInfo;

    textureName: Assets.Textures;
    texture: Texture;
    private gl: WebGLRenderingContext;
    private spriteMap: RenderTarget;

    constructor(gl: WebGLRenderingContext, spriteMap: RenderTarget) {

        this.gl = gl;
        this.spriteMap = spriteMap;

        this.programInfo = createProgram(gl, spriteVertexShader, spriteFragmentShader);

        this.positions = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positions);
        gl.bufferData(gl.ARRAY_BUFFER, this.position_data, gl.DYNAMIC_DRAW);
        
        this.uvs = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvs);
        gl.bufferData(gl.ARRAY_BUFFER, this.uv_data, gl.DYNAMIC_DRAW);

        this.colors = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colors);
        gl.bufferData(gl.ARRAY_BUFFER, this.color_data, gl.DYNAMIC_DRAW);
    }

    flush() {

        if (!this.texture || this.vertexCount <= 0) {
            return;
        }

        this.spriteMap.use();

        const gl = this.gl;
        const camera = getMainCameraMatrices();

        gl.useProgram(this.programInfo.program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);

        setUniform(this.programInfo, "uViewMatrix", camera.view);
        setUniform(this.programInfo, "uProjectionMatrix", camera.projection);
        setUniform(this.programInfo, "uSpriteAtlas", 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positions);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.position_data);
        enableVertexAttribute(gl, this.programInfo, "aVertexPosition");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvs);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uv_data);
        enableVertexAttribute(gl, this.programInfo, "aUvPosition");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colors);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.color_data);
        enableVertexAttribute(gl, this.programInfo, "aTint");

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);

        this.vertexCount = 0;
    }

    draw(sprite: Sprite) {

        if (this.vertexCount * 4 + 24 >= SpriteRenderer.MAX_VERTEX_COUNT || 
           (this.vertexCount > 0 && this.textureName !== sprite.textureName)
        ) {
            this.flush();
        }
        
        this.texture = Assets.getTexture(sprite.textureName);
        this.textureName = sprite.textureName;
        
    
        const tw = this.texture.width;
        const th = this.texture.height;

        const w = sprite.width;
        const h = sprite.height;

        const ox = sprite.originX === undefined ? 0.5 : sprite.originX;
        const oy = sprite.originY === undefined ? 0.5 : sprite.originY;

        const x = sprite.x - w * ox;
        const y = sprite.y + h * oy;
        
        const left = x;
        const right = x + w;
        const top = y;
        const bottom = y - h;
        const layer = (sprite.layer || 0) - y / 1000.0;

        const uvLeft = sprite.textureRect[0] / tw;
        const uvTop = sprite.textureRect[1] / th;
        const uvRight = sprite.textureRect[2] / tw;
        const uvBottom = sprite.textureRect[3] / th;

        const tint = sprite.tint !== undefined ? sprite.tint : [1,1,1,1];

        let iPos = this.vertexCount * 3;
        let iUv = this.vertexCount * 2;

        // First Triangle
        // V0
        this.position_data[iPos++] = left;
        this.position_data[iPos++] = top;
        this.position_data[iPos++] = layer;
        this.uv_data[iUv++] = uvLeft;
        this.uv_data[iUv++] = uvTop;
        
        // V1
        this.position_data[iPos++] = right;
        this.position_data[iPos++] = top;
        this.position_data[iPos++] = layer;
        this.uv_data[iUv++] = uvRight;
        this.uv_data[iUv++] = uvTop;

        // V2
        this.position_data[iPos++] = left;
        this.position_data[iPos++] = bottom;
        this.position_data[iPos++] = layer;
        this.uv_data[iUv++] = uvLeft;
        this.uv_data[iUv++] = uvBottom;

        // Second Triangle
        // V3
        this.position_data[iPos++] = left;
        this.position_data[iPos++] = bottom;
        this.position_data[iPos++] = layer;
        this.uv_data[iUv++] = uvLeft;
        this.uv_data[iUv++] = uvBottom;
        
        // V4
        this.position_data[iPos++] = right;
        this.position_data[iPos++] = bottom;
        this.position_data[iPos++] = layer;
        this.uv_data[iUv++] = uvRight;
        this.uv_data[iUv++] = uvBottom;
        
        // V5
        this.position_data[iPos++] = right;
        this.position_data[iPos++] = top;
        this.position_data[iPos++] = layer;
        this.uv_data[iUv++] = uvRight;
        this.uv_data[iUv++] = uvTop;

        // Sprite tint color
        let iTint = this.vertexCount * 4;
        for (let i = 0; i < 6; ++i) {
            this.color_data[iTint++] = tint[0];
            this.color_data[iTint++] = tint[1];
            this.color_data[iTint++] = tint[2];
            this.color_data[iTint++] = tint[3];
        }
                
        this.vertexCount += 6;
    }
}