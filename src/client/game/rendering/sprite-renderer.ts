import { ProgramInfo, createProgram } from "./shader";
import { getContext } from "./context";
import { getTexture, AssetImage, TextureNames } from "./textures";
import { getMainCameraMatrices } from "./camera";

export interface Sprite {

    /*
        World position
    */
    x: number;
    y: number;
    
    /*
        Sprite draw order.
        Higher values are rendered ontop of lower values.

        Defaults to 0
    */
    layer?: number;
    
    /*
        Center of the sprite.
        {0, 0} -> top left corner of the sprite
        {1, 1} -> bottom right corner

        Defaults to { 0.5, 0.5 }
    */
    originX?: number;
    originY?: number;
    width: number;
    height: number;

    /*
        Four texture coorinates of the sprite.
        Coordinates are given in pixels
        [0] -> left
        [1] -> top
        [2] -> right
        [4] -> bottom
    */
    textureRect: number[];
    textureName: TextureNames;
}

const spriteVertexShader = `
    attribute vec3 aVertexPosition;
    attribute vec2 aUvPosition;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 uv;

    void main() {
        uv = aUvPosition;
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(aVertexPosition, 1);
    }
`;

const spriteFragmentShader = `

    varying highp vec2 uv;

    uniform sampler2D uSpriteAtlas;

    void main() {
        gl_FragColor = texture2D(uSpriteAtlas, uv);
    }
`;

export class SpriteRenderer {

    static readonly MAX_VERTEX_DATA_COUNT = 128 * 3 * 2;
    position_data = new Float32Array(SpriteRenderer.MAX_VERTEX_DATA_COUNT);
    uv_data = new Float32Array(SpriteRenderer.MAX_VERTEX_DATA_COUNT);
    vertexCount = 0;
    positions: WebGLBuffer;
    uvs: WebGLBuffer;
    programInfo: ProgramInfo;

    textureName: TextureNames;
    texture: AssetImage;

    constructor() {

        const gl = getContext();

        this.programInfo = createProgram(spriteVertexShader, spriteFragmentShader);

        this.positions = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positions);
        gl.bufferData(gl.ARRAY_BUFFER, this.position_data, gl.DYNAMIC_DRAW);
        
        this.uvs = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvs);
        gl.bufferData(gl.ARRAY_BUFFER, this.uv_data, gl.DYNAMIC_DRAW);

        gl.vertexAttribPointer(
            this.programInfo.attributeLocations.aUvPosition,
            2,
            gl.FLOAT,
            false,
            0,
            8
        );
        gl.enableVertexAttribArray(this.programInfo.attributeLocations.aUvPosition);
    }

    flush() {

        if (!this.texture || this.vertexCount <= 0) {
            return;
        }

        const gl = getContext();
        const camera = getMainCameraMatrices();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);

        gl.useProgram(this.programInfo.program);
        gl.uniformMatrix4fv(this.programInfo.uniformLocations.uViewMatrix, false, camera.view);
        gl.uniformMatrix4fv(this.programInfo.uniformLocations.uProjectionMatrix, false, camera.projection);
        gl.uniform1i(this.programInfo.uniformLocations.uSpriteAtlas, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positions);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.position_data);
        gl.vertexAttribPointer(
            this.programInfo.attributeLocations.aVertexPosition,
            3,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(this.programInfo.attributeLocations.aVertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvs);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uv_data);
        gl.vertexAttribPointer(
            this.programInfo.attributeLocations.aUvPosition,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(this.programInfo.attributeLocations.aUvPosition);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);

        this.vertexCount = 0;
    }

    draw(sprite: Sprite) {

        if (this.vertexCount * 4 + 24 >= SpriteRenderer.MAX_VERTEX_DATA_COUNT || 
           (this.vertexCount > 0 && this.textureName !== sprite.textureName)
        ) {
            this.flush();
        }
        
        this.texture = getTexture(sprite.textureName);
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
        const layer = sprite.layer || 0;

        const uvLeft = sprite.textureRect[0] / tw;
        const uvTop = sprite.textureRect[1] / th;
        const uvRight = sprite.textureRect[2] / tw;
        const uvBottom = sprite.textureRect[3] / th;

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
                
        this.vertexCount += 6;
    }
}