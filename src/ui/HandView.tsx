import React from 'react';
import { Card } from '../types';
import CardView from './CardView';
import { GAME_CONSTANTS } from '../constants';

interface HandViewProps {
  cards: Card[];
  onCardSelect: (card: Card) => void;
  isActive: boolean;
  playerColor: string;
  maxCards?: number;
  showEmptySlots?: boolean;
}

const HandView: React.FC<HandViewProps> = ({
  cards,
  onCardSelect,
  isActive,
  playerColor,
  maxCards = GAME_CONSTANTS.MAX_HAND_SIZE,
  showEmptySlots = true
}) => {
  const handleCardClick = (card: Card) => {
    if (isActive) {
      onCardSelect(card);
    }
  };

  const getCardPlayability = (card: Card): boolean => {
    if (!isActive) return false;
    
    // يمكن إضافة منطق إضافي هنا للتحقق من إمكانية لعب البطاقة
    // مثل التحقق من تكلفة المانا، الشروط الخاصة، إلخ.
    return true;
  };

  const renderCard = (card: Card, index: number) => {
    const isPlayable = getCardPlayability(card);
    
    return (
      <div
        key={card.id}
        style={{
          ...styles.cardWrapper,
          transform: isActive ? 'translateY(-10px)' : 'none',
          transition: 'transform 0.3s ease',
        }}
      >
        <CardView
          card={card}
          onClick={handleCardClick}
          isPlayable={isPlayable}
          size="small"
        />
        <div style={styles.cardIndex}>{index + 1}</div>
      </div>
    );
  };

  const renderEmptySlot = (index: number) => {
    return (
      <div key={`empty-${index}`} style={styles.emptyCard}>
        <div style={styles.emptyCardContent}>
          <div style={styles.emptyCardIcon}>🃏</div>
          <div style={styles.emptyCardText}>فارغ</div>
        </div>
        <div style={styles.cardIndex}>{index + 1}</div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ ...styles.title, color: playerColor }}>
          اليد ({cards.length}/{maxCards})
        </h3>
        {isActive && (
          <div style={styles.activeIndicator}>
            <span style={styles.activeText}>🔴 دورك!</span>
          </div>
        )}
      </div>

      <div style={styles.cardsContainer}>
        {cards.map((card, index) => renderCard(card, index))}
        
        {showEmptySlots && cards.length < maxCards && (
          Array.from({ length: maxCards - cards.length }).map((_, index) =>
            renderEmptySlot(cards.length + index)
          )
        )}
      </div>

      {cards.length === 0 && (
        <div style={styles.emptyHandMessage}>
          <p>اليد فارغة. اسحب بطاقات جديدة!</p>
          <div style={styles.emptyHandIcon}>🎴</div>
        </div>
      )}

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>إجمالي الهجوم:</span>
          <span style={styles.statValue}>
            {cards.reduce((sum, card) => sum + card.attack, 0)}
          </span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>إجمالي الدفاع:</span>
          <span style={styles.statValue}>
            {cards.reduce((sum, card) => sum + card.defense, 0)}
          </span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>البطاقات النادرة:</span>
          <span style={styles.statValue}>
            {cards.filter(card => card.rarity === 'rare' || card.rarity === 'epic' || card.rarity === 'legendary').length}
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    border: '2px solid rgba(255, 255, 255, 0.1)',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
  },

  title: {
    fontSize: '1.5rem',
    margin: 0,
    fontWeight: 'bold' as const,
  },

  activeIndicator: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    padding: '5px 15px',
    borderRadius: '20px',
    animation: 'pulse 1.5s infinite',
  },

  activeText: {
    color: '#FF4444',
    fontWeight: 'bold' as const,
    fontSize: '0.9rem',
  },

  cardsContainer: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    marginBottom: '20px',
    minHeight: '200px',
  },

  cardWrapper: {
    position: 'relative' as const,
  },

  cardIndex: {
    position: 'absolute' as const,
    top: '-10px',
    right: '-10px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    border: '2px solid white',
  },

  emptyCard: {
    width: '120px',
    height: '180px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '2px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  },

  emptyCardContent: {
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.5)',
  },

  emptyCardIcon: {
    fontSize: '40px',
    marginBottom: '10px',
  },

  emptyCardText: {
    fontSize: '12px',
  },

  emptyHandMessage: {
    textAlign: 'center' as const,
    padding: '30px',
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
    marginBottom: '20px',
  },

  emptyHandIcon: {
    fontSize: '50px',
    marginTop: '15px',
  },

  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '15px',
    borderRadius: '10px',
    marginTop: 'auto',
  },

  statItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '5px',
  },

  statLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
  },

  statValue: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },
};

// إضافة أنيميشن للنبض
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }
`, styleSheet.cssRules.length);

export default HandView;
