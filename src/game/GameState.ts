import { Board } from "./Board";
import { Player } from "./Player";
import { TurnManager } from "./TurnManager";

export class GameState {
  board = new Board();
  turn = new TurnManager();
  player: Player;
  enemy: Player;

  constructor(player: Player, enemy: Player) {
    this.player = player;
    this.enemy = enemy;
  }
}
