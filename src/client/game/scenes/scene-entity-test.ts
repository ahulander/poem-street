import { SpritePool } from "../rendering/sprite-pool";
import { EventQueue } from "../../../common/event-queue";
import { vec2 } from "../../../common/math/vector2";

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
    private eventQueue: EventQueue;

    constructor() {
        super({key: "test"});

        this.createEntity = this.createEntity.bind(this);

        const eventHandlers: FuncEventHandler[] = [];
        eventHandlers[GameEventType.CreateDog] = this.createEntity;
        eventHandlers[GameEventType.CreateHuman] = this.createEntity;

        this.sprites = new SpritePool(this);
        this.eventQueue = new EventQueue(eventHandlers, type => GameEventType[type]);
    }

    preload() {
        this.load.image("test", "assets/test.png");
    }

    create() {
        this.input.on("pointerdown", (event) => {
            this.eventQueue.queue({
                type: (Date.now() % 2 === 0) ? GameEventType.CreateDog : GameEventType.CreateHuman,
                pos: {
                    x: event.worldX,
                    y: event.worldY
                }
            });
        }, this);
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

    private lastFrame = 0;

    update() {

        const now = Date.now();
        const dt = (now - this.lastFrame) / 1000.0;
        this.lastFrame = now;
        
        this.eventQueue.process();

        // Update entities
        for (let i = 0; i < this.entities.length; ++i) {
            updateEntity(this.entities[i], dt, this.input);
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (entityIsDead(this.entities[i])) {
                this.entities.splice(i, 1);
            }
        }

        // Draw entities
        this.sprites.clear();
        for (let i = 0; i < this.entities.length; ++i) {
            entityDraw(this.sprites.get(), this.entities[i]);
        }
    }
}
