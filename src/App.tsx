import React, { useState } from "react";
import { Board } from "./game/Board";
import { Card } from "./game/Card";
import { BoardView } from "./ui/BoardView";
import { HandView } from "./ui/HandView";

export default function App() {
  // Dummy characters for now
  const sampleHand: Card[] = [
    { id: "c1", name: "IronMan", attack: 50, defense: 30, range: 2, roles: ["attack"] },
    { id: "c2", name: "Thor", attack: 60, defense: 40, range: 1, roles: ["attack","defense"] },
    { id: "c3", name: "Hawkeye", attack: 40, defense: 20, range: 3, roles: ["ranged"] },
  ];

  const [board] = useState(new Board());
  const [hand] = useState<Card[]>(sampleHand);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  return (
    <div style={{ padding: 10, color: "white", backgroundColor: "#222", minHeight: "100vh" }}>
      <h1>Marvel Card Game</h1>
      <BoardView board={board} selectedCard={selectedCard} onPlaceCharacter={(tileIndex)=>{
        board.placeCharacter(tileIndex, selectedCard!);
      }} />
      <HandView hand={hand} selectedCard={selectedCard} onSelectCard={setSelectedCard} />
    </div>
  );
}
