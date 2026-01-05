export enum HeroType {
  AVENGER = 'AVENGER',
  VILLAIN = 'VILLAIN',
  GUARDIAN = 'GUARDIAN',
  MUTANT = 'MUTANT',
}

export enum AnimationStyle {
  HOVER = 'HOVER',      // For flying chars like Iron Man, Thor
  HEAVY = 'HEAVY',      // For big chars like Hulk, Thanos
  AGILE = 'AGILE',      // For fast chars like Spiderman, Black Widow
  MYSTIC = 'MYSTIC',    // For magic users like Dr Strange, Scarlet Witch
}

export interface Card {
  id: string;
  name: string;
  power: number;
  health: number;
  description: string;
  image: string;
  cutoutImage?: string; // Optional: separate image for the "3D" standing figure
  type: HeroType;
  color: string;
  animation: AnimationStyle;
}

export interface HexCellData {
  id: string;
  q: number; // Axial coordinates
  r: number;
  occupant: PlayerId | null;
  cardId?: string;
}

export enum PlayerId {
  PLAYER = 'PLAYER',
  OPPONENT = 'OPPONENT',
}

export enum GamePhase {
  MENU = 'MENU',
  DECK_BUILDING = 'DECK_BUILDING',
  BATTLE = 'BATTLE',
  VICTORY_LOOT = 'VICTORY_LOOT',
  DEFEAT = 'DEFEAT',
}

export interface GameState {
  phase: GamePhase;
  playerCollection: Card[];
  playerDeck: Card[];
  opponentDeck: Card[];
  grid: HexCellData[];
  turn: PlayerId;
  playerHand: Card[];
  opponentHand: Card[]; 
  score: { player: number; opponent: number };
  battleLog: string[];
}
