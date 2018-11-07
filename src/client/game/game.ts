import { SceneManager } from "./scenes/scene-manager";
import { setupContex } from "../rendering/context";
import { InputManager } from "../input/input";
import { SceneNames } from "./scenes/scene-utility";
import { SpriteRenderer } from "../rendering/sprite-renderer";
import { SceneLogin } from "./scenes/scene-menu";
import { SceneGame } from "./scenes/scene-game";
import { SceneSpriteTest } from "./scenes/test/scene-sprite-test";
import { setupSceneSelector } from "../dev_tools/scene-selector";
import { setupInfoMenu } from "../dev_tools/info-menu";
import { SceneSpriteStressTest } from "./scenes/test/scene-sprite-stress-test";
import { SceneSeizure } from "./scenes/test/scene-seizure";
import { SceneSpriteTint } from "./scenes/test/scene-sprite-tint";
import { Assets } from "../assets/assets";
import { RenderPipeline } from "../rendering/post-fx-pipeline";
import { RenderTarget } from "../rendering/render-target";
import { CombinePass } from "./post_fx/combine-pass";
import { PassBlur } from "./post_fx/pass-blur";

export function setupGame() {

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    if (!canvas) {
        console.error("Missing canvas");
        return;
    }

    const gl = setupContex(canvas);
    if (!gl) {
        return;
    }
    
    Assets.loadAssets(gl);

    const spriteMap = new RenderTarget(gl, 800, 400);
    const tileMap = new RenderTarget(gl, 800, 400);
    const glowMap = new RenderTarget(gl, 800, 400);
    const fovMap = new RenderTarget(gl, 800, 400);
    
    const spriteRenderer = new SpriteRenderer(gl, spriteMap);
    const inputManger = new InputManager(canvas);
    const sceneManager = new SceneManager(gl, inputManger, spriteRenderer);
    const renderPipeline = new RenderPipeline(
        gl,
        spriteMap,
        tileMap,
        glowMap,
        fovMap,
        [
            CombinePass,
            PassBlur,
        ]
     );

    sceneManager.register(
        SceneLogin,
        SceneGame,
        SceneSpriteTest,
        SceneSpriteStressTest,
        SceneSeizure,
        SceneSpriteTint
    );
    sceneManager.gotoScene(SceneNames.SpriteTest);

    setInterval(() => {
        

        spriteMap.clear();
        tileMap.clear();
        glowMap.clear();
        fovMap.clear();
        
        sceneManager.update();

        spriteRenderer.flush();
        
        renderPipeline.apply();
    }, 16);

    // Dev Tool, should probably be excluded in a production build =) 
    setupSceneSelector(inputManger, sceneManager);
    setupInfoMenu(inputManger);
}