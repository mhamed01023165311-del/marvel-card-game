export type TileOwner = "player" | "enemy";

export interface Tile {
  x: number;
  y: number;
  owner: TileOwner;
  occupied: boolean;
}
