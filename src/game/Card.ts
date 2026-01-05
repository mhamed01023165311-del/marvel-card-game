export type CardRole =
  | "attack"
  | "defense"
  | "ranged"
  | "attack-defense"
  | "attack-ranged";

export interface Card {
  id: string;
  name: string;
  role: CardRole;
  attack: number;
  defense: number;
  range: number;
}
