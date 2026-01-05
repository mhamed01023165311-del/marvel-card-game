import { Tile } from "./Tile";

export class Board {
  width = 4;
  height = 4;
  tiles: Tile[] = [];

  constructor() {
    this.generate();
  }

  generate() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.tiles.push({
          x,
          y,
          owner: y < this.height / 2 ? "player" : "enemy",
          occupied: false,
        });
      }
    }
  }
    }
