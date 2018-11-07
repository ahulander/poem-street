import { Assets } from "../assets/assets";

export interface Sprite {

    /**
        World position
    */
    x: number;
    y: number;
    
    /**
        Sprite draw order.
        Higher values are rendered ontop of lower values.

        Defaults to 0
    */
    layer?: number;
    
    /**
        Center of the sprite.
        {0, 0} -> top left corner of the sprite
        {1, 1} -> bottom right corner

        Defaults to { 0.5, 0.5 }
    */
    originX?: number;
    originY?: number;
    width: number;
    height: number;

    /**
        Four texture coorinates of the sprite.
        Coordinates are given in pixels
        [0] -> left
        [1] -> top
        [2] -> right
        [4] -> bottom
    */
    textureRect: number[];
    textureName: Assets.Textures;
    tint?: number[]; 
}
