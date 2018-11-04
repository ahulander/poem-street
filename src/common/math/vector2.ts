
export interface vec2 {
    x: number;
    y: number;
}

export function vec2(x: number, y: number) {
    return { x, y };
}

export namespace vec2 {
    export function normalize(v: vec2) {
        const x = v.x;
        const y = v.y;
        const length = Math.sqrt(x * x + y * y);
        const inv = 1.0 /  (length > 0.0000001 ? length : 0.0000001);
        return vec2(x * inv, y * inv);
    }

    export function sub(a: vec2, b: vec2) {
        return vec2(a.x - b.x, a.y - b.y);
    }

    export function add(a: vec2, b: vec2) {
        return vec2(a.x + b.x, a.y + b.y);
    }

    export function scale(v: vec2, s: number) {
        return vec2(v.x * s, v.y * s);
    }
}
