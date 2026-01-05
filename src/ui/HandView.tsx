import React from "react";
import { Card } from "../game/Card";
import { CardView } from "./CardView";

interface HandViewProps {
  hand: Card[];
  selectedCard: Card | null;
  onSelectCard: (card: Card) => void;
}

export const HandView: React.FC<HandViewProps> = ({ hand, selectedCard, onSelectCard }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
      {hand.map(card => (
        <CardView
          key={card.id}
          card={card}
          isSelected={selectedCard?.id === card.id}
          onSelect={onSelectCard}
        />
      ))}
    </div>
  );
};
