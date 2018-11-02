import * as Phaser from "phaser";
import { SceneMenu } from "./scene-menu";
import { SceneGame } from "./scene-game";

export function setupGame() {
    const config = {
        width: 800,
        height: 600,
        type: Phaser.WEBGL,
        parent: "content",
        scene: [ SceneMenu, SceneGame ]
    };

    const result = new Phaser.Game(config);
    return result;
}
