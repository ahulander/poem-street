import { Scene } from "./scene-manager";
import { SceneNames } from "./scene-utility";
import { EventQueue } from "../../../common/event-queue";
import { Sprite } from "../rendering/webgl/sprite-renderer";
import { TextureNames } from "../rendering/webgl/textures";
import { vec2 } from "../../../common/math/vector2";
import { clearScreenBuffer } from "../rendering/webgl/context";
import { MouseState } from "../rendering/webgl/input";

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

function updateEntity(entity: Entity, dt: number, input: MouseState) {
    const speed = entityStats[entity.type].speed;
    const energyConsumption = entityStats[entity.type].energyConsumption;

    const d = vec2.normalize(vec2.sub({x: input.worldX, y: input.worldY}, entity.pos));
    const v = vec2.scale(vec2.normalize(vec2.add(entity.vel, d)), speed);

    entity.hp -= energyConsumption;
    entity.vel = v;
    entity.pos = vec2.add(entity.pos, vec2.scale(entity.vel, dt));
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
        x: entity.pos.x,
        y: entity.pos.y,
        width: 32,
        height: 32,
        textureName: TextureNames.Test,
        textureRect: [
            left, top,
            right, bottom
        ]
    }
}

export class SceneSpriteTest extends Scene {
    
    private entities: Entity[] = [];
    private eventQueue: EventQueue;

    constructor() {
        super(SceneNames.SpriteTest);

        this.createEntity = this.createEntity.bind(this);

        const eventHandlers: FuncEventHandler[] = [];
        eventHandlers[GameEventType.CreateDog] = this.createEntity;
        eventHandlers[GameEventType.CreateHuman] = this.createEntity;

        this.eventQueue = new EventQueue(eventHandlers, type => GameEventType[type]);
    }

    hello() {
        this.inputManager.onClick = (mouse) => {
            this.eventQueue.queue({
                type: (Date.now() % 2 === 0) ? GameEventType.CreateDog : GameEventType.CreateHuman,
                pos: {
                    x: mouse.worldX,
                    y: mouse.worldY
                }
            });
        };
    }

    private lastFrame = 0;

    update() {

        const now = Date.now();
        const dt = (now - this.lastFrame) / 1000.0;
        this.lastFrame = now;
        
        this.eventQueue.process();

        // Update entities
        const mouse = this.inputManager.getMouseState();
        for (let i = 0; i < this.entities.length; ++i) {
            updateEntity(this.entities[i], dt, mouse);
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (entityIsDead(this.entities[i])) {
                this.entities.splice(i, 1);
            }
        }

        clearScreenBuffer();

        // Draw entities
        for (let i = 0; i < this.entities.length; ++i) {
            this.spriteRenderer.draw(entityToSprite(this.entities[i]));
        }
        this.spriteRenderer.flush();
    }

    private createEntity(event: CreateEvent) {

        const type = event.type === GameEventType.CreateDog ? EntityType.Dog : EntityType.Human;

        this.entities.push({
            hp: getRandomInt(1, 10) * 100,
            type: type,
            pos: event.pos,
            vel: {
                x: 0,
                y: 0
            }
        });
    }
}