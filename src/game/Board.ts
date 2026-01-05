import { Tile } from "./Tile";

export class Board {
  width = 4;
  height = 4;
  tiles: Tile[] = [];

  constructor() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.tiles.push({
          x,
          y,
          owner: y < 2 ? "player" : "enemy",
          bonus: "none",
          occupiedBy: null,
        });
      }
    }

    this.getTile(1, 1)!.bonus = "attack";
    this.getTile(2, 2)!.bonus = "defense";
  }

  getTile(x: number, y: number) {
    return this.tiles.find(t => t.x === x && t.y === y);
  }
}
