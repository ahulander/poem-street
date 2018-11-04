
export class SpritePool {
    
    private pool: Phaser.GameObjects.TileSprite[] = [];
    private count: number = 0;
    private readonly maxCount = 256;
    private scene: Phaser.Scene;
    

    constructor (scene: Phaser.Scene) {
        this.scene = scene;
    }

    get() {
        if (this.count > this.maxCount) {
            console.warn("Max sprite count exceeded");
            return this.pool[this.pool.length - 1];
        }
        if (this.count >= this.pool.length) {
            this.pool.push(this.scene.add.tileSprite(0, 0, 256, 256, "test"));
        }
        this.count++;
        const result = this.pool[this.count - 1];
        result.setActive(true);
        result.setVisible(true);
        return result;
    }

    reset() {
        this.pool.splice(0, this.pool.length);
    }

    clear() {
        this.count = 0;
    }

    flush() {
        for (let i = this.count; i < this.pool.length; ++i) {
            const sprite = this.pool[i];
            sprite.setActive(false);
            sprite.setVisible(false);
        }
    }
}
