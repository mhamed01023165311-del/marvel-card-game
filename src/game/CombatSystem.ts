import { Character } from "./Character";

export function fight(attacker: Character, defender: Character) {
  const damage =
    attacker.card.attack - defender.card.defense;

  if (damage > 0) {
    defender.health -= damage;
    return damage;
  }
  return 0;
}
