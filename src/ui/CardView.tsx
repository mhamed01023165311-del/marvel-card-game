import React from 'react';
import { Card, CardType, Rarity } from '../types';
import { GAME_CONSTANTS, getTypeColor, getRarityColor } from '../constants';

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

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
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
    flexDirection: 'column' as const,
    cursor: isPlayable ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    transform: isSelected ? 'translateY(-10px) scale(1.05)' : 'none',
    boxShadow: isSelected
      ? `0 0 25px ${getRarityColor(card.rarity)}`
      : '0 5px 15px rgba(0, 0, 0, 0.3)',
    position: 'relative' as const,
    overflow: 'hidden',
    fontFamily: "'Cairo', sans-serif",
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.2))',
    borderRadius: '11px',
  };

  return (
    <div
      style={cardStyle}
      onClick={handleClick}
      title={card.description}
    >
      {/* زر الإغلاق (فقط إذا كان هناك onClose) */}
      {onClose && (
        <button
          onClick={handleClose}
          style={styles.closeButton}
          aria-label="إغلاق"
        >
          ✕
        </button>
      )}

      {/* الخلفية المتدرجة */}
      <div style={overlayStyle}></div>

      {/* رأس البطاقة */}
      <div style={styles.header}>
        <div style={styles.nameContainer}>
          <h3 style={styles.name}>{card.name}</h3>
          <div style={styles.levelBadge}>Lvl {card.level}</div>
        </div>
        
        <div style={styles.typeRarity}>
          <span style={styles.type}>{typeNames[card.type]}</span>
          <span style={{ ...styles.rarity, color: getRarityColor(card.rarity) }}>
            {rarityNames[card.rarity]}
          </span>
        </div>
      </div>

      {/* صورة البطاقة */}
      <div style={styles.imageContainer}>
        <div style={styles.imagePlaceholder}>
          <div style={styles.heroIcon}>🦸</div>
          <div style={styles.imageText}>{card.name}</div>
        </div>
      </div>

      {/* إحصائيات البطاقة */}
      <div style={styles.stats}>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>⚔️ هجوم:</span>
          <div style={styles.statBarContainer}>
            <div 
              style={{
                ...styles.statBar,
                width: `${card.attack * 10}%`,
                backgroundColor: '#FF4444'
              }}
            ></div>
            <span style={styles.statValue}>{card.attack}/10</span>
          </div>
        </div>

        <div style={styles.statRow}>
          <span style={styles.statLabel}>🛡️ دفاع:</span>
          <div style={styles.statBarContainer}>
            <div 
              style={{
                ...styles.statBar,
                width: `${card.defense * 10}%`,
                backgroundColor: '#4488FF'
              }}
            ></div>
            <span style={styles.statValue}>{card.defense}/10</span>
          </div>
        </div>

        <div style={styles.statRow}>
          <span style={styles.statLabel}>⚡ سرعة:</span>
          <div style={styles.statBarContainer}>
            <div 
              style={{
                ...styles.statBar,
                width: `${card.speed * 10}%`,
                backgroundColor: '#FFAA44'
              }}
            ></div>
            <span style={styles.statValue}>{card.speed}/10</span>
          </div>
        </div>

        <div style={styles.statRow}>
          <span style={styles.statLabel}>❤️ صحة:</span>
          <div style={styles.statBarContainer}>
            <div 
              style={{
                ...styles.statBar,
                width: `${card.health}%`,
                backgroundColor: '#44FF88'
              }}
            ></div>
            <span style={styles.statValue}>{card.health}/100</span>
          </div>
        </div>
      </div>

      {/* القدرات الخاصة */}
      {card.abilities.length > 0 && (
        <div style={styles.abilities}>
          <h4 style={styles.abilitiesTitle}>القدرات:</h4>
          {card.abilities.map((ability, index) => (
            <div key={index} style={styles.ability}>
              <span style={styles.abilityName}>{ability.name}:</span>
              <span style={styles.abilityDescription}>{ability.description}</span>
              {ability.currentCooldown > 0 && (
                <span style={styles.cooldown}>⏳ {ability.currentCooldown}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* التكلفة */}
      <div style={styles.costContainer}>
        <div style={styles.cost}>
          <span style={styles.costLabel}>التكلفة:</span>
          <span style={styles.costValue}>✨ {calculateCardCost(card)}</span>
        </div>
      </div>

      {/* مؤشر اللعب إذا كان غير قابل للعب */}
      {!isPlayable && (
        <div style={styles.notPlayableOverlay}>
          <span>غير قابل للعب</span>
        </div>
      )}
    </div>
  );
};

// وظيفة مساعدة لحساب تكلفة البطاقة
const calculateCardCost = (card: Card): number => {
  const baseCost = 3;
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    epic: 2,
    legendary: 3
  };
  return Math.floor(baseCost * (rarityMultiplier[card.rarity] || 1) * card.level);
};

const styles = {
  closeButton: {
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    background: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    color: 'white',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },

  header: {
    marginBottom: '10px',
    zIndex: 2,
  },

  nameContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },

  name: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  },

  levelBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#FFD700',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
  },

  typeRarity: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },

  type: {
    color: '#FFFFFF',
    fontWeight: 'bold' as const,
  },

  rarity: {
    fontWeight: 'bold' as const,
    textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
  },

  imageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 2,
  },

  imagePlaceholder: {
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  heroIcon: {
    fontSize: '48px',
    marginBottom: '5px',
  },

  imageText: {
    fontSize: '14px',
    fontWeight: 'bold' as const,
  },

  stats: {
    marginBottom: '10px',
    zIndex: 2,
  },

  statRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
    fontSize: '12px',
  },

  statLabel: {
    width: '60px',
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },

  statBarContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: '12px',
    borderRadius: '6px',
    position: 'relative' as const,
    overflow: 'hidden',
  },

  statBar: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.5s ease',
  },

  statValue: {
    position: 'absolute' as const,
    right: '5px',
    top: '0',
    fontSize: '10px',
    color: '#FFFFFF',
    lineHeight: '12px',
  },

  abilities: {
    marginBottom: '10px',
    zIndex: 2,
  },

  abilitiesTitle: {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginBottom: '5px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    paddingBottom: '2px',
  },

  ability: {
    fontSize: '11px',
    marginBottom: '3px',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column' as const,
  },

  abilityName: {
    fontWeight: 'bold' as const,
    color: '#FFD700',
  },

  abilityDescription: {
    fontSize: '10px',
    opacity: 0.9,
  },

  cooldown: {
    fontSize: '9px',
    color: '#FF9800',
    marginTop: '2px',
  },

  costContainer: {
    zIndex: 2,
  },

  cost: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '8px 12px',
    borderRadius: '10px',
  },

  costLabel: {
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },

  costValue: {
    backgroundColor: '#FFD700',
    color: '#000000',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: 'bold' as const,
    fontSize: '14px',
  },

  notPlayableOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '11px',
    zIndex: 5,
  },
};

export default CardView;
