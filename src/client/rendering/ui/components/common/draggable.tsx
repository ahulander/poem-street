
export interface JSXAttributes {
    title: string;
    children?: any[];
    onDismiss?: (event: Event) => void;
}

const styleDraggable = {
    "position": "absolute",
    "top": "10px",
    "left": "10px"
}

let _dx;
let _dy;
let _currentTarget;

window.onmousemove = (event) => {
    if (_currentTarget) {
        _currentTarget.style.left = (event.clientX + _dx) + "px";
        _currentTarget.style.top = (event.clientY + _dy) + "px";
    }
}

window.onmouseup = () => {
    _currentTarget = null;
}

export function Draggable({title, onDismiss, children}: JSXAttributes) {

    function onStartDrag(event) {
        _currentTarget = event.target.closest(".draggable");
        _dx = parseInt(_currentTarget.style.left, 10) - event.clientX;
        _dy = parseInt(_currentTarget.style.top, 10) - event.clientY;
    }
    
    const result = (
        <div className="draggable" style={styleDraggable} onMouseDown={onStartDrag}>
            <h3 className="draggable__header">
                <span>{title}</span>
                { onDismiss ? <button className="draggable__btn-dismiss" onClick={onDismiss}>&times;</button> : null }
            </h3>
            <div>
                {children}
            </div>
        </div>
    );

    return result;
}
