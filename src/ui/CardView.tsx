import React from "react";
import { Card } from "../game/Card";

interface CardViewProps {
  card: Card;
  isSelected: boolean;
  onSelect: (card: Card) => void;
}

export const CardView: React.FC<CardViewProps> = ({ card, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(card)}
      style={{
        width: 80,
        height: 120,
        margin: 5,
        background: isSelected ? "cyan" : "gray",
        border: "2px solid white",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontWeight: "bold",
        transform: "rotateY(0deg)",
        boxShadow: isSelected
          ? "0 0 15px cyan, 0 0 25px rgba(0,255,255,0.5)"
          : "none",
      }}
    >
      <span>{card.name}</span>
      <span>ATK: {card.attack}</span>
      <span>DEF: {card.defense}</span>
    </div>
  );
};
