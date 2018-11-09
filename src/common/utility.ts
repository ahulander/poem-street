
export function parseMessage<TType>(json: string): TType {
    let result = null;
    try {
        result = JSON.parse(json);
    } catch(error) {
        console.error(error);
        result = null;
    }
    return result;
}

export type FixedTimeout = number;

let _nextIntervalId = 0;
const _fixedIntervals: {[id: number]: NodeJS.Timeout | boolean} = {};

export function setFixedInterval(callback: () => void, targetMs: number): FixedTimeout {
    var id = _nextIntervalId++;
    _fixedIntervals[id] = true;

    function run() {
        const n = Date.now();
        callback();
        const time = Date.now() - n;
        const msUntilNextTick = Math.max(targetMs - time, 0.0);
        
        if (_fixedIntervals[id]) {
            _fixedIntervals[id] = setTimeout(run, msUntilNextTick);
        }
    }
    run();
    return id;
}

export function clearFixedInterval(id: FixedTimeout) {
    if (_fixedIntervals[id]) {
        clearTimeout(<NodeJS.Timeout>_fixedIntervals[id]);
        delete _fixedIntervals[id];
    }
}

