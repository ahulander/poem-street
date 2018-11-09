
function allowedProps(prop: string) {
    const props = {
        "type": true,
        "name": true
        // TODO: Add other normal boring props here!
    }
    return props[prop];
}

function eventProps(prop) {
    return prop.match(/^on+/);
}

function toEventName(prop: string) {
    return prop.replace("on", "").toLocaleLowerCase();
}

var JSX = {
    createElement: function(tag, props) {
        
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children = children.concat(arguments[_i]);
        }

        let result: HTMLElement;
        if (tag instanceof Function) {
            result = tag({
                ...props,
                children
            });
        }
        else {
            result = document.createElement(tag);
        }

        children.forEach(child => {
            if (typeof(child) === "string") {
                result.appendChild(document.createTextNode(child));
            }
            else if (Array.isArray(child)) {
                child.forEach(c => {
                    result.appendChild(c);
                });
            }
            else {
                result.appendChild(child);
            }
        });

        if (props) {
            // Normal boring props
            Object.keys(props).filter(allowedProps).forEach(prop => {
                result[prop] = props[prop]
            });
            
            // Styles
            if (props.style) {
                const style = Object.keys(props.style).map(name => `${name}:${props.style[name]}`).join(";");
                result.setAttribute("style", style);
            }

            // Events
            Object.keys(props).filter(eventProps).forEach(eventPropName => {
                result.addEventListener(toEventName(eventPropName), props[eventPropName]);
            });

            // Classes
            if (props.className) {
                result.className = props.className;
            } 
        }

        return result;
    }
};

(<any>window).JSX = JSX;
