import { setupGame } from "./game/game";
import { setupPixiGame } from "./game/game-pixi";
import { setupWebGLGame } from "./game/game-webgl";

/*

    Client Main Entry Point!

*/

document.addEventListener("DOMContentLoaded", () => {
    const PIXI = (<any>window).PIXI_STYLE;
    const WEBGL = (<any>window).WEBGL_STYLE;
    if  (PIXI) {
        setupPixiGame();
    } else if(WEBGL) {
        setupWebGLGame();
    }
    else {
        setupGame();
    }
});
