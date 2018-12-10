import { SceneManager } from "./scenes/scene-manager";
import { InputManager } from "../input/input";
import { SceneNames } from "./scenes/scene-utility";
import { SceneLogin } from "./scenes/scene-menu";
import { SceneGame } from "./scenes/scene-game";
import { setupSceneSelector } from "../dev_tools/scene-selector";
import { setupInfoMenu } from "../dev_tools/info-menu";
import { Assets } from "../assets/assets";
import { setFixedInterval } from "../../common/utility";
import { UI } from "../rendering/ui/ui";
import { Time } from "../../common/time";
import { IRenderManager } from "../rendering/render-manager";
import { PixiRenderManager } from "../rendering/pixi/pixi-render-manager";

export function setupGame() {

    const renderManager: IRenderManager = new PixiRenderManager();
    
    Assets.loadAssets(renderManager);
    
    const ui = new UI(document.getElementById("ui_root"));

    const inputManger = new InputManager(renderManager.canvas);
    const sceneManager = new SceneManager(ui, inputManger, renderManager);

    sceneManager.register(
        SceneLogin,
        SceneGame
    );
    sceneManager.gotoScene(SceneNames.Menu);

    function tick() {

        Time.deltaTime = 1.0 / 60.0;

        
        sceneManager.update();

        // Flush rendering?
    }
    setFixedInterval(tick, 16);   

    // Dev Tool, should probably be excluded in a production build =) 
    setupSceneSelector(ui, inputManger, sceneManager);
    setupInfoMenu(ui, inputManger, sceneManager);
}