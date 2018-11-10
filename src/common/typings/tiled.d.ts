export interface TiledJson {
  columns: number;
  grid: TiledGrid;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  terrains: TiledTerrain[];
  tilecount: number;
  tiledversion: string;
  tileheight: number;
  tileoffset: {x: number, y: number};
  tiles: TiledTile[];
  tilewidth: number;
  type: string;
  version: number;
 
  //TODO: wangsets ?
}

export interface TiledGrid {
  height: number;
  orientation: string;
  width: number;
}

export interface TiledTerrain {
  name: string;
  tile: number;
}

export interface TiledTile {
  id: number;
  terrain: number[];
}