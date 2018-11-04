import * as Phaser from "phaser";
import { SceneMenu } from "./scenes/scene-menu";
import { SceneGame } from "./scenes/scene-game";
import { SceneSpriteTest } from "./scenes/scene-sprite-test";
import { Game } from "phaser";

export function setupGame() {
    const config: GameConfig = {
        width: 800,
        height: 600,
        type: Phaser.WEBGL,
        parent: "content",
        backgroundColor: "#c1c1c1",
        scene: [ SceneMenu, SceneGame, SceneSpriteTest ]
    };

    const result = new Game(config);
    return result;
}
