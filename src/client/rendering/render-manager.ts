
export interface ITextureManager {
    load(name: number, url: string);
    get(name: number);
}

export interface ISpriteRenderer {
    draw(sprite);
    flush();
}

export interface IRenderManager {
    readonly textures: ITextureManager;
    readonly spriteRenderer: ISpriteRenderer;
    readonly canvas: HTMLCanvasElement;

    draw();
}
