import * as PIXI from "pixi.js";
import { setFixedInterval } from "../../common/utility";
import * as API from "../api";
import { GameWorldViewModel, TileViewModel } from "../../common/world/worldModels";
import { cartesianToIsometric } from "../../common/math/isometrics";
import { TiledJson } from "../../common/typings/tiled";


export function setupPixiGame2() {

  var app = PIXI.autoDetectRenderer(1800, 900, {backgroundColor: 0x1099bb});
  document.body.appendChild(app.view);

  var stage = new PIXI.Container();

  let camPos = new PIXI.Point(app.width/2, app.height/2);
  let dragging = false;
  let dragStartPosX = 0;
  let dragStartPosY = 0;

  stage.pivot = camPos;

  window.addEventListener("mousedown", (event: MouseEvent) => {
    dragging = true;
    dragStartPosX = event.screenX;
    dragStartPosY = event.screenY;
  });

  window.addEventListener("mouseup", (event: MouseEvent) => {
    dragging = false;
  });

  window.addEventListener("mousemove", (event: MouseEvent) => {
    if (dragging)
    {
      let deltaX = dragStartPosX - event.screenX;
      let deltaY = dragStartPosY - event.screenY;

      camPos.x += deltaX;
      camPos.y += deltaY;

      stage.pivot = camPos;

      dragStartPosX = event.screenX;
      dragStartPosY = event.screenY; 
    }
  });

  setInterval(() => {
    app.render(stage);
  });

  const sprites: PIXI.Sprite[] = [];

  let setup = async () => {
    let texture = PIXI.loader.resources["spriteSheet"].texture;
    let json = PIXI.loader.resources["spriteSheetJson"].data;
  
    let textures = createTileTexturesFromJSON(texture, json);

    let gameWorld: GameWorldViewModel = await API.getGameWorld();
    let map = gameWorld.tiles;

    for (let i = 0; i < map.length; i++) {
      let currentTile = map[i];

      let currentTexture = textures[currentTile.id];
      let newSprite = new PIXI.Sprite(currentTexture);
      
      newSprite.position.x = currentTile.positionX + 100;
      newSprite.position.y = currentTile.positionY + 100;
      sprites.push(newSprite);

      stage.addChild(newSprite);
    }
  };

  PIXI.loader.add("spriteSheet", "assets/isometric_grass_and_water.png").add("spriteSheetJson", "assets/isometric_grass_and_water.json").load(setup);
}

function createTileTexturesFromJSON(spriteSheet: PIXI.Texture, tileJson: TiledJson): PIXI.Texture[] {

  let rows = tileJson.tilecount / tileJson.columns;

  let textures: PIXI.Texture[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < tileJson.columns; col++) {

      let tilewidth = tileJson.tilewidth;
      let tileheight = tileJson.tileheight;
      let colPos = col * tilewidth;
      let rowPos = row * tileheight;
      let subRect = new PIXI.Rectangle(colPos, rowPos, tilewidth, tileheight);
      let texture = new PIXI.Texture(spriteSheet.baseTexture, subRect);

      textures.push(texture);
    }
  }
  return textures;
}