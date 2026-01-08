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
