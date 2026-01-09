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

// استبدل المتغيرات الزيادة بـ _
export function calculateDamageWithAdvantage(attacker: Card, _defender: Card, _distance: number): CombatResult {
  const result = calculateDamage(attacker, _defender);
  result.damage = Math.round(result.damage * 1.0);
  return result;
}

// استبدل defender بـ _defender
export function canAttack(attacker: Card, _defender: Card, distance: number): boolean {
  const maxRange = getAttackRange(attacker);
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
