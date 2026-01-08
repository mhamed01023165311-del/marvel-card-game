import { Card, CardType, Rarity, Ability } from '../types';
import { GAME_CONSTANTS, getTypeColor, getRarityColor } from '../constants';

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
  imageUrl: string,
  model3DUrl?: string
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
    model3DUrl,
    color: getTypeColor(type)
  };
}

export function generateCardDescription(name: string, type: CardType): string {
  const descriptions: Record<CardType, string> = {
    attack: `${name} هو مقاتل شرس يهاجم بقوة في المقدمة.`,
    defense: `${name} يحمي الحلفاء بصلابته ومقاومته العالية.`,
    ranged: `${name} يهاجم من بعيد بتقنياته وأسلحته المتطورة.`,
    mixed: `${name} يجمع بين القوة والمرونة في القتال.`
  };
  return descriptions[type] || `${name} هو بطل خارق يتمتع بقدرات مميزة.`;
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
  const typeMultiplier = {
    attack: 1.2,
    defense: 1.1,
    ranged: 1.3,
    mixed: 1.5
  };
  
  return Math.floor(
    baseCost *
    (rarityMultiplier[card.rarity] || 1) *
    (typeMultiplier[card.type] || 1) *
    card.level
  );
}

export function levelUpCard(card: Card): Card {
  if (card.level >= card.maxLevel) return card;
  
  const upgradedCard = { ...card };
  upgradedCard.level += 1;
  
  // تحسين الإحصائيات
  upgradedCard.attack = Math.min(10, upgradedCard.attack + 1);
  upgradedCard.defense = Math.min(10, upgradedCard.defense + 1);
  upgradedCard.speed = Math.min(10, upgradedCard.speed + 1);
  upgradedCard.health = Math.min(100, upgradedCard.health + 10);
  
  // تحسين القدرات
  upgradedCard.abilities = upgradedCard.abilities.map(ability => ({
    ...ability,
    effect: (attacker: Card, defender: Card) => ability.effect(attacker, defender) * 1.1
  }));
  
  return upgradedCard;
}

export function isCardDead(card: Card): boolean {
  return card.health <= 0;
}

export function healCard(card: Card, amount: number): Card {
  return {
    ...card,
    health: Math.min(100, card.health + amount)
  };
}

export function damageCard(card: Card, damage: number): Card {
  return {
    ...card,
    health: Math.max(0, card.health - damage)
  };
}

export function resetCardCooldowns(card: Card): Card {
  return {
    ...card,
    abilities: card.abilities.map(ability => ({
      ...ability,
      currentCooldown: Math.max(0, ability.currentCooldown - 1)
    }))
  };
}

export function canUseAbility(card: Card, abilityIndex: number): boolean {
  if (abilityIndex < 0 || abilityIndex >= card.abilities.length) return false;
  
  const ability = card.abilities[abilityIndex];
  return ability.currentCooldown === 0;
}

export function useAbility(card: Card, abilityIndex: number): Card {
  if (!canUseAbility(card, abilityIndex)) return card;
  
  const updatedCard = { ...card };
  updatedCard.abilities = [...card.abilities];
  updatedCard.abilities[abilityIndex] = {
    ...card.abilities[abilityIndex],
    currentCooldown: card.abilities[abilityIndex].cooldown
  };
  
  return updatedCard;
}

export function getCardStatsSummary(card: Card): string {
  const typeNames: Record<CardType, string> = {
    attack: 'هجومي',
    defense: 'دفاعي',
    ranged: 'رامي',
    mixed: 'مختلط'
  };
  
  const rarityNames: Record<Rarity, string> = {
    common: 'شائع',
    rare: 'نادر',
    epic: 'ملحمي',
    legendary: 'أسطوري'
  };
  
  return `
    الاسم: ${card.name}
    النوع: ${typeNames[card.type]}
    الندرة: ${rarityNames[card.rarity]}
    المستوى: ${card.level}
    الهجوم: ${card.attack}/10
    الدفاع: ${card.defense}/10
    السرعة: ${card.speed}/10
    الصحة: ${card.health}/100
    ${card.abilities.length > 0 ? `القدرات: ${card.abilities.map(a => a.name).join(', ')}` : ''}
  `.trim();
}

export function compareCards(card1: Card, card2: Card): number {
  // مقارنة حسب المستوى أولاً
  if (card1.level !== card2.level) {
    return card2.level - card1.level;
  }
  
  // ثم حسب الندرة
  const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
  if (rarityOrder[card1.rarity] !== rarityOrder[card2.rarity]) {
    return rarityOrder[card2.rarity] - rarityOrder[card1.rarity];
  }
  
  // ثم حسب القوة الإجمالية
  const power1 = card1.attack + card1.defense + card1.speed;
  const power2 = card2.attack + card2.defense + card2.speed;
  return power2 - power1;
}
