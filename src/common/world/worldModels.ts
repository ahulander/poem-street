
export interface GameWorldViewModel {
  tiles: TileViewModel[];
  tileWidth;
  tileHeight;
}

export interface TileViewModel {
  id: number;
  terrain: number[];
  positionX: number;
  positionY: number;
}