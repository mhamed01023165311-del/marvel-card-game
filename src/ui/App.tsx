import React, { useState, useEffect } from 'react';
import { GameStateManager } from '../game/GameState';
import { GAME_CONSTANTS } from '../constants';
import BoardView from './BoardView';
import HandView from './HandView';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<any>(null);
  const [gameManager] = useState(new GameStateManager());
  const [gameMessages, setGameMessages] = useState<string[]>([]);

  useEffect(() => {
    const initialState = gameManager.getState();
    setGameState(initialState);

    const unsubscribe = gameManager.subscribe((newState) => {
      setGameState(newState);
      setGameMessages(newState.messages.slice(-5));
    });

    setTimeout(() => {
      gameManager.startGame();
    }, 1000);

    return unsubscribe;
  }, [gameManager]);

  const handleCardSelect = (card: any) => {
    gameManager.selectCard(card);
  };

  const handleTileClick = (tile: any) => {
    if (gameState?.phase === 'play' && tile.isSelectable) {
      gameManager.playCard(tile);
    }
  };

  const handleEndTurn = () => {
    gameManager.nextTurn();
  };

  const handleRestartGame = () => {
    gameManager.resetGame();
    gameManager.startGame();
  };

  if (!gameState) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>جاري تحميل اللعبة...</p>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🎮 لعبة بطاقات مارفل التكتيكية</h1>
        <div style={styles.gameInfo}>
          <span style={styles.turnInfo}>الدور: {gameState.turn}/{gameState.maxTurns}</span>
          <span style={styles.playerInfo}>اللاعب النشط: {currentPlayer.name}</span>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.playerSection}>
          <div style={styles.playerHeader}>
            <h2 style={{ color: GAME_CONSTANTS.COLORS.PLAYER1 }}>
              {gameState.players[0].name}
            </h2>
            <div style={styles.playerStats}>
              <span>❤️ {gameState.players[0].health}</span>
              <span>✨ {gameState.players[0].mana}</span>
            </div>
          </div>
          <HandView
            cards={gameState.players[0].hand}
            onCardSelect={handleCardSelect}
            isActive={gameState.currentPlayerIndex === 0}
            playerColor={GAME_CONSTANTS.COLORS.PLAYER1}
          />
        </div>

        <div style={styles.boardSection}>
          <div style={styles.boardContainer}>
            <BoardView
              board={gameState.board}
              onTileClick={handleTileClick}
            />
            
            <div style={styles.gameControls}>
              <button
                onClick={handleEndTurn}
                style={styles.controlButton}
              >
                إنهاء الدور
              </button>
              <button
                onClick={handleRestartGame}
                style={{ ...styles.controlButton, backgroundColor: '#C84B31' }}
              >
                إعادة اللعبة
              </button>
            </div>

            <div style={styles.messagesContainer}>
              <h3>رسائل اللعبة:</h3>
              <div style={styles.messagesList}>
                {gameMessages.map((message, index) => (
                  <div key={index} style={styles.message}>
                    {message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.playerSection}>
          <div style={styles.playerHeader}>
            <h2 style={{ color: GAME_CONSTANTS.COLORS.PLAYER2 }}>
              {gameState.players[1].name}
            </h2>
            <div style={styles.playerStats}>
              <span>❤️ {gameState.players[1].health}</span>
              <span>✨ {gameState.players[1].mana}</span>
            </div>
          </div>
          <HandView
            cards={gameState.players[1].hand}
            onCardSelect={handleCardSelect}
            isActive={gameState.currentPlayerIndex === 1}
            playerColor={GAME_CONSTANTS.COLORS.PLAYER2}
          />
        </div>
      </main>

      {gameState.isGameOver && (
        <div style={styles.gameOverOverlay}>
          <div style={styles.gameOverModal}>
            <h2 style={styles.gameOverTitle}>🎉 انتهت اللعبة! 🎉</h2>
            {gameState.winner ? (
              <p style={styles.winnerText}>
                الفائز: {gameState.players.find((p: any) => p.side === gameState.winner)!.name}
              </p>
            ) : (
              <p style={styles.drawText}>تعادل!</p>
            )}
            <button
              onClick={handleRestartGame}
              style={styles.restartButton}
            >
              لعب مرة أخرى
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0A0A1A',
    color: '#FFFFFF',
    minHeight: '100vh',
    fontFamily: "'Cairo', sans-serif",
    padding: '20px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0A0A1A',
  },
  loader: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(255, 255, 255, 0.1)',
    borderTop: '5px solid #f0131e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#FFFFFF',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#f0131e',
    marginBottom: '10px',
  },
  gameInfo: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    fontSize: '1.1rem',
  },
  turnInfo: {
    backgroundColor: '#2D4263',
    padding: '8px 16px',
    borderRadius: '20px',
  },
  playerInfo: {
    backgroundColor: '#1A5F7A',
    padding: '8px 16px',
    borderRadius: '20px',
  },
  main: {
    display: 'flex',
    flex: 1,
    gap: '20px',
  },
  playerSection: {
    flex: 1,
    backgroundColor: 'rgba(45, 66, 99, 0.3)',
    borderRadius: '15px',
    padding: '20px',
  },
  playerHeader: {
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  playerStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '10px',
  },
  boardSection: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  boardContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '20px',
  },
  gameControls: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  },
  controlButton: {
    backgroundColor: '#2D4263',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  messagesContainer: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: '10px',
    padding: '15px',
    marginTop: '20px',
  },
  messagesList: {
    maxHeight: '150px',
    overflowY: 'auto' as const,
    marginTop: '10px',
  },
  message: {
    padding: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  gameOverOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  gameOverModal: {
    backgroundColor: '#1A1A2E',
    padding: '40px',
    borderRadius: '20px',
    textAlign: 'center' as const,
  },
  gameOverTitle: {
    fontSize: '2.5rem',
    color: '#f0131e',
    marginBottom: '20px',
  },
  winnerText: {
    fontSize: '1.8rem',
    color: '#FFD700',
    marginBottom: '30px',
  },
  drawText: {
    fontSize: '1.8rem',
    color: '#FFFFFF',
    marginBottom: '30px',
  },
  restartButton: {
    backgroundColor: '#f0131e',
    color: 'white',
    border: 'none',
    padding: '15px 40px',
    borderRadius: '10px',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
};

export default App;
