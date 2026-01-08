// أنواع البيانات الأساسية للعبة

export type CardType = 'attack' | 'defense' | 'ranged' | 'mixed';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type GamePhase = 'draw' | 'play' | 'attack' | 'end';
export type PlayerSide = 'player1' | 'player2';

export interface Card {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: Rarity;
  
  // الإحصائيات (1-10)
  attack: number;
  defense: number;
  speed: number;
  health: number;
  
  // القدرات الخاصة
  abilities: Ability[];
  level: number;
  maxLevel: number;
  
  // معلومات بصرية
  imageUrl: string;
  model3DUrl?: string;
  color: string;
}

export interface Ability {
  name: string;
  description: string;
  effect: (attacker: Card, defender: Card) => number;
  cooldown: number;
  currentCooldown: number;
}

export interface Player {
  id: string;
  name: string;
  side: PlayerSide;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  hand: Card[];
  deck: Card[];
  discardPile: Card[];
  score: number;
  isActive: boolean;
}

export interface Tile {
  id: string;
  x: number;
  y: number;
  occupiedBy?: string; // cardId
  playerSide?: PlayerSide;
  isHighlighted: boolean;
  isSelectable: boolean;
}

export interface Board {
  tiles: Tile[][];
  width: number;
  height: number;
}

export interface GameState {
  players: [Player, Player];
  currentPlayerIndex: number;
  phase: GamePhase;
  board: Board;
  selectedCard?: Card;
  selectedTile?: Tile;
  turn: number;
  maxTurns: number;
  winner?: PlayerSide;
  isGameOver: boolean;
  messages: string[];
}

export interface CombatResult {
  attacker: Card;
  defender: Card;
  damage: number;
  isCritical: boolean;
  abilitiesUsed: string[];
}
