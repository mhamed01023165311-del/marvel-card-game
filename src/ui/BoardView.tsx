import React from 'react';
import { Board, Tile } from '../types';
import { GAME_CONSTANTS } from '../constants';

interface BoardViewProps {
  board: Board;
  onTileClick: (tile: Tile) => void;
  selectedTile?: Tile;
}

const BoardView: React.FC<BoardViewProps> = ({ board, onTileClick, selectedTile }) => {
  const tileSize = 100;
  const boardWidth = board.width * tileSize;
  const boardHeight = board.height * tileSize;

  const handleTileClick = (tile: Tile) => {
    onTileClick(tile);
  };

  const getTileStyle = (tile: Tile): React.CSSProperties => {
    let backgroundColor = '#2D4263';
    let borderColor = '#1A5F7A';
    let transform = 'scale(1)';
    let boxShadow = 'none';

    if (tile.isHighlighted) {
      backgroundColor = tile.isSelectable ? '#4CAF50' : '#FF9800';
      transform = 'scale(1.05)';
      boxShadow = '0 0 15px rgba(76, 175, 80, 0.7)';
    }

    if (tile.occupiedBy) {
      const playerColor = tile.playerSide === 'player1' 
        ? GAME_CONSTANTS.COLORS.PLAYER1 
        : GAME_CONSTANTS.COLORS.PLAYER2;
      backgroundColor = playerColor;
      borderColor = tile.playerSide === 'player1' ? '#0066FF' : '#FF3366';
    }

    if (selectedTile && selectedTile.id === tile.id) {
      backgroundColor = '#FFD700';
      borderColor = '#FF9800';
      transform = 'scale(1.1)';
      boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
    }

    return {
      width: `${tileSize - 10}px`,
      height: `${tileSize - 10}px`,
      backgroundColor,
      border: `3px solid ${borderColor}`,
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: tile.isSelectable ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      transform,
      boxShadow,
      position: 'relative' as const,
    };
  };

  const getTileContent = (tile: Tile): React.ReactNode => {
    if (tile.occupiedBy) {
      return (
        <div style={styles.tileContent}>
          <div style={styles.cardIcon}>🃏</div>
          <div style={styles.playerIndicator}>
            {tile.playerSide === 'player1' ? '👤 ١' : '👤 ٢'}
          </div>
        </div>
      );
    }

    return (
      <div style={styles.coordinates}>
        ({tile.x}, {tile.y})
      </div>
    );
  };

  const renderGridLines = () => {
    const lines = [];
    
    // الخطوط الأفقية
    for (let y = 0; y <= board.height; y++) {
      lines.push(
        <div
          key={`hline-${y}`}
          style={{
            position: 'absolute',
            top: `${y * tileSize}px`,
            left: 0,
            width: '100%',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        />
      );
    }
    
    // الخطوط العمودية
    for (let x = 0; x <= board.width; x++) {
      lines.push(
        <div
          key={`vline-${x}`}
          style={{
            position: 'absolute',
            left: `${x * tileSize}px`,
            top: 0,
            width: '2px',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        />
      );
    }
    
    return lines;
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>لوحة اللعب ({board.width} × {board.height})</h3>
      
      <div
        style={{
          ...styles.board,
          width: `${boardWidth}px`,
          height: `${boardHeight}px`,
        }}
      >
        {renderGridLines()}
        
        {board.tiles.map((row, y) => (
          <div key={`row-${y}`} style={styles.row}>
            {row.map((tile) => (
              <div
                key={tile.id}
                style={getTileStyle(tile)}
                onClick={() => handleTileClick(tile)}
                title={`المربع (${tile.x}, ${tile.y})${tile.occupiedBy ? ' - مشغول' : ' - فارغ'}`}
              >
                {getTileContent(tile)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, backgroundColor: GAME_CONSTANTS.COLORS.PLAYER1 }}></div>
          <span>اللاعب ١</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, backgroundColor: GAME_CONSTANTS.COLORS.PLAYER2 }}></div>
          <span>اللاعب ٢</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, backgroundColor: '#4CAF50' }}></div>
          <span>مربع متاح</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, backgroundColor: '#FFD700' }}></div>
          <span>محدد</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '20px',
  },
  
  title: {
    fontSize: '1.5rem',
    color: '#FFFFFF',
    marginBottom: '10px',
  },
  
  board: {
    position: 'relative' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '15px',
    padding: '10px',
    border: '3px solid #2D4263',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  
  row: {
    display: 'flex',
    gap: '10px',
  },
  
  tileContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '5px',
  },
  
  cardIcon: {
    fontSize: '24px',
  },
  
  playerIndicator: {
    fontSize: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '2px 6px',
    borderRadius: '10px',
  },
  
  coordinates: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  legend: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    marginTop: '15px',
  },
  
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  
  legendColor: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
};

export default BoardView; 
