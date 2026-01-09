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

  const getCardPlayability = (_card: Card): boolean => {
    return isActive;
  };

  const renderCard = (card: Card, _index: number) => {
    const isPlayable = getCardPlayability(card);
    
    return (
      <div
        key={card.id}
        style={{
          position: 'relative',
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
        <div style={{
          position: 'absolute',
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
          fontWeight: 'bold',
          border: '2px solid white',
        }}>
          {_index + 1}
        </div>
      </div>
    );
  };

  const renderEmptySlot = (index: number) => {
    return (
      <div key={`empty-${index}`} style={{
        width: '120px',
        height: '180px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '2px dashed rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🃏</div>
          <div style={{ fontSize: '12px' }}>فارغ</div>
        </div>
        <div style={{
          position: 'absolute',
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
          fontWeight: 'bold',
          border: '2px solid white',
        }}>
          {index + 1}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '15px',
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      border: '2px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
      }}>
        <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 'bold', color: playerColor }}>
          اليد ({cards.length}/{maxCards})
        </h3>
        {isActive && (
          <div style={{
            backgroundColor: 'rgba(255, 0, 0, 0.3)',
            padding: '5px 15px',
            borderRadius: '20px',
            animation: 'pulse 1.5s infinite',
          }}>
            <span style={{ color: '#FF4444', fontWeight: 'bold', fontSize: '0.9rem' }}>🔴 دورك!</span>
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '20px',
        minHeight: '200px',
      }}>
        {cards.map((card, index) => renderCard(card, index))}
        
        {showEmptySlots && cards.length < maxCards && (
          Array.from({ length: maxCards - cards.length }).map((_, index) =>
            renderEmptySlot(cards.length + index)
          )
        )}
      </div>

      {cards.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '30px',
          color: 'rgba(255, 255, 255, 0.7)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
          marginBottom: '20px',
        }}>
          <p>اليد فارغة. اسحب بطاقات جديدة!</p>
          <div style={{ fontSize: '50px', marginTop: '15px' }}>🎴</div>
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: '15px',
        borderRadius: '10px',
        marginTop: 'auto',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>إجمالي الهجوم:</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>
            {cards.reduce((sum, card) => sum + card.attack, 0)}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>إجمالي الدفاع:</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>
            {cards.reduce((sum, card) => sum + card.defense, 0)}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>البطاقات النادرة:</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>
            {cards.filter(card => card.rarity === 'rare' || card.rarity === 'epic' || card.rarity === 'legendary').length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HandView;
