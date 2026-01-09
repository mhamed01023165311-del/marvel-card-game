import React from 'react';
import { Card } from '../types';
import CardView from './CardView';
import { GAME_CONSTANTS } from '../constants';

interface HandViewProps {
  cards: Card[];
  onCardSelect: (card: Card) => void;
  isActive: boolean;
  playerColor: string;
}

const HandView: React.FC<HandViewProps> = ({
  cards,
  onCardSelect,
  isActive,
  playerColor,
}) => {
  const handleCardClick = (card: Card) => {
    if (isActive) {
      onCardSelect(card);
    }
  };

  const getCardPlayability = (_card: Card): boolean => {
    return isActive;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ ...styles.title, color: playerColor }}>
          اليد ({cards.length}/{GAME_CONSTANTS.MAX_HAND_SIZE})
        </h3>
      </div>

      <div style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <div key={card.id} style={styles.cardWrapper}>
            <CardView
              card={card}
              onClick={handleCardClick}
              isPlayable={getCardPlayability(card)}
              size="small"
            />
          </div>
        ))}
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
  },
  header: {
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '1.5rem',
    margin: 0,
  },
  cardsContainer: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'relative' as const,
  },
};

export default HandView;
