import { IRenderManager } from "../rendering/render-manager";

export module Assets {

    export enum Textures {
        Tiles = 0,
        RedTiles,
        Test,
        AnimatedGuy,
        Guy
    }

    let _renderManager: IRenderManager;

    export function getTexture(name: Textures) {
        return _renderManager.textures.get(name);
    }

    export function loadAssets(renderManager: IRenderManager) {

        _renderManager = renderManager;

        function load(name: Textures, url: string) {
            _renderManager.textures.load(name, url);
        }

        load(Textures.Tiles, "assets/tiles.png");
        load(Textures.RedTiles, "assets/tiles_red.png");
        load(Textures.Test, "assets/test.png");
        load(Textures.AnimatedGuy, "assets/animation.png");
        load(Textures.Guy, "assets/guy.png");
    }    
}
