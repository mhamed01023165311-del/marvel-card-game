import React from 'react';
import { Card, CardType, Rarity } from '../types';
import { getTypeColor, getRarityColor } from '../constants';

interface CardViewProps {
  card: Card;
  onClose?: () => void;
  onClick?: (card: Card) => void;
  isSelected?: boolean;
  isPlayable?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const CardView: React.FC<CardViewProps> = ({
  card,
  onClose,
  onClick,
  isSelected = false,
  isPlayable = true,
  size = 'medium'
}) => {
  const cardSize = {
    small: { width: 120, height: 180 },
    medium: { width: 180, height: 270 },
    large: { width: 240, height: 360 }
  }[size];

  const typeNames: Record<CardType, string> = {
    attack: '⚔️ هجومي',
    defense: '🛡️ دفاعي',
    ranged: '🎯 رامي',
    mixed: '⚡ مختلط'
  };

  const rarityNames: Record<Rarity, string> = {
    common: 'شائع',
    rare: 'نادر',
    epic: 'ملحمي',
    legendary: 'أسطوري'
  };

  const handleClick = () => {
    if (onClick && isPlayable) {
      onClick(card);
    }
  };

  const cardStyle: React.CSSProperties = {
    width: `${cardSize.width}px`,
    height: `${cardSize.height}px`,
    backgroundColor: getTypeColor(card.type),
    border: `4px solid ${getRarityColor(card.rarity)}`,
    borderRadius: '15px',
    padding: '15px',
    cursor: isPlayable ? 'pointer' : 'default',
    transform: isSelected ? 'translateY(-10px) scale(1.05)' : 'none',
  };

  return (
    <div
      style={cardStyle}
      onClick={handleClick}
      title={card.description}
    >
      <h3 style={{ margin: '0 0 10px 0', color: '#FFFFFF' }}>
        {card.name}
      </h3>
      <div style={{ fontSize: '14px', marginBottom: '10px' }}>
        <div>{typeNames[card.type]}</div>
        <div style={{ color: getRarityColor(card.rarity) }}>
          {rarityNames[card.rarity]}
        </div>
      </div>
      <div style={{ marginTop: '10px' }}>
        <div>⚔️ {card.attack}/10</div>
        <div>🛡️ {card.defense}/10</div>
        <div>⚡ {card.speed}/10</div>
        <div>❤️ {card.health}/100</div>
      </div>
    </div>
  );
};

export default CardView;
