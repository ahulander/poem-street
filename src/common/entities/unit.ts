import { vec2 } from "../math/vector2";

export enum UnitType {
    Human = 0,
    Dog
}

export interface UnitData {
    id: number;
    userId: number;
    type: UnitType;
    position: vec2;
    target: vec2;
    moving: boolean;
}

export interface UnitStats {
    readonly speed: number;
}

const unitStats: UnitStats[] = [];
unitStats[UnitType.Human] = {
    speed: 10
};
unitStats[UnitType.Dog] = {
    speed: 30
};

export function tick(unit: UnitData, deltaTime: number) {
    
    if (unit.moving) {
        const stats = unitStats[unit.type];
        const direction = vec2.sub(unit.target, unit.position);
        const d = vec2.normalize(direction);
        const maxDist = vec2.magnitude(direction);
        unit.position = vec2.add(
            unit.position,
             vec2.scale(d, Math.min(stats.speed * deltaTime, maxDist))
        );

        unit.moving = vec2.distance(unit.position, unit.target) > 1.0;
    }
}

