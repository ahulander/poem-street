
export type FuncEventHandler = (event: any)=>void;

export class EventQueue {
    
    private events: any[] = [];
    private handlers: FuncEventHandler[] = [];
    private typeToName: (type: any) => string;

    constructor(handlers: FuncEventHandler[], typeToName: (type: any) => string) {
        this.handlers = handlers;
        this.typeToName = typeToName;
    }

    queue(event) {
        this.events.push(event);
    }

    process() {
        const events = this.events.splice(0, this.events.length);
        for (let i = 0; i < events.length; ++i) {
            const event = events[i];
            if (this.handlers[event.type]) {
                this.handlers[event.type](event);
            }
            else {
                console.warn(`Unhandled game event: ${this.typeToName(event.type)}`);
            }
        }
    }
}
