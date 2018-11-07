import { Scene } from "../scene";
import { SceneNames } from "../scene-utility";
import { EventQueue } from "../../../../common/event-queue";
import { vec2 } from "../../../../common/math/vector2";
import { MouseState } from "../../../input/input";
import { Assets } from "../../../assets/assets";
import { Sprite } from "../../../rendering/sprite";

enum GameEventType {
    CreateHuman = 0,
    CreateDog
}

interface GameEvent {
    type: GameEventType;
}

interface CreateEvent extends GameEvent {
    pos: vec2;
}

type FuncEventHandler = (event: GameEvent) => void;

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
    id: number;
    type: EntityType;
    pos: vec2;
    vel: vec2;
    target: vec2;
    hp: number;
    cellId?: number;
}

interface EntityStats {
    speed: number;
    energyConsumption: number;
}

const entityStats: EntityStats[] = [];
entityStats[EntityType.Human] = {
    speed: 60,
    energyConsumption: 1
};
entityStats[EntityType.Dog] = {
    speed: 30,
    energyConsumption: 2
};

interface Cell {
    [key: number]: Entity;
}
const cells: {[cellId: number]: Cell} = {};

function updateEntity(entity: Entity, dt: number, input: MouseState) {
    const speed = entityStats[entity.type].speed;
    const energyConsumption = entityStats[entity.type].energyConsumption;

    const d = vec2.normalize(vec2.sub(entity.target, entity.pos));
    let v = vec2.scale(vec2.normalize(vec2.add(entity.vel, d)), speed);


    const cell = cells[entity.cellId] || {};
    
    for(let id in cell) {
        const other = cell[id];
        if (id !== "" + entity.id &&
            other &&
            vec2.distance(entity.pos, other.pos) < 32
        ) {
            v = vec2.add(v, vec2.sub(entity.pos, other.pos));
        }
    }
    

    // entity.hp -= energyConsumption;
    dt = isNaN(dt) ? 0.0 : dt;
    entity.vel = vec2.scale(v, 1.0);
    entity.pos = vec2.add(entity.pos, vec2.scale(entity.vel, 0.01));
}

function entityIsDead(entity: Entity) {
    return entity.hp <= 0;
}

function entityToSprite(entity: Entity): Sprite {
    let left = 32 * entity.type;
    let right = left + 32;
    const top = 0;
    const bottom = 32;

    if (
        (entity.type == EntityType.Human && entity.vel.x < 0) ||
        (entity.type == EntityType.Dog && entity.vel.x > 0)
    ) {
        let temp = left;
        left = right;
        right = temp;
    }

    return {
        x: Math.floor(entity.pos.x),
        y: Math.floor(entity.pos.y),
        width: 32,
        height: 32,
        textureName: Assets.Textures.Test,
        originY: 1,
        textureRect: [
            left, top,
            right, bottom
        ]
    }
}

export class SceneSpriteTest extends Scene {
    
    private entities: Entity[] = [];
    private eventQueue: EventQueue;
    private nextEntityId: number = 0;
    private randomizeTargetInterval;

    constructor() {
        super(SceneNames.SpriteTest);

        this.createEntity = this.createEntity.bind(this);

        const eventHandlers: FuncEventHandler[] = [];
        eventHandlers[GameEventType.CreateDog] = this.createEntity;
        eventHandlers[GameEventType.CreateHuman] = this.createEntity;

        this.eventQueue = new EventQueue(eventHandlers, type => GameEventType[type]);
    }

    hello() {
        this.inputManager.onLeftClick = (mouse) => {
            this.eventQueue.queue({
                type: (Date.now() % 2 === 0) ? GameEventType.CreateDog : GameEventType.CreateHuman,
                pos: {
                    x: mouse.worldX,
                    y: mouse.worldY
                }
            });
        };

        for (let y = 0; y < 10; ++y) {
            for (let x = 0; x < 10; ++x) {
                const index = x + y * 10;
                cells[index] = {};
            }
        }

        this.entities = [];
        this.nextEntityId = 0;

        const count = 2000;
        for (let i = 0; i < count; ++i) {
            this.entities.push({
                id: this.nextEntityId++,
                hp: getRandomInt(1, 10) * 100,
                type: EntityType.Human,
                pos: {
                    x: -300 + Math.floor(Math.random() * 600),
                    y: -150 + Math.floor(Math.random() * 300),
                },
                vel: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: -300 + Math.floor(Math.random() * 600),
                    y: -150 + Math.floor(Math.random() * 300),
                }
            });
        }

        this.randomizeTargetInterval = setInterval(() => {
            this.entities.forEach(e => {
                e.target = {
                    x: -300 + Math.floor(Math.random() * 600),
                    y: -150 + Math.floor(Math.random() * 300),
                };
            })
        }, 10000);

        setInterval(() => {
            // console.log(this.count);
            this.count = 0;
        }, 1000);
    }

    goodbye() {
        clearInterval(this.randomizeTargetInterval);
    }

    private lastFrame = 0;
    private count = 0;

    update() {

        this.count++;

        const now = Date.now();
        const dt = (now - this.lastFrame) / 1000.0;
        this.lastFrame = now;
        
        this.eventQueue.process();

        // Update entities
        const mouse = this.inputManager.getMouseState();
        // this.entities[this.entities.length - 1].pos = {
        //     x: mouse.worldX,
        //     y: mouse.worldY
        // };
        for (let i = 0; i < this.entities.length; ++i) {
            const entity = this.entities[i];
            updateEntity(entity, dt, mouse);


            if (cells[entity.cellId]) {
                delete cells[entity.cellId][entity.id];
            }

            const x = Math.floor((entity.pos.x + 500) / 100);
            const y = Math.floor((entity.pos.y + 500) / 100);
            const index = x + y * 10;
            if (cells[index]) {
                entity.cellId = index;
                cells[index][entity.id] = entity;
            }
        }

        // for (let i = this.entities.length - 1; i >= 0; --i) {
        //     if (entityIsDead(this.entities[i])) {
        //         this.entities.splice(i, 1);
        //     }
        // }

        // Draw entities
        for (let i = 0; i < this.entities.length; ++i) {
            this.spriteRenderer.draw(entityToSprite(this.entities[i]));
        }
    }

    private createEntity(event: CreateEvent) {

        const type = event.type === GameEventType.CreateDog ? EntityType.Dog : EntityType.Human;

        this.entities.push({
            id: this.nextEntityId++,
            hp: getRandomInt(1, 10) * 100,
            type: type,
            pos: event.pos,
            vel: {
                x: 0,
                y: 0
            },
            target: {
                x: -300 + Math.floor(Math.random() * 600),
                y: -150 + Math.floor(Math.random() * 300),
            }
        });
    }
}