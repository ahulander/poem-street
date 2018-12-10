import { SceneNames } from "./scene-utility";
import { InputManager } from "../../input/input";
import { Scene, SceneConstructor, setTempSceneManager } from "./scene";
import { UI } from "../../rendering/ui/ui";
import { IRenderManager } from "../../rendering/render-manager";

export class SceneManager {

    readonly scenes: { [name: string]: Scene} = {};
    private currentScene: Scene;
    readonly inputManager: InputManager;
    readonly renderManager: IRenderManager;
    readonly gl: WebGLRenderingContext;
    readonly ui: UI;

    // TODO (Alex): Add support for multiple listeners
    private onSceneChanged: () => void;

    constructor(
        ui: UI,
        inputManager: InputManager,
        renderManager: IRenderManager
    ) {
        this.ui = ui;
        this.inputManager = inputManager;
        this.renderManager = renderManager;
    }

    on(event: "scenechanged", callback: () => void) {
        // TODO: (Alex): Add support for different events
        if (this.onSceneChanged) {
            console.warn("Multiple event listeners not supported at the moment! Please fix : )");
            return;
        }

        this.onSceneChanged = callback;
    }

    register(...scenes: SceneConstructor[]) {
        setTempSceneManager(this);
        scenes.forEach(ctor => {
            const scene = new ctor();
            if (this.scenes[scene.key]) {
                console.warn(`Hold your horses! You have already registerd a scene with the name "${scene.key}"`);
                return;
            }
            
            this.scenes[scene.key] = scene;
        });
        setTempSceneManager(null)
    }

    gotoScene(name: SceneNames) {
        
        // Delay the scene transition til the next frame
        setTimeout(() => {  
            const nextScene = this.scenes[name];
            if (!nextScene) {
                console.error(`Unable to find scene "${name}" in the scene manager.`);
                return;
            }

            this.inputManager.clearAllEventListeners();
            if (this.currentScene) {
                this.currentScene.goodbye();
            }
            this.currentScene = nextScene;
            this.currentScene.hello();

            if (this.onSceneChanged) {
                this.onSceneChanged();
            }
        });
    }

    update() {
        if (this.currentScene) {
            this.currentScene.update();
        }
        this.renderManager.draw();
    }
}
