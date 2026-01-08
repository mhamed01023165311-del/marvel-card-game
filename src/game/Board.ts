import { Board, Tile } from '../types';
import { GAME_CONSTANTS } from '../constants';

export function createBoard(): Board {
  const tiles: Tile[][] = [];
  
  for (let y = 0; y < GAME_CONSTANTS.BOARD_HEIGHT; y++) {
    const row: Tile[] = [];
    
    for (let x = 0; x < GAME_CONSTANTS.BOARD_WIDTH; x++) {
      row.push({
        id: `tile_${x}_${y}`,
        x,
        y,
        isHighlighted: false,
        isSelectable: false
      });
    }
    
    tiles.push(row);
  }
  
  return {
    tiles,
    width: GAME_CONSTANTS.BOARD_WIDTH,
    height: GAME_CONSTANTS.BOARD_HEIGHT
  };
}

export function getTileAt(board: Board, x: number, y: number): Tile | null {
  if (y < 0 || y >= board.height || x < 0 || x >= board.width) {
    return null;
  }
  return board.tiles[y][x];
}

export function isTileOccupied(tile: Tile): boolean {
  return !!tile.occupiedBy;
}

export function getOccupyingPlayer(tile: Tile): string | null {
  return tile.playerSide || null;
}

export function highlightTile(board: Board, x: number, y: number, highlight: boolean): Board {
  const tile = getTileAt(board, x, y);
  if (tile) {
    tile.isHighlighted = highlight;
  }
  return board;
}

export function setTileSelectable(board: Board, x: number, y: number, selectable: boolean): Board {
  const tile = getTileAt(board, x, y);
  if (tile) {
    tile.isSelectable = selectable;
  }
  return board;
}

export function clearHighlights(board: Board): Board {
  board.tiles.forEach(row => {
    row.forEach(tile => {
      tile.isHighlighted = false;
      tile.isSelectable = false;
    });
  });
  return board;
}

export function getAdjacentTiles(board: Board, tile: Tile): Tile[] {
  const adjacent: Tile[] = [];
  const directions = [
    { dx: 0, dy: -1 },  // أعلى
    { dx: 1, dy: 0 },   // يمين
    { dx: 0, dy: 1 },   // أسفل
    { dx: -1, dy: 0 }   // يسار
  ];
  
  for (const dir of directions) {
    const adjacentTile = getTileAt(board, tile.x + dir.dx, tile.y + dir.dy);
    if (adjacentTile) {
      adjacent.push(adjacentTile);
    }
  }
  
  return adjacent;
}

export function getTilesInRange(board: Board, centerTile: Tile, range: number): Tile[] {
  const tiles: Tile[] = [];
  
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      const distance = Math.abs(x - centerTile.x) + Math.abs(y - centerTile.y);
      if (distance <= range) {
        const tile = getTileAt(board, x, y);
        if (tile) {
          tiles.push(tile);
        }
      }
    }
  }
  
  return tiles;
}

export function getEmptyTiles(board: Board): Tile[] {
  const emptyTiles: Tile[] = [];
  
  board.tiles.forEach(row => {
    row.forEach(tile => {
      if (!isTileOccupied(tile)) {
        emptyTiles.push(tile);
      }
    });
  });
  
  return emptyTiles;
}

export function getPlayerTiles(board: Board, playerSide: string): Tile[] {
  const playerTiles: Tile[] = [];
  
  board.tiles.forEach(row => {
    row.forEach(tile => {
      if (tile.playerSide === playerSide) {
        playerTiles.push(tile);
      }
    });
  });
  
  return playerTiles;
}

export function countTilesByPlayer(board: Board, playerSide: string): number {
  return getPlayerTiles(board, playerSide).length;
}

export function isBoardFull(board: Board): boolean {
  for (const row of board.tiles) {
    for (const tile of row) {
      if (!isTileOccupied(tile)) {
        return false;
      }
    }
  }
  return true;
        }
