import { GameWorldViewModel } from "../../common/world/worldModels";
import { ErrorResponse } from "../../common/api/authentication";
import game from "../server";

export async function getGameWorld(request: any): Promise<GameWorldViewModel | ErrorResponse> {
  return game.getGameWorldViewModel();
}
