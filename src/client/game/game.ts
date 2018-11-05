import { SceneManager, Scene } from "./scenes/scene-manager";
import { setupContex } from "./rendering/webgl/context";
import { InputManager } from "./rendering/webgl/input";
import { SceneNames } from "./scenes/scene-utility";
import { SpriteRenderer } from "./rendering/webgl/sprite-renderer";
import { SceneLogin } from "./scenes/scene-menu";
import { SceneGame } from "./scenes/scene-game";
import { loadTextureAssets } from "./rendering/webgl/textures";
import { SceneSpriteTest } from "./scenes/scene-sprite-test";
import { setupSceneSelector } from "../dev_tools/scene-selector";
import { setupInfoMenu } from "../dev_tools/info-menu";

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
        SceneSpriteTest
    );
    sceneManager.gotoScene(SceneNames.SpriteTest);

    setInterval(() => {
        sceneManager.update();
    }, 16);

    // Dev Tool, should probably be excluded in a production build =) 
    setupSceneSelector(inputManger, sceneManager);
    setupInfoMenu(inputManger);
}