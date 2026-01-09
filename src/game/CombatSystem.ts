import { Card, CombatResult } from '../types';

export function calculateDamage(attacker: Card, defender: Card): CombatResult {
  const baseDamage = attacker.attack;
  const defenseReduction = defender.defense * 0.5;
  const speedBonus = attacker.speed * 0.1;
  
  let damage = Math.max(1, baseDamage - defenseReduction);
  damage *= (1 + speedBonus);
  
  const criticalChance = attacker.speed * 0.05;
  const isCritical = Math.random() < criticalChance;
  
  if (isCritical) {
    damage *= 1.5;
  }
  
  let abilitiesUsed: string[] = [];
  damage = Math.round(damage);
  
  return {
    attacker,
    defender,
    damage,
    isCritical,
    abilitiesUsed
  };
}

export function calculateDamageWithAdvantage(attacker: Card, _defender: Card, _distance: number): CombatResult {
  const result = calculateDamage(attacker, _defender);
  result.damage = Math.round(result.damage * 1.0);
  return result;
}

export function canAttack(_attacker: Card, _defender: Card, distance: number): boolean {
  const maxRange = getAttackRange(_attacker);
  return distance <= maxRange;
}

export function getAttackRange(card: Card): number {
  switch (card.type) {
    case 'ranged':
      return 3;
    default:
      return 1;
  }
}

export function getAttackSpeed(card: Card): number {
  const baseSpeed = 1.0;
  const speedBonus = card.speed * 0.1;
  return Math.max(0.5, baseSpeed - speedBonus);
}

export function calculateHealing(healer: Card, target: Card): number {
  const baseHealing = healer.defense * 0.8;
  const speedBonus = healer.speed * 0.05;
  
  let healing = baseHealing * (1 + speedBonus);
  healing = Math.round(healing);
  
  const maxHealing = target.health * 0.3;
  return Math.min(healing, maxHealing);
}

export function calculateSpecialDamage(
  attacker: Card,
  defender: Card,
  abilityMultiplier: number
): number {
  const baseDamage = attacker.attack * abilityMultiplier;
  const defenseReduction = defender.defense * 0.3;
  
  let damage = Math.max(1, baseDamage - defenseReduction);
  
  const criticalChance = attacker.speed * 0.1;
  const isCritical = Math.random() < criticalChance;
  
  if (isCritical) {
    damage *= 2;
  }
  
  return Math.round(damage);
}
