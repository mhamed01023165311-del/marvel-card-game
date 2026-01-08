import { Player, Card, PlayerSide } from '../types';
import { GAME_CONSTANTS } from '../constants';
import { createCard } from './Card';

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
    isActive: side === 'player1' // اللاعب الأول يبدأ
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
    // إذا انتهت المجموعة، أعد خلط بطاقات المقبرة
    shuffleDeck(player.discardPile);
    player.deck = [...player.discardPile];
    player.discardPile = [];
  }
  
  if (player.deck.length === 0) {
    return null; // لا توجد بطاقات
  }
  
  const drawnCard = player.deck.shift()!;
  
  if (addCardToHand(player, drawnCard)) {
    return drawnCard;
  }
  
  // إذا كانت اليد ممتلئة، أضف البطاقة للمقبرة
  player.discardPile.push(drawnCard);
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

export function discardCard(player: Player, cardId: string): boolean {
  const card = removeCardFromHand(player, cardId);
  
  if (card) {
    player.discardPile.push(card);
    return true;
  }
  
  return false;
}

export function discardHand(player: Player): Card[] {
  const discardedCards = [...player.hand];
  player.discardPile.push(...player.hand);
  player.hand = [];
  return discardedCards;
}

export function playCard(player: Player, cardId: string): Card | null {
  const card = removeCardFromHand(player, cardId);
  
  if (card) {
    // حساب تكلفة البطاقة
    const cardCost = calculateCardCost(card);
    
    if (player.mana < cardCost) {
      // إعادة البطاقة لليد إذا لم يكن هناك ما يكفي من المانا
      addCardToHand(player, card);
      return null;
    }
    
    player.mana -= cardCost;
    return card;
  }
  
  return null;
}

export function takeDamage(player: Player, damage: number): boolean {
  player.health = Math.max(0, player.health - damage);
  return player.health > 0;
}

export function healPlayer(player: Player, amount: number): void {
  player.health = Math.min(player.maxHealth, player.health + amount);
}

export function restoreMana(player: Player, amount: number): void {
  player.mana = Math.min(player.maxMana, player.mana + amount);
}

export function resetPlayerTurn(player: Player): void {
  restoreMana(player, GAME_CONSTANTS.MANA_PER_TURN);
  
  // تحديث تبريد قدرات البطاقات في اليد
  player.hand = player.hand.map(card => ({
    ...card,
    abilities: card.abilities.map(ability => ({
      ...ability,
      currentCooldown: Math.max(0, ability.currentCooldown - 1)
    }))
  }));
}

export function addScore(player: Player, points: number): void {
  player.score += points;
}

export function getHandSize(player: Player): number {
  return player.hand.length;
}

export function getDeckSize(player: Player): number {
  return player.deck.length;
}

export function getDiscardSize(player: Player): number {
  return player.discardPile.length;
}

export function isHandFull(player: Player): boolean {
  return player.hand.length >= GAME_CONSTANTS.MAX_HAND_SIZE;
}

export function canPlayAnyCard(player: Player): boolean {
  return player.hand.some(card => calculateCardCost(card) <= player.mana);
}

export function getPlayableCards(player: Player): Card[] {
  return player.hand.filter(card => calculateCardCost(card) <= player.mana);
}

export function shuffleDeck(cards: Card[]): Card[] {
  const shuffled = [...cards];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

export function initializeDeck(player: Player, cards: Card[]): void {
  player.deck = shuffleDeck([...cards]);
  player.discardPile = [];
  player.hand = [];
  
  // سحب البطاقات الأولية
  drawCards(player, GAME_CONSTANTS.STARTING_HAND_SIZE);
}

export function getPlayerStats(player: Player): {
  health: number;
  mana: number;
  score: number;
  handSize: number;
  deckSize: number;
  discardSize: number;
} {
  return {
    health: player.health,
    mana: player.mana,
    score: player.score,
    handSize: getHandSize(player),
    deckSize: getDeckSize(player),
    discardSize: getDiscardSize(player)
  };
}

export function calculateCardCost(card: Card): number {
  const baseCost = 3;
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    epic: 2,
    legendary: 3
  };
  
  return Math.floor(baseCost * (rarityMultiplier[card.rarity] || 1) * card.level);
}

export function getStrongestCard(player: Player): Card | null {
  if (player.hand.length === 0) {
    return null;
  }
  
  return player.hand.reduce((strongest, current) => {
    const strongestPower = strongest.attack + strongest.defense + strongest.speed;
    const currentPower = current.attack + current.defense + current.speed;
    return currentPower > strongestPower ? current : strongest;
  });
}

export function getWeakestCard(player: Player): Card | null {
  if (player.hand.length === 0) {
    return null;
  }
  
  return player.hand.reduce((weakest, current) => {
    const weakestPower = weakest.attack + weakest.defense + weakest.speed;
    const currentPower = current.attack + current.defense + current.speed;
    return currentPower < weakestPower ? current : weakest;
  });
                                  }
