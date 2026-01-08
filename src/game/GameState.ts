import { GameState, Player, Card, Tile, GamePhase, PlayerSide } from '../types';
import { GAME_CONSTANTS } from '../constants';
import { createBoard } from './Board';
import { createPlayer } from './Player';
import { calculateDamage } from './CombatSystem';

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
      phase: 'draw' as GamePhase,
      board: createBoard(),
      turn: 1,
      maxTurns: GAME_CONSTANTS.MAX_TURNS,
      isGameOver: false,
      messages: [GAME_CONSTANTS.MESSAGES.WELCOME, GAME_CONSTANTS.MESSAGES.GAME_START]
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

  // إدارة الأدوار
  startGame(): void {
    this.state.phase = 'draw';
    this.state.messages.push('بدأت اللعبة!');
    this.notifyListeners();
  }

  nextTurn(): void {
    if (this.state.isGameOver) return;

    this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % 2;
    this.state.turn++;
    
    // استعادة المانا
    const currentPlayer = this.state.players[this.state.currentPlayerIndex];
    currentPlayer.mana = Math.min(
      currentPlayer.maxMana,
      currentPlayer.mana + GAME_CONSTANTS.MANA_PER_TURN
    );

    // سحب بطاقات جديدة
    this.drawCards(currentPlayer, GAME_CONSTANTS.DRAW_PER_TURN);

    this.state.phase = 'draw';
    this.state.messages.push(`الدور ${this.state.turn}: دور ${currentPlayer.name}`);
    
    this.checkGameEnd();
    this.notifyListeners();
  }

  // إدارة البطاقات
  selectCard(card: Card): void {
    if (this.state.phase !== 'play') return;
    
    const currentPlayer = this.state.players[this.state.currentPlayerIndex];
    if (!currentPlayer.hand.some(c => c.id === card.id)) return;
    
    this.state.selectedCard = card;
    this.state.phase = 'play';
    this.state.messages.push(`اخترت: ${card.name}`);
    
    // إبراز المربعات المتاحة
    this.highlightAvailableTiles();
    
    this.notifyListeners();
  }

  playCard(tile: Tile): void {
    if (!this.state.selectedCard || !tile.isSelectable) return;
    
    const currentPlayer = this.state.players[this.state.currentPlayerIndex];
    const cardCost = this.getCardCost(this.state.selectedCard);
    
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
    this.state.messages.push(`لَعِبت ${currentPlayer.name} بطاقة على المربع (${tile.x}, ${tile.y})`);
    
    this.clearTileHighlights();
    this.notifyListeners();
  }

  // القتال
  attack(attackerTile: Tile, defenderTile: Tile): void {
    if (this.state.phase !== 'attack') return;
    
    const attacker = this.getCardOnTile(attackerTile);
    const defender = this.getCardOnTile(defenderTile);
    
    if (!attacker || !defender) return;
    
    const result = calculateDamage(attacker, defender);
    
    // تحديث صحة المدافع
    const defenderCard = this.findCardInPlay(defender);
    if (defenderCard) {
      defenderCard.health -= result.damage;
      
      if (defenderCard.health <= 0) {
        this.removeCardFromBoard(defenderTile);
        this.state.messages.push(`تم تدمير ${defender.name}!`);
      }
    }
    
    this.state.messages.push(
      `${attacker.name} يهاجم ${defender.name} ويسبب ${result.damage} ضرر${result.isCritical ? ' (حرج!)' : ''}`
    );
    
    this.state.phase = 'end';
    this.notifyListeners();
  }

  // مساعدة
  private drawCards(player: Player, count: number): void {
    for (let i = 0; i < count && player.deck.length > 0; i++) {
      if (player.hand.length < GAME_CONSTANTS.MAX_HAND_SIZE) {
        const card = player.deck.shift()!;
        player.hand.push(card);
      }
    }
  }

  private getCardCost(card: Card): number {
    const baseCost = 3;
    const rarityMultiplier = {
      common: 1,
      rare: 1.5,
      epic: 2,
      legendary: 3
    };
    return Math.floor(baseCost * (rarityMultiplier[card.rarity] || 1) * card.level);
  }

  private highlightAvailableTiles(): void {
    this.state.board.tiles.forEach(row => {
      row.forEach(tile => {
        tile.isSelectable = !tile.occupiedBy;
        tile.isHighlighted = tile.isSelectable;
      });
    });
  }

  private clearTileHighlights(): void {
    this.state.board.tiles.forEach(row => {
      row.forEach(tile => {
        tile.isSelectable = false;
        tile.isHighlighted = false;
      });
    });
  }

  private getCardOnTile(tile: Tile): Card | null {
    if (!tile.occupiedBy) return null;
    
    const allCards = [
      ...this.state.players[0].hand,
      ...this.state.players[0].deck,
      ...this.state.players[1].hand,
      ...this.state.players[1].deck
    ];
    
    return allCards.find(card => card.id === tile.occupiedBy) || null;
  }

  private findCardInPlay(card: Card): Card | null {
    for (const player of this.state.players) {
      const found = [...player.hand, ...player.deck].find(c => c.id === card.id);
      if (found) return found;
    }
    return null;
  }

  private removeCardFromBoard(tile: Tile): void {
    tile.occupiedBy = undefined;
    tile.playerSide = undefined;
  }

  private checkGameEnd(): void {
    // تحقق من انتهاء الأدوار
    if (this.state.turn >= this.state.maxTurns) {
      this.endGame();
      return;
    }
    
    // تحقق من موت اللاعبين
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
      this.state.messages.push(`${GAME_CONSTANTS.MESSAGES.GAME_OVER} ${GAME_CONSTANTS.MESSAGES.WINNER} ${winnerPlayer.name}`);
    } else {
      this.state.messages.push(`${GAME_CONSTANTS.MESSAGES.GAME_OVER} ${GAME_CONSTANTS.MESSAGES.DRAW}`);
    }
    
    this.notifyListeners();
  }

  resetGame(): void {
    this.state = this.createInitialState();
    this.notifyListeners();
  }
}
