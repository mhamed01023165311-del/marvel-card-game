import { GameState, Card, PlayerSide } from '../types';
import { GAME_CONSTANTS } from '../constants';
import { createBoard } from './Board';
import { createPlayer } from './Player';

export class GameStateManager {
  private state: GameState;
  private listeners: ((state: GameState) => void)[] = [];

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    const player1 = createPlayer('اللاعب ١', 'player1');
    const player2 = createPlayer('اللاعب ٢', 'player2');
    
    return {
      players: [player1, player2],
      currentPlayerIndex: 0,
      phase: 'draw',
      board: createBoard(),
      turn: 1,
      maxTurns: GAME_CONSTANTS.MAX_TURNS,
      isGameOver: false,
      messages: ['مرحبًا في لعبة بطاقات مارفل التكتيكية!', 'بدأت اللعبة!']
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  startGame(): void {
    this.state.phase = 'draw';
    this.state.messages.push('بدأت اللعبة!');
    this.notifyListeners();
  }

  nextTurn(): void {
    if (this.state.isGameOver) return;

    this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % 2;
    this.state.turn++;
    
    const currentPlayer = this.state.players[this.state.currentPlayerIndex];
    currentPlayer.mana = Math.min(
      currentPlayer.maxMana,
      currentPlayer.mana + GAME_CONSTANTS.MANA_PER_TURN
    );

    this.state.phase = 'draw';
    this.state.messages.push(`الدور ${this.state.turn}: دور ${currentPlayer.name}`);
    
    this.checkGameEnd();
    this.notifyListeners();
  }

  selectCard(card: Card): void {
    if (this.state.phase !== 'play') return;
    
    const currentPlayer = this.state.players[this.state.currentPlayerIndex];
    if (!currentPlayer.hand.some(c => c.id === card.id)) return;
    
    this.state.selectedCard = card;
    this.state.phase = 'play';
    this.state.messages.push(`اخترت: ${card.name}`);
    
    this.notifyListeners();
  }

  // أضف دالة playCard المفقودة
  playCard(tile: any): void {
    if (!this.state.selectedCard) return;
    
    const currentPlayer = this.state.players[this.state.currentPlayerIndex];
    const cardCost = this.calculateCardCost(this.state.selectedCard);
    
    if (currentPlayer.mana < cardCost) {
      this.state.messages.push('لا تملك ما يكفي من المانا!');
      return;
    }

    // وضع البطاقة على اللوحة
    this.state.board.tiles[tile.y][tile.x].occupiedBy = this.state.selectedCard.id;
    this.state.board.tiles[tile.y][tile.x].playerSide = currentPlayer.side;
    
    // خصم المانا
    currentPlayer.mana -= cardCost;
    
    // إزالة البطاقة من اليد
    currentPlayer.hand = currentPlayer.hand.filter(c => c.id !== this.state.selectedCard!.id);
    
    this.state.selectedCard = undefined;
    this.state.phase = 'attack';
    this.state.messages.push(`لَعِبت ${currentPlayer.name} بطاقة`);
    
    this.notifyListeners();
  }

  private calculateCardCost(card: Card): number {
    const baseCost = 3;
    const rarityMultiplier = {
      common: 1,
      rare: 1.5,
      epic: 2,
      legendary: 3
    };
    return Math.floor(baseCost * (rarityMultiplier[card.rarity as keyof typeof rarityMultiplier] || 1) * card.level);
  }

  private checkGameEnd(): void {
    if (this.state.turn >= this.state.maxTurns) {
      this.endGame();
      return;
    }
    
    for (const player of this.state.players) {
      if (player.health <= 0) {
        this.endGame(player.side === 'player1' ? 'player2' : 'player1');
        return;
      }
    }
  }

  private endGame(winner?: PlayerSide): void {
    this.state.isGameOver = true;
    this.state.winner = winner;
    
    if (winner) {
      const winnerPlayer = this.state.players.find(p => p.side === winner)!;
      this.state.messages.push(`انتهت اللعبة! الفائز: ${winnerPlayer.name}`);
    } else {
      this.state.messages.push('انتهت اللعبة! تعادل!');
    }
    
    this.notifyListeners();
  }

  resetGame(): void {
    this.state = this.createInitialState();
    this.notifyListeners();
  }
      }
