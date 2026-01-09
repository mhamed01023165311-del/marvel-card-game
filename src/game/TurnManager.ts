import { Player, GamePhase } from '../types';
import { GAME_CONSTANTS } from '../constants';

export class TurnManager {
  private currentTurn: number = 1;
  private currentPlayerIndex: number = 0;
  private phase: GamePhase = 'draw';
  private maxTurns: number = GAME_CONSTANTS.MAX_TURNS;

  constructor(maxTurns?: number) {
    if (maxTurns) {
      this.maxTurns = maxTurns;
    }
  }

  startGame(players: Player[]): void {
    this.currentTurn = 1;
    this.currentPlayerIndex = 0;
    this.phase = 'draw';
    
    players.forEach((player, index) => {
      player.isActive = index === this.currentPlayerIndex;
    });
  }

  nextTurn(players: Player[]): boolean {
    if (this.isGameOver()) {
      return false;
    }

    players[this.currentPlayerIndex].isActive = false;
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % players.length;
    players[this.currentPlayerIndex].isActive = true;
    
    this.currentTurn++;
    this.phase = 'draw';

    return true;
  }

  setPhase(phase: GamePhase): void {
    this.phase = phase;
  }

  getCurrentPhase(): GamePhase {
    return this.phase;
  }

  onTurnStart(players: Player[]): void {
    const currentPlayer = this.getCurrentPlayer(players); // استخدام المتغير
    const manaToRestore = GAME_CONSTANTS.MANA_PER_TURN;
    currentPlayer.mana = Math.min(
      currentPlayer.maxMana,
      currentPlayer.mana + manaToRestore
    );
  }

  getCurrentPlayer(players: Player[]): Player {
    return players[this.currentPlayerIndex];
  }

  isGameOver(): boolean {
    return this.currentTurn > this.maxTurns;
  }

  getRemainingTurns(): number {
    return Math.max(0, this.maxTurns - this.currentTurn);
  }
}
