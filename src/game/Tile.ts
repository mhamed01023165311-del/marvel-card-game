import { Tile, PlayerSide } from '../types';

export function createTile(x: number, y: number): Tile {
  return {
    id: `tile_${x}_${y}`,
    x,
    y,
    isHighlighted: false,
    isSelectable: false
  };
}

// عدل النوع من string إلى PlayerSide
export function occupyTile(tile: Tile, cardId: string, playerSide: PlayerSide): Tile {
  return {
    ...tile,
    occupiedBy: cardId,
    playerSide
  };
}

export function vacateTile(tile: Tile): Tile {
  return {
    ...tile,
    occupiedBy: undefined,
    playerSide: undefined
  };
}

export function isTileOccupied(tile: Tile): boolean {
  return !!tile.occupiedBy;
}

export function getTileOwner(tile: Tile): PlayerSide | null {
  return tile.playerSide || null;
}
