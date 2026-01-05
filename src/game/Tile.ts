export type TileOwner = "player" | "enemy";
export type TileBonus = "none" | "attack" | "defense" | "range";

export interface Tile {
  x: number;
  y: number;
  owner: TileOwner;
  bonus: TileBonus;
  occupiedBy: string | null;
}
