import { setupGame } from "./game/game";

/*

    Client Main Entry Point!

*/

async function initGame() {
    const game = setupGame();
}

document.addEventListener("DOMContentLoaded", () => {
    initGame();
});
