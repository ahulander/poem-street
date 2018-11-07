import { setupGame } from "./game/game";
import { setupPixiGame } from "./game/game-pixi";

/*

    Client Main Entry Point!

*/

document.addEventListener("DOMContentLoaded", () => {
    const PIXI = (<any>window).PIXI_STYLE;
    if  (PIXI) {
        setupPixiGame();
    } else {
        setupGame();
    }
});
