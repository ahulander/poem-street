
import * as fs from "fs";
import { cartesianToIsometric } from "../../common/math/isometrics";
import { TileViewModel, GameWorldViewModel } from "../../common/world/worldModels";
import { TiledTile, TiledJson } from "../../common/typings/tiled";

export class GameWorld {

  private map_: TiledTile[][] = [];
  private tiles_: TiledTile[];
  private json_: TiledJson;
  private worldViewModel_: GameWorldViewModel;

  constructor(public readonly worldSize: number) {
    let data = fs.readFileSync("public/assets/isometric_grass_and_water.json");

    this.json_ = JSON.parse(data.toString());
    this.tiles_ = this.json_.tiles;

    this.createWorld();
    this.createWorldViewModel();
  }

  public getWorldViewModel(): GameWorldViewModel {
    return this.worldViewModel_;
  }

  createWorld() {
    //Init map arrays
    for (let i = 0 ; i < this.worldSize; i++) {
      this.map_[i] = [];
      for (let j = 0; j < this.worldSize; j++) { 
        this.map_[i][j] = undefined;
      }
    }

    for (let row = 0 ; row < this.worldSize; row++) {
      for (let col = 0; col < this.worldSize; col++) {
        let possibilites = this.getPossibleTiles(row, col);
        if (possibilites.length > 0) {
          let randomTileIndex = Math.floor(Math.random() * possibilites.length);
          this.map_[col][row] = possibilites[randomTileIndex];
        } else {
            throw "no tiles fit! RIP! plz maek more tile cuz dis shud not haepn";
        }
      }
    }
  }

  private createWorldViewModel() {

    let tiles = [];
    for (let row = 0 ; row < this.worldSize; row++) {
      for (let col = 0; col < this.worldSize; col++) {
        let currentTile = this.map_[col][row];
        let cartesianPosition = {x: col * this.json_.tilewidth/2, y: row * this.json_.tileheight/2};
        let isoPosition = cartesianToIsometric(cartesianPosition);

        let tileVM = {
          id: currentTile.id,
          terrain: currentTile.terrain,
          positionX: isoPosition.x,
          positionY: isoPosition.y,
        };

        tiles.push(tileVM);
      }
    }
    this.worldViewModel_ = {
      tiles: tiles,
      tileWidth: this.json_.tilewidth,
      tileHeight: this.json_.tileheight
    }
  }

  private getPossibleTiles(row: number, column: number) {

    let leftNeighbor = column - 1 >= 0 && column < this.worldSize ? this.map_[column-1][row] : undefined;
    let rightNeighbor = column > 0 && column + 1 < this.worldSize ? this.map_[column+1][row] : undefined; 
    let upNeighbor = row - 1 >= 0 && row < this.worldSize ? this.map_[column][row-1] : undefined;
    let downNeighbor = row > 0 && row + 1 < this.worldSize ? this.map_[column][row+1] : undefined;

    let up = upNeighbor ? upNeighbor.terrain : undefined;
    let down = downNeighbor ? downNeighbor.terrain : undefined;
    let left = leftNeighbor ? leftNeighbor.terrain : undefined;
    let right = rightNeighbor ? rightNeighbor.terrain : undefined;

    // How terrain of each tile is split up, and how it matches other tiles.
    // example of 5 tiles and how their terrain indexes look like
    //
    //      [0,1]
    //      [2,3] 
    //[0,1] [0,1] [0,1]
    //[2,3] [2,3] [2,1]
    //      [0,1]
    //      [2,3]
    //
    
    //Filter out tiles that do not fit
    return this.tiles_.filter((tile) => {
      let terrain = tile.terrain;

      if (up) {
        if (terrain[0] !== up[2]) {
          return false;
        }
  
        if (terrain[1] !== up[3]) { 
          return false;
        }
      }

      if (down) {
        if (terrain[2] !== down[0]) {
          return false;
        }
  
        if (terrain[3] !== down[1]) {
          return false;
        }
      }

      if (left) {
        if (terrain[0] !== left[1]) {
          return false;
        }
  
        if (terrain[2] !== left[3]) {
          return false;
        }
      }

      if (right) {
        if (terrain[1] !== right[0]) {
          return false;
        }
  
        if (terrain[3] !== right[2]) {
          return false;
        }
      }

      return true;
    });
  }
}