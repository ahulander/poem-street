import { SceneManager } from "./scenes/scene-manager";
import { setupContex } from "./rendering/context";
import { InputManager } from "./input/input";
import { SceneNames } from "./scenes/scene-utility";
import { SpriteRenderer } from "./rendering/sprite-renderer";
import { SceneLogin } from "./scenes/scene-menu";
import { SceneGame } from "./scenes/scene-game";
import { loadTextureAssets } from "./rendering/textures";
import { SceneSpriteTest } from "./scenes/test/scene-sprite-test";
import { setupSceneSelector } from "../dev_tools/scene-selector";
import { setupInfoMenu } from "../dev_tools/info-menu";
import { SceneSpriteStressTest } from "./scenes/test/scene-sprite-stress-test";
import { SceneSeizure } from "./scenes/test/scene-seizure";

export function setupGame() {

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    if (!canvas) {
        console.error("Missing canvas");
        return;
    }

    if (!setupContex(canvas)) {
        return;
    }
    
    loadTextureAssets();
    const spriteRenderer = new SpriteRenderer();
    const inputManger = new InputManager(canvas);
    const sceneManager = new SceneManager(inputManger, spriteRenderer);

    sceneManager.register(
        SceneLogin,
        SceneGame,
        SceneSpriteTest,
        SceneSpriteStressTest,
        SceneSeizure
    );
    sceneManager.gotoScene(SceneNames.SpriteTest);

    setInterval(() => {
        sceneManager.update();
    }, 16);

    // Dev Tool, should probably be excluded in a production build =) 
    setupSceneSelector(inputManger, sceneManager);
    setupInfoMenu(inputManger);
}