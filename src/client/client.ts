import { setupGame } from "./game/game";
import { setupSceneSelector } from "./dev_tools/scene-selector";
import { initAlt } from "./game/rendering/alt_mode";

/*

    Client Main Entry Point!

*/

async function initGame() {
    const game = setupGame();
    
    // TODO (Alex): Disable this in a production build
    setupSceneSelector(game);
}

document.addEventListener("DOMContentLoaded", () => {
    
    const altMode = (<any>window).NO_PHASER;

    if (altMode) {
        initAlt();
    }
    else {
        initGame();
    }
});
