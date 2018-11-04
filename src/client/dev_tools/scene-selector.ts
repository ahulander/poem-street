import { SceneNames } from "../game/scenes/scene-utility";

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

function createSceneSelectorElement(game) {
    const root = document.createElement("div");
    root.classList.add("scene-selector", "hidden");

    const content = document.createElement("div");
    content.classList.add("scene-selector__content");
    root.appendChild(content);

    const header = document.createElement("h2");
    header.textContent = "Open scene";
    content.appendChild(header);

    const body = document.createElement("div");
    content.appendChild(body);

    const excludedScenes = [ SceneNames.Game ];
    const scenes = Object.keys(SceneNames).map(n => SceneNames[n]).filter(a => !excludedScenes.find(b => a === b));
    
    scenes.forEach(name => {
        const button = document.createElement("button");
        button.textContent = name;
        button.onclick = () => {
            console.log(game.scene);
            game.scene.stop(game.scene.key);
            game.scene.start(name);
        }
        body.appendChild(button);
    });

    return root;
}

export function setupSceneSelector(game) {

    const root = createSceneSelectorElement(game);
    document.body.appendChild(root);

    const sceneSelector: SceneSelector = {
        open: false,
        root: root
    };

    window.onkeydown = (event) => {
        if (event.keyCode === 220 && event.altKey) {
            toggleSceneSelector(sceneSelector);
        }
    }
}
