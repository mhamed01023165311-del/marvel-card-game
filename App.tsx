import React, { useState, useRef } from 'react';
import { GamePhase, Card, HexCellData, PlayerId, AnimationStyle } from './types';
import { INITIAL_CARDS, OPPONENT_POOL, generateHexGrid } from './constants';
import { getBattleIntro, getTacticalAdvice } from './services/geminiService';
import { Sword, Shield, LayoutGrid, ArrowUp, AlertCircle, RefreshCw, Layers, Lock } from 'lucide-react';

// --- Components ---

// 1. 3D Character Token (The "Hologram" that stands up)
const CharacterToken: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <div className={`character-standing animate-spawn-character`}>
      {/* Base Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/20 blur-md rounded-full transform scale-y-50"></div>
      
      {/* The Character Cutout */}
      <img 
        src={card.image} 
        alt={card.name} 
        className="animate-float-char"
      />
      
      {/* Stats Floating above head */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded-full border border-white/20 shadow-lg transform translate-z-10">
          <Sword size={10} className="text-red-400" />
          <span className="text-xs font-bold">{card.power}</span>
      </div>
    </div>
  );
};

interface HexCellProps {
  data: HexCellData & { zone: string };
  onClick: () => void;
  cardDetails?: Card;
  isActive: boolean;
  isValidTarget: boolean; // Can the player drop here?
}

// 2. Honeycomb Cell (3D Platform)
const HexCell: React.FC<HexCellProps> = ({
  data,
  onClick,
  cardDetails,
  isActive,
  isValidTarget
}) => {
  const hexRadius = 52; // Slightly smaller to have gaps
  const hexWidth = Math.sqrt(3) * hexRadius;
  const hexHeight = 2 * hexRadius;
  
  // Honeycomb Offset Logic
  const x = (hexWidth * data.q) + (hexWidth/2 * data.r);
  const y = (hexHeight * 0.75 * data.r);

  const isPlayerZone = data.zone === 'PLAYER';
  const zoneClass = isPlayerZone ? 'zone-player' : 'zone-opponent';

  // Determine border/glow style
  let activeStyle = '';
  if (isActive) {
      activeStyle = 'shadow-[0_0_20px_rgba(234,179,8,0.6)] border-yellow-400 bg-yellow-400/20 z-10 scale-105';
  } else if (isValidTarget) {
      activeStyle = 'shadow-[0_0_10px_rgba(59,130,246,0.4)] border-blue-400 cursor-pointer hover:bg-blue-500/20';
  }

  return (
    <div
      className={`hex-cell-3d ${zoneClass}`}
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10 + data.r 
      }}
      onClick={onClick}
    >
      {/* The 3D Character */}
      {cardDetails && <CharacterToken card={cardDetails} />}

      {/* The Hex Platform Content */}
      <div className={`hex-content transition-all duration-300 ${activeStyle}`}>
          {/* Zone Marker Icon */}
          {!cardDetails && !isPlayerZone && (
             <Lock size={16} className="text-red-900/40" />
          )}
          
          {/* Active Highlight Ring */}
          {isValidTarget && !cardDetails && (
              <div className="absolute inset-2 border border-blue-400/50 rounded-full animate-pulse opacity-50"></div>
          )}
      </div>
    </div>
  );
};

interface CardComponentProps {
  card: Card;
  isSelected: boolean;
  onClick: () => void;
}

// 3. Player Hand Card
const CardComponent: React.FC<CardComponentProps> = ({
  card,
  isSelected,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative w-28 h-44 cursor-pointer transition-all duration-300 ease-out group perspective-arena
        ${isSelected ? '-translate-y-16 scale-110 z-50' : 'hover:-translate-y-6 hover:scale-105 hover:z-20'}
      `}
    >
      <div className={`
        w-full h-full rounded-xl overflow-hidden relative shadow-2xl transition-all duration-300 bg-black border
        ${isSelected ? 'shadow-[0_0_25px_rgba(250,204,21,0.6)] border-yellow-400 transform rotate-x-0' : 'shadow-black border-gray-700 transform rotate-x-6 opacity-90'}
      `}>
        {/* Full Image */}
        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
        
        {/* Info */}
        <div className="absolute bottom-0 w-full p-2 text-center">
            <div className="text-xs text-yellow-500 font-bold uppercase mb-0.5">{card.type}</div>
            <div className="text-sm font-black text-white leading-none font-sans" dir="ltr">{card.name}</div>
            <div className="flex justify-center gap-3 mt-2">
                 <span className="text-red-400 font-bold text-xs flex items-center"><Sword size={10} className="mr-1"/>{card.power}</span>
                 <span className="text-blue-400 font-bold text-xs flex items-center"><Shield size={10} className="mr-1"/>{card.health}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.MENU);
  const [collection, setCollection] = useState<Card[]>(INITIAL_CARDS);
  const [opponentCollection, setOpponentCollection] = useState<Card[]>(OPPONENT_POOL);

  const [deck, setDeck] = useState<Card[]>([]);
  const [enemyDeck, setEnemyDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [grid, setGrid] = useState<any[]>([]);
  const [turn, setTurn] = useState<PlayerId>(PlayerId.PLAYER);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [battleMessage, setBattleMessage] = useState<string>("جاري تجهيز الساحة...");
  const [scores, setScores] = useState({ player: 0, opponent: 0 });

  const initBattle = async () => {
    // Generate Grid with Zones
    setGrid(generateHexGrid(2)); 
    
    const selectedDeck = deck.length > 0 ? deck : collection.slice(0, 4);
    const enemies = [...opponentCollection].sort(() => 0.5 - Math.random()).slice(0, 4);
    setEnemyDeck(enemies);
    setHand([...selectedDeck]);
    setScores({ player: 0, opponent: 0 });
    setTurn(PlayerId.PLAYER);
    setSelectedCardId(null);
    setPhase(GamePhase.BATTLE);
    setBattleMessage("المعركة بدأت! دافع عن منطقتك الزرقاء.");
  };

  const handleHexClick = async (cellIndex: number) => {
    if (turn !== PlayerId.PLAYER || !selectedCardId) return;
    const cell = grid[cellIndex];
    
    // VALIDATION: Can only place in Player Zone (r >= 0) and empty cell
    if (cell.occupant) return;
    if (cell.zone !== 'PLAYER') {
        setBattleMessage("لا يمكنك اللعب في منطقة الخصم!");
        return;
    }

    const cardPlayed = hand.find(c => c.id === selectedCardId);
    if (!cardPlayed) return;

    setBattleMessage(`تم نشر ${cardPlayed.name}!`);

    const newGrid = [...grid];
    newGrid[cellIndex] = { ...cell, occupant: PlayerId.PLAYER, cardId: cardPlayed.id };
    setGrid(newGrid);

    setHand(prev => prev.filter(c => c.id !== selectedCardId));
    setSelectedCardId(null);
    setScores(s => ({ ...s, player: s.player + cardPlayed.power }));

    setTurn(PlayerId.OPPONENT);

    setTimeout(() => {
        playEnemyTurn(newGrid, enemyDeck);
    }, 1500);
  };

  const playEnemyTurn = (currentGrid: any[], enemies: Card[]) => {
    // AI can only play in OPPONENT zone
    const validCells = currentGrid.map((c, i) => ({...c, index: i}))
                                  .filter(c => !c.occupant && c.zone === 'OPPONENT');

    if (validCells.length === 0 || enemies.length === 0) {
        checkEndGame(currentGrid);
        return;
    }

    const target = validCells[Math.floor(Math.random() * validCells.length)];
    const enemyCard = enemies[0];
    const remainingEnemies = enemies.slice(1);
    setEnemyDeck(remainingEnemies);

    const newGrid = [...currentGrid];
    newGrid[target.index] = { ...target, occupant: PlayerId.OPPONENT, cardId: enemyCard.id };
    setGrid(newGrid);
    setScores(s => ({ ...s, opponent: s.opponent + enemyCard.power }));

    setBattleMessage(`الخصم يلعب ${enemyCard.name}!`);

    setTurn(PlayerId.PLAYER);

    if (hand.length === 0 && remainingEnemies.length === 0) {
        checkEndGame(newGrid); 
    } else if (validCells.length <= 1) {
        checkEndGame(newGrid);
    }
  };

  const checkEndGame = (finalGrid: any[]) => {
    let pScore = 0;
    let oScore = 0;

    finalGrid.forEach(cell => {
        const c = [...collection, ...opponentCollection].find(card => card.id === cell.cardId);
        if (c) {
            if (cell.occupant === PlayerId.PLAYER) pScore += c.power;
            else if (cell.occupant === PlayerId.OPPONENT) oScore += c.power;
        }
    });

    if (pScore > oScore) {
        setPhase(GamePhase.VICTORY_LOOT);
    } else {
        setPhase(GamePhase.DEFEAT);
    }
  };

  const stealCard = (card: Card) => {
    setCollection([...collection, card]);
    setOpponentCollection(prev => prev.filter(c => c.id !== card.id));
    setPhase(GamePhase.MENU);
  };

  // --- Views ---

  if (phase === GamePhase.MENU) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020205] bg-[url('https://wallpapers.com/images/hd/abstract-blue-and-red-hexagon-background-3d-rendering-g5q5q7.jpg')] bg-cover bg-center font-sans">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        <div className="z-10 text-center space-y-8 animate-float-char">
            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-600 via-red-500 to-yellow-500 drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] transform -skew-x-12">
                هيكس كلاش
            </h1>
            <p className="text-gray-300 text-2xl font-light tracking-widest border-y border-gray-600 py-2">ساحة الأبطال الخارقين</p>
            <div className="flex gap-6 justify-center mt-12 flex-row-reverse">
                <button
                    onClick={() => setPhase(GamePhase.DECK_BUILDING)}
                    className="group relative px-10 py-4 bg-transparent overflow-hidden rounded-xl transition-all border border-red-500 hover:border-yellow-400"
                >
                    <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-[250ms] ease-out group-hover:w-full opacity-20"></div>
                    <span className="relative flex items-center text-white font-bold text-xl"><LayoutGrid className="ml-2"/> تشكيل الفريق</span>
                </button>
                <button
                     onClick={() => {
                        setDeck(collection.slice(0, 4));
                        initBattle();
                     }}
                     className="group relative px-10 py-4 bg-gradient-to-r from-red-700 to-red-500 overflow-hidden rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                >
                    <span className="relative flex items-center text-white font-bold text-xl"><Sword className="ml-2"/> معركة سريعة</span>
                </button>
            </div>
        </div>
      </div>
    );
  }

  if (phase === GamePhase.DECK_BUILDING) {
    return (
        <div className="h-screen flex flex-col bg-[#050510] p-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4 flex-row-reverse">
                <h2 className="text-4xl font-bold text-white">اختر مقاتليك</h2>
                <div className="text-2xl font-mono text-gray-300">الفريق: <span className={deck.length === 4 ? "text-green-400" : "text-yellow-500"}>{deck.length}/4</span></div>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4 no-scrollbar">
                {collection.map(card => {
                    const isSelected = deck.find(d => d.id === card.id);
                    return (
                        <div
                            key={card.id}
                            onClick={() => {
                                if (isSelected) {
                                    setDeck(deck.filter(d => d.id !== card.id));
                                } else {
                                    if (deck.length < 4) setDeck([...deck, card]);
                                }
                            }}
                            className={`group relative h-72 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-green-500 scale-95 grayscale-0' : 'hover:scale-105 ring-2 ring-transparent grayscale opacity-80 hover:opacity-100 hover:grayscale-0'}`}
                        >
                             <img src={card.image} className="w-full h-full object-cover"/>
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                             
                             <div className="absolute bottom-0 w-full p-4 text-right">
                                <div className="text-sm font-bold text-yellow-500 mb-1">{card.type}</div>
                                <div className="text-2xl font-black text-white font-sans" dir="ltr">{card.name}</div>
                             </div>
                             
                             {isSelected && <div className="absolute top-3 left-3 bg-green-500 text-black rounded-full p-2 shadow-lg"><Sword size={20}/></div>}
                        </div>
                    )
                })}
            </div>

            <div className="mt-6 flex justify-center">
                 <button
                    disabled={deck.length !== 4}
                    onClick={initBattle}
                    className="px-16 py-4 bg-gradient-to-r from-blue-600 to-blue-800 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold rounded-full text-2xl shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform"
                 >
                    <ArrowUp /> ابدأ المعركة
                 </button>
            </div>
        </div>
    )
  }

  if (phase === GamePhase.BATTLE) {
    return (
        <div className="h-screen w-full bg-[#020205] flex flex-col relative overflow-hidden font-sans">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020205] to-[#020205] pointer-events-none"></div>

            {/* HUD Top - Reversed layout for Arabic */}
            <div className="absolute top-0 w-full p-6 flex justify-between items-start z-30 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-blue-500/30 shadow-2xl flex flex-col items-center min-w-[120px]">
                    <h3 className="text-blue-400 font-bold text-sm tracking-widest mb-1">نقاطك</h3>
                    <div className="text-4xl font-black text-white leading-none">{scores.player}</div>
                </div>

                <div className="mt-2">
                     <div className="bg-black/60 border border-white/10 text-white px-6 py-2 rounded-full text-center text-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md">
                        {battleMessage}
                     </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-red-500/30 shadow-2xl flex flex-col items-center min-w-[120px]">
                    <h3 className="text-red-400 font-bold text-sm tracking-widest mb-1">الخصم</h3>
                    <div className="text-4xl font-black text-white leading-none">{scores.opponent}</div>
                </div>
            </div>

            {/* Arena Center (3D Perspective) */}
            <div className="flex-1 relative flex items-center justify-center perspective-arena">
                <div className="arena-platform flex items-center justify-center big-hex-border">
                    {/* The Grid */}
                    {grid.map((cell, idx) => {
                        const cardDetails = cell.cardId
                            ? [...collection, ...opponentCollection].find(c => c.id === cell.cardId)
                            : undefined;
                        
                        // Check if this cell is a valid drop target for the player
                        const isPlayerZone = cell.zone === 'PLAYER';
                        const isValidTarget = turn === PlayerId.PLAYER && !!selectedCardId && isPlayerZone && !cell.occupant;

                        return (
                            <HexCell
                                key={cell.id}
                                data={cell}
                                cardDetails={cardDetails}
                                isActive={turn === PlayerId.PLAYER && !!selectedCardId && isPlayerZone && !cell.occupant}
                                isValidTarget={isValidTarget}
                                onClick={() => handleHexClick(idx)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 w-full h-[300px] pointer-events-none z-40">
                <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-[#020205]/90 to-transparent"></div>
                
                <div className="absolute bottom-0 w-full h-full flex items-end justify-center px-8 pb-8 pointer-events-auto gap-4">
                    
                    {/* Hand (Center) */}
                    <div className="flex gap-2 items-end justify-center mb-2 perspective-arena flex-1">
                        {hand.length === 0 && turn === PlayerId.PLAYER && (
                            <div className="text-white text-xl animate-pulse mb-16 font-bold">في انتظار الخصم...</div>
                        )}
                        {hand.map(card => (
                            <CardComponent
                                key={card.id}
                                card={card}
                                isSelected={selectedCardId === card.id}
                                onClick={() => {
                                    if (turn === PlayerId.PLAYER) {
                                        setSelectedCardId(selectedCardId === card.id ? null : card.id);
                                    }
                                }}
                            />
                        ))}
                    </div>

                    {/* Deck Indicator */}
                     <div className="hidden md:flex flex-col items-center mb-6 opacity-60">
                        <div className="w-16 h-20 bg-gray-800 rounded border border-gray-600 flex items-center justify-center">
                            <span className="font-bold text-white">{4 - hand.length}</span>
                        </div>
                        <span className="text-xs mt-1 text-gray-400">الباقي</span>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // Victory/Defeat screens kept simple
  if (phase === GamePhase.VICTORY_LOOT) {
      return (
          <div className="h-screen w-full bg-[#050510] flex flex-col items-center justify-center p-8 space-y-12">
              <div className="text-center space-y-4 animate-bounce-small">
                  <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">!انتصار</h1>
                  <p className="text-2xl text-gray-300">لقد سحقت خصمك. اختر مكافأتك الآن.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                  {enemyDeck.length > 0 ? enemyDeck.map(card => (
                       <div key={card.id} onClick={() => stealCard(card)} className="cursor-pointer group relative perspective-arena">
                           <img src={card.image} className="w-56 h-80 object-cover rounded-2xl border-4 border-yellow-500 relative z-10 transform transition-all duration-500 group-hover:rotate-y-12 group-hover:scale-110 shadow-2xl" />
                           <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 w-full text-center">
                               <span className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold shadow-lg text-lg">استحوذ على {card.name}</span>
                           </div>
                       </div>
                  )) : (
                      <div className="text-gray-500 font-mono text-xl">لا يوجد غنائم متبقية.</div>
                  )}
              </div>
          </div>
      )
  }

  if (phase === GamePhase.DEFEAT) {
      return (
          <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white space-y-8">
              <AlertCircle size={80} className="text-red-600" />
              <h1 className="text-8xl font-bold text-red-600 tracking-tighter drop-shadow-lg">هزيمة</h1>
              <button onClick={() => setPhase(GamePhase.MENU)} className="px-10 py-5 bg-gray-900 border border-gray-700 rounded-full text-xl font-bold">العودة للقاعدة</button>
          </div>
      )
  }

  return null;
}
