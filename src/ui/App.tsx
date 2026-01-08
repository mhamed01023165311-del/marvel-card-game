import React, { useState, useEffect } from 'react';
import { GameStateManager } from '../game/GameState';
import { GAME_CONSTANTS } from '../constants';
import BoardView from './BoardView';
import HandView from './HandView';
import CardView from './CardView';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<any>(null);
  const [gameManager] = useState(new GameStateManager());
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameMessages, setGameMessages] = useState<string[]>([]);

  useEffect(() => {
    // تحميل الحالة الأولية
    const initialState = gameManager.getState();
    setGameState(initialState);
    setIsLoading(false);

    // الاشتراك في تحديثات الحالة
    const unsubscribe = gameManager.subscribe((newState) => {
      setGameState(newState);
      setGameMessages(newState.messages.slice(-5)); // آخر 5 رسائل فقط
    });

    // بدء اللعبة
    setTimeout(() => {
      gameManager.startGame();
    }, 1000);

    return unsubscribe;
  }, [gameManager]);

  const handleCardSelect = (card: any) => {
    setSelectedCard(card);
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

  if (isLoading || !gameState) {
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
      {/* شريط العنوان */}
      <header style={styles.header}>
        <h1 style={styles.title}>🎮 لعبة بطاقات مارفل التكتيكية</h1>
        <div style={styles.gameInfo}>
          <span style={styles.turnInfo}>الدور: {gameState.turn}/{gameState.maxTurns}</span>
          <span style={styles.phaseInfo}>المرحلة: {getPhaseName(gameState.phase)}</span>
          <span style={styles.playerInfo}>اللاعب النشط: {currentPlayer.name}</span>
        </div>
      </header>

      {/* المنطقة الرئيسية */}
      <main style={styles.main}>
        {/* لوحة اللاعب 1 */}
        <div style={styles.playerSection}>
          <div style={styles.playerHeader}>
            <h2 style={{ color: GAME_CONSTANTS.COLORS.PLAYER1 }}>
              {gameState.players[0].name}
            </h2>
            <div style={styles.playerStats}>
              <span>❤️ {gameState.players[0].health}/{GAME_CONSTANTS.STARTING_HEALTH}</span>
              <span>✨ {gameState.players[0].mana}/{gameState.players[0].maxMana}</span>
              <span>🏆 {gameState.players[0].score}</span>
            </div>
          </div>
          <HandView
            cards={gameState.players[0].hand}
            onCardSelect={handleCardSelect}
            isActive={gameState.currentPlayerIndex === 0}
            playerColor={GAME_CONSTANTS.COLORS.PLAYER1}
          />
        </div>

        {/* لوحة اللعب المركزية */}
        <div style={styles.boardSection}>
          <div style={styles.boardContainer}>
            <BoardView
              board={gameState.board}
              onTileClick={handleTileClick}
              selectedTile={gameState.selectedTile}
            />
            
            {/* معلومات اللعبة */}
            <div style={styles.gameControls}>
              <button
                onClick={handleEndTurn}
                style={styles.controlButton}
                disabled={!gameState.phase.includes('end')}
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

            {/* الرسائل */}
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

        {/* لوحة اللاعب 2 */}
        <div style={styles.playerSection}>
          <div style={styles.playerHeader}>
            <h2 style={{ color: GAME_CONSTANTS.COLORS.PLAYER2 }}>
              {gameState.players[1].name}
            </h2>
            <div style={styles.playerStats}>
              <span>❤️ {gameState.players[1].health}/{GAME_CONSTANTS.STARTING_HEALTH}</span>
              <span>✨ {gameState.players[1].mana}/{gameState.players[1].maxMana}</span>
              <span>🏆 {gameState.players[1].score}</span>
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

      {/* البطاقة المحددة */}
      {selectedCard && (
        <div style={styles.selectedCardOverlay}>
          <CardView
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            isSelected={true}
          />
        </div>
      )}

      {/* شاشة النهاية */}
      {gameState.isGameOver && (
        <div style={styles.gameOverOverlay}>
          <div style={styles.gameOverModal}>
            <h2 style={styles.gameOverTitle}>🎉 انتهت اللعبة! 🎉</h2>
            {gameState.winner ? (
              <p style={styles.winnerText}>
                الفائز: {gameState.players.find(p => p.side === gameState.winner)!.name}
              </p>
            ) : (
              <p style={styles.drawText}>تعادل!</p>
            )}
            <div style={styles.finalScores}>
              <div>
                <h3>{gameState.players[0].name}</h3>
                <p>النقاط: {gameState.players[0].score}</p>
                <p>البطاقات المتبقية: {gameState.players[0].hand.length}</p>
              </div>
              <div>
                <h3>{gameState.players[1].name}</h3>
                <p>النقاط: {gameState.players[1].score}</p>
                <p>البطاقات المتبقية: {gameState.players[1].hand.length}</p>
              </div>
            </div>
            <button
              onClick={handleRestartGame}
              style={styles.restartButton}
            >
              لعب مرة أخرى
            </button>
          </div>
        </div>
      )}

      {/* تذييل الصفحة */}
      <footer style={styles.footer}>
        <p>لعبة بطاقات مارفل التكتيكية ثلاثية الأبعاد | تطوير: mhamed01023165311-del</p>
        <p>🎴 كل بطاقة هي مغامرة جديدة! ⚡</p>
      </footer>
    </div>
  );
};

// وظيفة مساعدة للحصول على اسم المرحلة
const getPhaseName = (phase: string): string => {
  const phaseNames: Record<string, string> = {
    draw: 'سحب البطاقات',
    play: 'لعب البطاقات',
    attack: 'هجوم',
    end: 'إنهاء الدور'
  };
  return phaseNames[phase] || phase;
};

// الأنماط
const styles = {
  container: {
    backgroundColor: '#0A0A1A',
    color: '#FFFFFF',
    minHeight: '100vh',
    fontFamily: "'Cairo', sans-serif",
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
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
    paddingBottom: '20px',
    borderBottom: '2px solid #2D4263',
  },
  
  title: {
    fontSize: '2.5rem',
    color: '#f0131e',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
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
  
  phaseInfo: {
    backgroundColor: '#C84B31',
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
    marginBottom: '30px',
  },
  
  playerSection: {
    flex: 1,
    backgroundColor: 'rgba(45, 66, 99, 0.3)',
    borderRadius: '15px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
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
    fontSize: '1rem',
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
    transition: 'all 0.3s',
    fontFamily: "'Cairo', sans-serif",
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
    fontSize: '0.9rem',
  },
  
  selectedCardOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
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
    maxWidth: '600px',
    width: '90%',
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
  
  finalScores: {
    display: 'flex',
    justifyContent: 'space-around',
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
    transition: 'all 0.3s',
    fontFamily: "'Cairo', sans-serif",
  },
  
  footer: {
    textAlign: 'center' as const,
    padding: '20px',
    borderTop: '2px solid #2D4263',
    fontSize: '0.9rem',
    color: '#AAAAAA',
  },
};

// إضافة أنيميشن
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default App; 
