import { SceneNames } from "./scene-utility";
import { InputManager } from "../rendering/webgl/input";
import { SpriteRenderer } from "../rendering/webgl/sprite-renderer";

var _tempSceneManager: SceneManager;

/*
    About the life time of a scene

    When a scene first comes to life the proud alpha SceneManager
    welcomes the new member of the flock by the ceremony of registration.
    The ceremony involvs the SceneManager to give birth to the newly born
    Scene again. That might seem weird but that's life out in the wild.
    
    All of the scenes takes turn to update all of its fine variables and run fancy algorithms.
    When a scene has had enough for the day it politly tells its friendly scene by calling its name.
    The scene says it's goodbye and the who ever's up next says hello.
*/
export class Scene {

    readonly key: SceneNames;
    private sceneManager: SceneManager;
    readonly inputManager: InputManager;
    readonly spriteRenderer: SpriteRenderer;

    constructor(key: SceneNames) {
        this.key = key;
        this.sceneManager = _tempSceneManager;
        this.inputManager = _tempSceneManager.inputManager;
        this.spriteRenderer = _tempSceneManager.spriteRenderer;
    }

    update() {
    }

    hello() {
    }

    goodbye() {
    }

    /*
        "Final" methods.
        Probably don't override these ;)
    */

    gotoScene(name: SceneNames) {
        
        if (!this.sceneManager) {
            console.warn("It appears that this scene isn't registed with a scene manager. A scene manager is needed if you want to change scene : )");
            return;
        }

        this.sceneManager.gotoScene(name);
    }
}

export interface SceneConstructor {
    new (): Scene;
}

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
        _tempSceneManager = this;
        scenes.forEach(ctor => {
            const scene = new ctor();
            if (this.scenes[scene.key]) {
                console.warn(`Hold your horses! You have already registerd a scene with the name "${scene.key}"`);
                return;
            }
            
            this.scenes[scene.key] = scene;
        });
        _tempSceneManager = null;
    }

    gotoScene(name: SceneNames) {
        
        // Delay the scene transition til the next frame
        setTimeout(() => {  
            const nextScene = this.scenes[name];
            if (!nextScene) {
                console.error(`Unable to find scene "${name}" in the scene manager.`);
                return;
            }

            if (this.currentScene) {
                this.currentScene.goodbye();
            }
            this.currentScene = nextScene;
            this.currentScene.hello();
        });
    }

    update() {
        if (this.currentScene) {
            this.currentScene.update();
        }
    }
}
