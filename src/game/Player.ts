import { Card } from "./Card";

export class Player {
  hand: Card[] = [];
  damageDone = 0;

  constructor(cards: Card[]) {
    this.hand = cards;
  }
}
