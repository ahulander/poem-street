import { getContext } from "./context";

export enum TextureNames {
    Tiles = 0,
    RedTiles,
    Test
}

export interface AssetImage {
    texture: WebGLTexture;
    width: number;
    height: number;
}

const _textures: AssetImage[] = [];

export function getTexture(name) {
    return _textures[name];
}

export function loadTextureAssets() {
    load(TextureNames.Tiles, "/assets/tiles.png");
    load(TextureNames.RedTiles, "/assets/tiles_red.png");
    load(TextureNames.Test, "assets/test.png");
}

function load(name: TextureNames, url: string) {
    _textures[name] = loadImage(url);
}

function loadImage(url) {

    const gl = getContext();

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Temporary image while we wait for it to download!
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 158, 243, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    width, height, border, srcFormat, srcType,
                    pixel);
    
    const image = new Image();

    let result = {
        texture: texture,
        width:  1,
        height: 1
    };

    image.onload = () => {
        result.width = image.width;
        result.height = image.height;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    image.src = url;

    return result;
}
