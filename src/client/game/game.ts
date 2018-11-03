import * as Phaser from "phaser";
import { SceneMenu } from "./scenes/scene-menu";
import { SceneGame } from "./scenes/scene-game";
import { SceneEntityTest } from "./scenes/scene-entity-test";
import { Game } from "phaser";

export function setupGame() {
    const config: GameConfig = {
        width: 800,
        height: 600,
        type: Phaser.WEBGL,
        parent: "content",
        backgroundColor: "#c1c1c1",
        scene: [ SceneMenu, SceneGame, SceneEntityTest ]
    };

    const result = new Game(config);
    return result;
}
