import { GameState, Player, GamePhase } from '../types';
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

  // إدارة الأدوار
  startGame(players: Player[]): void {
    this.currentTurn = 1;
    this.currentPlayerIndex = 0;
    this.phase = 'draw';
    
    // تفعيل اللاعب الأول
    players.forEach((player, index) => {
      player.isActive = index === this.currentPlayerIndex;
    });
  }

  nextTurn(players: Player[]): boolean {
    if (this.isGameOver()) {
      return false;
    }

    // إنهاء دور اللاعب الحالي
    players[this.currentPlayerIndex].isActive = false;

    // التبديل إلى اللاعب التالي
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % players.length;
    
    // بدء دور جديد
    players[this.currentPlayerIndex].isActive = true;
    this.currentTurn++;
    this.phase = 'draw';

    return true;
  }

  // إدارة المراحل
  setPhase(phase: GamePhase): void {
    this.phase = phase;
  }

  getCurrentPhase(): GamePhase {
    return this.phase;
  }

  nextPhase(): boolean {
    const phases: GamePhase[] = ['draw', 'play', 'attack', 'end'];
    const currentIndex = phases.indexOf(this.phase);
    
    if (currentIndex === -1 || currentIndex === phases.length - 1) {
      return false;
    }

    this.phase = phases[currentIndex + 1];
    return true;
  }

  // معلومات الدور
  getCurrentTurn(): number {
    return this.currentTurn;
  }

  getCurrentPlayerIndex(): number {
    return this.currentPlayerIndex;
  }

  getCurrentPlayer(players: Player[]): Player {
    return players[this.currentPlayerIndex];
  }

  getOpponentPlayer(players: Player[]): Player {
    const opponentIndex = (this.currentPlayerIndex + 1) % players.length;
    return players[opponentIndex];
  }

  isPlayerTurn(playerIndex: number): boolean {
    return this.currentPlayerIndex === playerIndex;
  }

  // التحقق من نهاية اللعبة
  isGameOver(): boolean {
    return this.currentTurn > this.maxTurns;
  }

  getRemainingTurns(): number {
    return Math.max(0, this.maxTurns - this.currentTurn);
  }

  getMaxTurns(): number {
    return this.maxTurns;
  }

  setMaxTurns(maxTurns: number): void {
    this.maxTurns = maxTurns;
  }

  // تسريع أو إبطاء اللعبة
  skipToPhase(phase: GamePhase): void {
    this.phase = phase;
  }

  skipToTurn(turn: number, players: Player[]): void {
    if (turn < 1 || turn > this.maxTurns) {
      throw new Error('رقم الدور غير صالح');
    }

    this.currentTurn = turn;
    // اللاعب الأول يبدأ في الأدوار الفردية، اللاعب الثاني في الأدوار الزوجية
    this.currentPlayerIndex = (turn - 1) % players.length;
    
    players.forEach((player, index) => {
      player.isActive = index === this.currentPlayerIndex;
    });
    
    this.phase = 'draw';
  }

  // إعادة تعيين المدير
  reset(): void {
    this.currentTurn = 1;
    this.currentPlayerIndex = 0;
    this.phase = 'draw';
  }

  // الحالة الحالية
  getState(): {
    currentTurn: number;
    currentPlayerIndex: number;
    phase: GamePhase;
    maxTurns: number;
    isGameOver: boolean;
    remainingTurns: number;
  } {
    return {
      currentTurn: this.currentTurn,
      currentPlayerIndex: this.currentPlayerIndex,
      phase: this.phase,
      maxTurns: this.maxTurns,
      isGameOver: this.isGameOver(),
      remainingTurns: this.getRemainingTurns()
    };
  }

  // نسخة نصية للحالة
  toString(): string {
    const state = this.getState();
    return `
      الدور الحالي: ${state.currentTurn}/${state.maxTurns}
      اللاعب النشط: ${state.currentPlayerIndex + 1}
      المرحلة: ${this.getPhaseName(state.phase)}
      الأدوار المتبقية: ${state.remainingTurns}
      انتهت اللعبة: ${state.isGameOver ? 'نعم' : 'لا'}
    `.trim();
  }

  private getPhaseName(phase: GamePhase): string {
    const phaseNames: Record<GamePhase, string> = {
      draw: 'سحب البطاقات',
      play: 'لعب البطاقات',
      attack: 'هجوم',
      end: 'إنهاء الدور'
    };
    return phaseNames[phase] || phase;
  }

  // أحداث الدور
  onTurnStart(players: Player[]): void {
    const currentPlayer = this.getCurrentPlayer(players);
    
    // استعادة المانا
    const manaToRestore = GAME_CONSTANTS.MANA_PER_TURN;
    currentPlayer.mana = Math.min(
      currentPlayer.maxMana,
      currentPlayer.mana + manaToRestore
    );
    
    // سحب بطاقة
    // (سيتم تنفيذ السحب في مكان آخر)
  }

  onTurnEnd(players: Player[]): void {
    const currentPlayer = this.getCurrentPlayer(players);
    
    // تحديث تبريد قدرات البطاقات
    // (سيتم تنفيذه في مكان آخر)
  }

  onPhaseStart(phase: GamePhase): void {
    // يمكن إضافة منطق إضافي هنا عند بدء مرحلة
    switch (phase) {
      case 'draw':
        console.log('بدأت مرحلة سحب البطاقات');
        break;
      case 'play':
        console.log('بدأت مرحلة لعب البطاقات');
        break;
      case 'attack':
        console.log('بدأت مرحلة الهجوم');
        break;
      case 'end':
        console.log('بدأت مرحلة إنهاء الدور');
        break;
    }
  }

  onPhaseEnd(phase: GamePhase): void {
    // يمكن إضافة منطق إضافي هنا عند انتهاء مرحلة
    switch (phase) {
      case 'draw':
        console.log('انتهت مرحلة سحب البطاقات');
        break;
      case 'play':
        console.log('انتهت مرحلة لعب البطاقات');
        break;
      case 'attack':
        console.log('انتهت مرحلة الهجوم');
        break;
      case 'end':
        console.log('انتهت مرحلة إنهاء الدور');
        break;
    }
  }
  } 
