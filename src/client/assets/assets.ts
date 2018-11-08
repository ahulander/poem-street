import { Texture, loadImage } from "../rendering/textures";

export module Assets {

    export enum Textures {
        Tiles = 0,
        RedTiles,
        Test,
        AnimatedGuy,
        Guy
    }

    const _assets: Texture[] = [];
    let _defaultTexture: Texture;

    export function getTexture(name: Textures) {
        return _assets[name] || _defaultTexture;
    }

    export function loadAssets(gl: WebGLRenderingContext) {

        function load(name: Textures, url: string) {
            _assets[name] = loadImage(gl, url);
        }

        _defaultTexture = loadImage(gl, "assets/default.png");
        load(Textures.Tiles, "assets/tiles.png");
        load(Textures.RedTiles, "assets/tiles_red.png");
        load(Textures.Test, "assets/test.png");
        load(Textures.AnimatedGuy, "assets/animation.png");
        load(Textures.Guy, "assets/guy.png");
    }    
}
