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
  // استخدم onClose أو احتفظ بها للاستخدام المستقبلي
  React.useEffect(() => {
    if (onClose) {
      // يمكن استخدامها في المستقبل
    }
  }, [onClose]);

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
    display: 'flex',
    flexDirection: 'column',
    cursor: isPlayable ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    transform: isSelected ? 'translateY(-10px) scale(1.05)' : 'none',
    boxShadow: isSelected
      ? `0 0 25px ${getRarityColor(card.rarity)}`
      : '0 5px 15px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Cairo', sans-serif",
  };

  return (
    <div
      style={cardStyle}
      onClick={handleClick}
      title={card.description}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.2))',
        borderRadius: '11px',
      }}></div>

      <div style={{ zIndex: 2, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>
            {card.name}
          </h3>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#FFD700',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            Lvl {card.level}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '10px' }}>
          <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
            {typeNames[card.type]}
          </span>
          <span style={{ fontWeight: 'bold', color: getRarityColor(card.rarity) }}>
            {rarityNames[card.rarity]}
          </span>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontSize: '12px' }}>
            <span style={{ width: '60px', fontWeight: 'bold', color: '#FFFFFF' }}>⚔️ هجوم:</span>
            <div style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', height: '12px', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '6px', width: `${card.attack * 10}%`, backgroundColor: '#FF4444' }}></div>
              <span style={{ position: 'absolute', right: '5px', top: '0', fontSize: '10px', color: '#FFFFFF', lineHeight: '12px' }}>{card.attack}/10</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontSize: '12px' }}>
            <span style={{ width: '60px', fontWeight: 'bold', color: '#FFFFFF' }}>🛡️ دفاع:</span>
            <div style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', height: '12px', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '6px', width: `${card.defense * 10}%`, backgroundColor: '#4488FF' }}></div>
              <span style={{ position: 'absolute', right: '5px', top: '0', fontSize: '10px', color: '#FFFFFF', lineHeight: '12px' }}>{card.defense}/10</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontSize: '12px' }}>
            <span style={{ width: '60px', fontWeight: 'bold', color: '#FFFFFF' }}>⚡ سرعة:</span>
            <div style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', height: '12px', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '6px', width: `${card.speed * 10}%`, backgroundColor: '#FFAA44' }}></div>
              <span style={{ position: 'absolute', right: '5px', top: '0', fontSize: '10px', color: '#FFFFFF', lineHeight: '12px' }}>{card.speed}/10</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontSize: '12px' }}>
            <span style={{ width: '60px', fontWeight: 'bold', color: '#FFFFFF' }}>❤️ صحة:</span>
            <div style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', height: '12px', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '6px', width: `${card.health}%`, backgroundColor: '#44FF88' }}></div>
              <span style={{ position: 'absolute', right: '5px', top: '0', fontSize: '10px', color: '#FFFFFF', lineHeight: '12px' }}>{card.health}/100</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '8px 12px', borderRadius: '10px', marginTop: '10px' }}>
          <span style={{ fontWeight: 'bold', color: '#FFFFFF' }}>التكلفة:</span>
          <span style={{ backgroundColor: '#FFD700', color: '#000000', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px' }}>
            ✨ {calculateCardCost(card)}
          </span>
        </div>
      </div>
    </div>
  );
};

const calculateCardCost = (card: Card): number => {
  const baseCost = 3;
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    epic: 2,
    legendary: 3
  };
  return Math.floor(baseCost * (rarityMultiplier[card.rarity as keyof typeof rarityMultiplier] || 1) * card.level);
};

export default CardView;
