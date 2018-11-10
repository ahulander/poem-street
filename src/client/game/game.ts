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
import { PassFog } from "./post_fx/pass-fog";
import { FieldOfViewRenderer } from "../rendering/fov-renderer";
import { SceneAnimatedSprite } from "./scenes/test/scene-animated-sprite";
import { setFixedInterval } from "../../common/utility";
import { UI } from "../rendering/ui/ui";
import { Time } from "../../common/time";

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

    const spriteMap = new RenderTarget(gl, 800, 400, true);
    const tileMap = new RenderTarget(gl, 800, 400);
    const glowMap = new RenderTarget(gl, 800, 400);
    const fovMap = new RenderTarget(gl, 800, 400);
    
    const ui = new UI(document.getElementById("ui_root"));
    const spriteRenderer = new SpriteRenderer(gl, spriteMap);
    const fovRenderer = new FieldOfViewRenderer(gl, fovMap);
    const inputManger = new InputManager(canvas);
    const sceneManager = new SceneManager(gl, ui, inputManger, spriteRenderer, fovRenderer);
    const renderPipeline = new RenderPipeline(
        gl,
        spriteMap,
        tileMap,
        glowMap,
        fovMap,
        [
            CombinePass,
            //PassBlur,
            PassFog
        ]
    );

    sceneManager.register(
        SceneLogin,
        SceneGame,
        SceneSpriteTest,
        SceneSpriteStressTest,
        SceneSeizure,
        SceneSpriteTint,
        SceneAnimatedSprite
    );
    sceneManager.gotoScene(SceneNames.TestAnimatedSprite);

    function tick() {

        Time.deltaTime = 1.0 / 60.0;

        spriteMap.clear();
        tileMap.clear();
        glowMap.clear();
        fovMap.clear();
        
        sceneManager.update();

        spriteRenderer.flush();
        
        renderPipeline.apply();
    }
    setFixedInterval(tick, 16);   

    // Dev Tool, should probably be excluded in a production build =) 
    setupSceneSelector(ui, inputManger, sceneManager);
    setupInfoMenu(ui, inputManger, sceneManager);
}