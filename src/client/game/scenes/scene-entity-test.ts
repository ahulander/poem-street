import { SpritePool } from "../rendering/sprite-pool";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

enum EntityType {
    Human = 0,
    Dog
}

interface Entity {
    type: EntityType;
    pos: vec2;
    vel: vec2;
    hp: number;
}

interface EntityStats {
    speed: number;
    energyConsumption: number;
}

const entityStats: EntityStats[] = [];
entityStats[EntityType.Human] = {
    speed: 10,
    energyConsumption: 1
};
entityStats[EntityType.Dog] = {
    speed: 30,
    energyConsumption: 2
};

interface vec2 {
    x: number;
    y: number;
}

namespace vec2 {
    export function normalize(v: vec2) {
        const length = Math.sqrt(v.x * v.x + v.y * v.y);
        const inv = 1.0 /  (length > 0.0000001 ? length : 0.0000001);
        return { x: v.x *= inv, y: v.y *= inv };
    }

    export function sub(a: vec2, b: vec2) {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        };
    }

    export function add(a: vec2, b: vec2) {
        return {
            x: a.x + b.x,
            y: a.y + b.y
        };
    }

    export function scale(v: vec2, s: number) {
        return {
            x: v.x * s,
            y: v.y * s
        };
    }
}

function updateEntity(entity: Entity, dt: number, input) {
    const speed = entityStats[entity.type].speed;
    const energyConsumption = entityStats[entity.type].energyConsumption;

    const d = vec2.normalize(vec2.sub({x: input.x, y: input.y}, entity.pos));
    const v = vec2.scale(vec2.normalize(vec2.add(entity.vel, d)), speed);

    entity.hp -= energyConsumption;
    entity.vel = v;
    entity.pos = vec2.add(entity.pos, vec2.scale(entity.vel, dt));
}

function entityIsDead(entity: Entity) {
    return entity.hp <= 0;
}

function entityDraw(sprite: Phaser.GameObjects.TileSprite, entity: Entity) {
    sprite.tilePositionX = 32 * entity.type;
    sprite.setPosition(entity.pos.x, entity.pos.y);
    sprite.setSize(32, 32);
    sprite.setOrigin(0.5, 0.5);
    sprite.flipX = entity.vel.x < 0;
}

export class SceneEntityTest extends Phaser.Scene {
    
    private sprites: SpritePool;
    private entities: Entity[] = [];

    constructor() {
        super({key: "test"});

        this.sprites = new SpritePool(this);
    }

    preload() {
        this.load.image("test", "assets/test.png");
    }

    create() {
        this.input.on("pointerdown", this.createEntity.bind(this), this);
    }

    private createEntity(event) {

        const type = getRandomInt(0, 2);

        this.entities.push({
            hp: getRandomInt(1, 10) * 100,
            type: type,
            pos: {
                x: event.worldX,
                y: event.worldY
            },
            vel: {
                x: 0,
                y: 0
            }
        });
    }

    private lastFrame = 0;

    update() {

        const now = Date.now();
        const dt = (now - this.lastFrame) / 1000.0;
        this.lastFrame = now;
        
        // Update entities
        for (let i = 0; i < this.entities.length; ++i) {
            updateEntity(this.entities[i], dt, this.input);
        }

        const previousEntityCount = this.entities.length;
        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (entityIsDead(this.entities[i])) {
                this.entities.splice(i, 1);
            }
        }

        // Draw entities
        const flushCount = previousEntityCount - this.entities.length;
        this.sprites.clear(flushCount);
        for (let i = 0; i < this.entities.length; ++i) {
            entityDraw(this.sprites.get(), this.entities[i]);
        }
    }
}
