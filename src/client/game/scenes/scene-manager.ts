import { SceneNames } from "./scene-utility";
import { InputManager } from "../input/input";
import { SpriteRenderer } from "../rendering/sprite-renderer";
import { clearScreenBuffer } from "../rendering/context";
import { Scene, SceneConstructor, setTempSceneManager } from "./scene";

export class SceneManager {

    private scenes: { [name: string]: Scene} = {};
    private currentScene: Scene;
    readonly inputManager: InputManager;
    readonly spriteRenderer: SpriteRenderer;

    constructor(inputManager: InputManager, spriteRenderer: SpriteRenderer) {
        this.inputManager = inputManager;
        this.spriteRenderer = spriteRenderer;
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
        });
    }

    update() {
        if (this.currentScene) {
            clearScreenBuffer();
            this.currentScene.update();
            this.spriteRenderer.flush();
        }
    }
}
