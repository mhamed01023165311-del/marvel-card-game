import { Card, CardType, Rarity, Ability } from '../types';
import { GAME_CONSTANTS } from '../constants';

export function createCard(
  id: string,
  name: string,
  type: CardType,
  rarity: Rarity,
  stats: {
    attack: number;
    defense: number;
    speed: number;
    health: number;
  },
  abilities: Ability[] = [],
  imageUrl: string = ''
): Card {
  return {
    id,
    name,
    description: generateCardDescription(name, type),
    type,
    rarity,
    attack: Math.max(1, Math.min(10, stats.attack)),
    defense: Math.max(1, Math.min(10, stats.defense)),
    speed: Math.max(1, Math.min(10, stats.speed)),
    health: Math.max(1, Math.min(100, stats.health)),
    abilities: abilities.map(ability => ({
      ...ability,
      currentCooldown: 0
    })),
    level: 1,
    maxLevel: 5,
    imageUrl,
    color: getTypeColor(type)
  };
}

function generateCardDescription(name: string, type: CardType): string {
  const descriptions: Record<CardType, string> = {
    attack: `${name} هو مقاتل شرس يهاجم بقوة في المقدمة.`,
    defense: `${name} يحمي الحلفاء بصلابته ومقاومته العالية.`,
    ranged: `${name} يهاجم من بعيد بتقنياته وأسلحته المتطورة.`,
    mixed: `${name} يجمع بين القوة والمرونة في القتال.`
  };
  return descriptions[type] || `${name} هو بطل خارق يتمتع بقدرات مميزة.`;
}

function getTypeColor(type: CardType): string {
  const colors: Record<CardType, string> = {
    attack: GAME_CONSTANTS.COLORS.ATTACK,
    defense: GAME_CONSTANTS.COLORS.DEFENSE,
    ranged: GAME_CONSTANTS.COLORS.RANGED,
    mixed: GAME_CONSTANTS.COLORS.MIXED
  };
  return colors[type] || GAME_CONSTANTS.COLORS.MIXED;
}

export function canPlayCard(card: Card, playerMana: number): boolean {
  const cardCost = calculateCardCost(card);
  return playerMana >= cardCost;
}

export function calculateCardCost(card: Card): number {
  const baseCost = 3;
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    epic: 2,
    legendary: 3
  };
  
  return Math.floor(
    baseCost *
    (rarityMultiplier[card.rarity] || 1) *
    card.level
  );
}
