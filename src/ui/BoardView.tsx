import React, { useState } from "react";
import { Board } from "../game/Board";
import { Character } from "../game/Character";
import { Card } from "../game/Card";

interface BoardViewProps {
  board: Board;
  onPlaceCharacter: (index: number, card: Card) => void;
  selectedCard: Card | null;
}

export const BoardView: React.FC<BoardViewProps> = ({
  board,
  onPlaceCharacter,
  selectedCard,
}) => {
  const [, refresh] = useState(0);

  const handleClick = (index: number) => {
    if (!selectedCard) return;
    if (board.place(index, new Character(selectedCard))) {
      refresh(v => v + 1);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 60px)", gap: 5 }}>
      {board.cells.map((cell, idx) => (
        <div
          key={idx}
          onClick={() => handleClick(idx)}
          style={{
            width: 60,
            height: 60,
            background: cell.character ? "cyan" : cell.owner === "player" ? "lightblue" : "lightcoral",
            border: "2px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            transform: cell.character ? "perspective(300px) rotateX(15deg)" : "none",
            boxShadow: cell.character
              ? "0 0 10px cyan, 0 0 20px rgba(0,255,255,0.5)"
              : "none",
          }}
        >
          {cell.character ? cell.character.card.name : ""}
        </div>
      ))}
    </div>
  );
};
