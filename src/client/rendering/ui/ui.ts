import "./components/jsx"

export abstract class UIElement {
    private static nextId = 0;
    readonly id: number;

    /**
        UI Root element
        Add cool stuff to this when an element is created!
    */
    root: HTMLElement;

    constructor() {
        this.id = UIElement.nextId++;
    }

    enabled() {}
    disabled() {}
}

export class UI {

    private elements: {[id: number]: HTMLElement} = {}
    private root: HTMLElement;

    constructor(root: HTMLElement) {
        this.root = root;
    }

    add(element: UIElement) {
        
        if (this.elements[element.id]) {
            console.warn(`Element with Id: ${element.id} is allready present in UI!`);
            return;
        }

        const root = element.root;
        if (!root) {
            console.warn("Missing root UI element!");
            return;
        }

        element.enabled();
        this.root.appendChild(root);
        this.elements[element.id] = root;
    }

    remove(element: UIElement) {
        if (!this.elements[element.id]) {
            console.warn(`Unable to find ui element with id: ${element.id}`);
            return;
        }

        element.disabled();
        this.root.removeChild(this.elements[element.id]);
        delete this.elements[element.id];
    }
}
