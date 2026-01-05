import { Card } from "./Card";
import { Tile } from "./Tile";

export class Character {
  card: Card;
  health: number;

  constructor(card: Card) {
    this.card = card;
    this.health = 100;
  }

  applyTile(tile: Tile) {
    if (tile.bonus === "attack") this.card.attack += 10;
    if (tile.bonus === "defense") this.card.defense += 10;
    if (tile.bonus === "range") this.card.range += 1;
  }
}
