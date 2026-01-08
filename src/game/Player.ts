import { Player, Card, PlayerSide } from '../types';
import { GAME_CONSTANTS } from '../constants';

export function createPlayer(name: string, side: PlayerSide): Player {
  return {
    id: `${side}_${Date.now()}`,
    name,
    side,
    health: GAME_CONSTANTS.STARTING_HEALTH,
    maxHealth: GAME_CONSTANTS.STARTING_HEALTH,
    mana: GAME_CONSTANTS.STARTING_MANA,
    maxMana: GAME_CONSTANTS.MAX_MANA,
    hand: [],
    deck: [],
    discardPile: [],
    score: 0,
    isActive: side === 'player1'
  };
}

export function addCardToHand(player: Player, card: Card): boolean {
  if (player.hand.length >= GAME_CONSTANTS.MAX_HAND_SIZE) {
    return false;
  }
  
  player.hand.push(card);
  return true;
}

export function removeCardFromHand(player: Player, cardId: string): Card | null {
  const index = player.hand.findIndex(card => card.id === cardId);
  
  if (index === -1) {
    return null;
  }
  
  const [removedCard] = player.hand.splice(index, 1);
  return removedCard;
}

export function drawCard(player: Player): Card | null {
  if (player.deck.length === 0) {
    return null;
  }
  
  const drawnCard = player.deck.shift()!;
  
  if (addCardToHand(player, drawnCard)) {
    return drawnCard;
  }
  
  return null;
}

export function drawCards(player: Player, count: number): Card[] {
  const drawnCards: Card[] = [];
  
  for (let i = 0; i < count; i++) {
    const card = drawCard(player);
    if (card) {
      drawnCards.push(card);
    }
  }
  
  return drawnCards;
}

export function takeDamage(player: Player, damage: number): boolean {
  player.health = Math.max(0, player.health - damage);
  return player.health > 0;
}

export function healPlayer(player: Player, amount: number): void {
  player.health = Math.min(player.maxHealth, player.health + amount);
    }
