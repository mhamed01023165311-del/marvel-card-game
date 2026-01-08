import { Tile } from '../types';

export function createTile(x: number, y: number): Tile {
  return {
    id: `tile_${x}_${y}`,
    x,
    y,
    isHighlighted: false,
    isSelectable: false
  };
}

export function occupyTile(tile: Tile, cardId: string, playerSide: string): Tile {
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

export function highlightTile(tile: Tile): Tile {
  return {
    ...tile,
    isHighlighted: true
  };
}

export function unhighlightTile(tile: Tile): Tile {
  return {
    ...tile,
    isHighlighted: false
  };
}

export function setTileSelectable(tile: Tile, selectable: boolean): Tile {
  return {
    ...tile,
    isSelectable: selectable
  };
}

export function isTileOccupied(tile: Tile): boolean {
  return !!tile.occupiedBy;
}

export function getTileOwner(tile: Tile): string | null {
  return tile.playerSide || null;
}

export function isTileSelectable(tile: Tile): boolean {
  return tile.isSelectable;
}

export function isTileHighlighted(tile: Tile): boolean {
  return tile.isHighlighted;
}

export function getTilePosition(tile: Tile): { x: number; y: number } {
  return { x: tile.x, y: tile.y };
}

export function getTileDistance(tile1: Tile, tile2: Tile): number {
  const dx = Math.abs(tile1.x - tile2.x);
  const dy = Math.abs(tile1.y - tile2.y);
  return dx + dy; // مسافة مانهاتن
}

export function getAdjacentPositions(tile: Tile): { x: number; y: number }[] {
  return [
    { x: tile.x, y: tile.y - 1 }, // أعلى
    { x: tile.x + 1, y: tile.y }, // يمين
    { x: tile.x, y: tile.y + 1 }, // أسفل
    { x: tile.x - 1, y: tile.y }  // يسار
  ];
}

export function isPositionValid(x: number, y: number, boardWidth: number, boardHeight: number): boolean {
  return x >= 0 && x < boardWidth && y >= 0 && y < boardHeight;
}

export function getTileDirection(from: Tile, to: Tile): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  
  if (dy < 0) return 'north';
  if (dx > 0) return 'east';
  if (dy > 0) return 'south';
  if (dx < 0) return 'west';
  return 'same';
}

export function tilesAreAdjacent(tile1: Tile, tile2: Tile): boolean {
  const distance = getTileDistance(tile1, tile2);
  return distance === 1;
}

export function getTileCenterPosition(tile: Tile, tileSize: number): { x: number; y: number } {
  return {
    x: tile.x * tileSize + tileSize / 2,
    y: tile.y * tileSize + tileSize / 2
  };
}

export function createTileGrid(width: number, height: number): Tile[][] {
  const grid: Tile[][] = [];
  
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    
    for (let x = 0; x < width; x++) {
      row.push(createTile(x, y));
    }
    
    grid.push(row);
  }
  
  return grid;
}

export function findTileById(tiles: Tile[][], tileId: string): Tile | null {
  for (const row of tiles) {
    for (const tile of row) {
      if (tile.id === tileId) {
        return tile;
      }
    }
  }
  return null;
}

export function findTileByPosition(tiles: Tile[][], x: number, y: number): Tile | null {
  if (y >= 0 && y < tiles.length && x >= 0 && x < tiles[y].length) {
    return tiles[y][x];
  }
  return null;
}

export function getAllOccupiedTiles(tiles: Tile[][]): Tile[] {
  const occupied: Tile[] = [];
  
  for (const row of tiles) {
    for (const tile of row) {
      if (isTileOccupied(tile)) {
        occupied.push(tile);
      }
    }
  }
  
  return occupied;
}

export function getPlayerTiles(tiles: Tile[][], playerSide: string): Tile[] {
  const playerTiles: Tile[] = [];
  
  for (const row of tiles) {
    for (const tile of row) {
      if (tile.playerSide === playerSide) {
        playerTiles.push(tile);
      }
    }
  }
  
  return playerTiles;
}

export function getEmptyTiles(tiles: Tile[][]): Tile[] {
  const empty: Tile[] = [];
  
  for (const row of tiles) {
    for (const tile of row) {
      if (!isTileOccupied(tile)) {
        empty.push(tile);
      }
    }
  }
  
  return empty;
      } 
