import { InputManager } from "../input/input";

export function setupInfoMenu(inputManager: InputManager) {
    const root = document.createElement("div");
    root.classList.add("scene-selector", "hidden");

    const content = document.createElement("div");
    content.classList.add("scene-selector__content");
    root.appendChild(content);

    const header = document.createElement("h2");
    header.textContent = "Info";
    header.classList.add("scene-selector__header");
    content.appendChild(header);

    const body = document.createElement("div");
    body.classList.add("scene-selector__body");

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const tdHeadShortcut = document.createElement("td");
    const tdHeadComment = document.createElement("td");
    const tdHeadGlobal = document.createElement("td");
    tdHeadGlobal.appendChild(document.createTextNode("Global"));
    tdHeadComment.appendChild(document.createTextNode("Comment"));
    tdHeadShortcut.appendChild(document.createTextNode("Shortcut"));
    trHead.appendChild(tdHeadShortcut);
    trHead.appendChild(tdHeadComment);
    trHead.appendChild(tdHeadGlobal);
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    
    table.appendChild(tbody);
    body.appendChild(table);
    content.appendChild(body);
    document.body.appendChild(root);

    inputManager.registerKeyboardShortcut("F1", () => {
        if (root.classList.contains("hidden")) {
            root.classList.remove("hidden");
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            console.log();
            inputManager.getShortcutInfo().forEach(info => {
                const tr = document.createElement("tr");
                const tdShortcut = document.createElement("td");
                const tdComment = document.createElement("td");
                const tdGlobal = document.createElement("td");
                tdGlobal.appendChild(document.createTextNode(info.global ? "True" : "False"));
                tdComment.appendChild(document.createTextNode(info.comment));
                tdShortcut.appendChild(document.createTextNode(info.shortcut));
                tr.appendChild(tdShortcut);
                tr.appendChild(tdComment);
                tr.appendChild(tdGlobal);
                tbody.appendChild(tr);
            });
        }
        else {
            root.classList.add("hidden");
        }
    }, "Brings up the help menu", true);
}
