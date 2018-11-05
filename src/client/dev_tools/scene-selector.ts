import { SceneNames } from "../game/scenes/scene-utility";
import { SceneManager } from "../game/scenes/scene-manager";
import { InputManager } from "../game/input/input";

interface SceneSelector {
    open: boolean;
    readonly root: HTMLElement;
}

function toggleSceneSelector(sceneSelector: SceneSelector) {
    sceneSelector.open = !sceneSelector.open;

    if (sceneSelector.open) {
        sceneSelector.root.classList.remove("hidden");
    }
    else {
        sceneSelector.root.classList.add("hidden");
    }
}

function createSceneSelectorElement(sceneManager: SceneManager) {
    const root = document.createElement("div");
    root.classList.add("scene-selector", "hidden");

    const content = document.createElement("div");
    content.classList.add("scene-selector__content");
    root.appendChild(content);

    const header = document.createElement("h2");
    header.textContent = "Open Scene";
    header.classList.add("scene-selector__header");
    content.appendChild(header);

    const body = document.createElement("div");
    body.classList.add("scene-selector__body");
    content.appendChild(body);

    const excludedScenes = [ SceneNames.Game ];
    const scenes = Object.keys(SceneNames).map(n => SceneNames[n]).filter(a => !excludedScenes.find(b => a === b));
    
    scenes.forEach(name => {
        const button = document.createElement("button");
        button.textContent = name;
        button.onclick = () => {
            sceneManager.gotoScene(name);
        }
        body.appendChild(button);
    });

    return root;
}

export function setupSceneSelector(inputManager: InputManager, sceneManager: SceneManager) {

    const root = createSceneSelectorElement(sceneManager);
    document.body.appendChild(root);

    const sceneSelector: SceneSelector = {
        open: false,
        root: root
    };

    inputManager.registerKeyboardShortcut("Alt+§", () => {
        toggleSceneSelector(sceneSelector);
    }, "Toggle scene menu", true);
}
