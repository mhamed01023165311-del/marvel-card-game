import { Card, CombatResult } from '../types';

export function calculateDamage(attacker: Card, defender: Card): CombatResult {
  const baseDamage = attacker.attack;
  const defenseReduction = defender.defense * 0.5;
  const speedBonus = attacker.speed * 0.1;
  
  let damage = Math.max(1, baseDamage - defenseReduction);
  damage *= (1 + speedBonus);
  
  // فرصة الضربة الحرجة
  const criticalChance = attacker.speed * 0.05;
  const isCritical = Math.random() < criticalChance;
  
  if (isCritical) {
    damage *= 1.5;
  }
  
  // تطبيق القدرات الخاصة
  let abilitiesUsed: string[] = [];
  attacker.abilities.forEach(ability => {
    if (ability.currentCooldown === 0) {
      const abilityDamage = ability.effect(attacker, defender);
      damage += abilityDamage;
      abilitiesUsed.push(ability.name);
      ability.currentCooldown = ability.cooldown;
    }
  });
  
  // تقريب الضرر لعدد صحيح
  damage = Math.round(damage);
  
  return {
    attacker,
    defender,
    damage,
    isCritical,
    abilitiesUsed
  };
}

export function calculateDefense(defender: Card, incomingDamage: number): number {
  const baseReduction = defender.defense * 0.7;
  const speedBonus = defender.speed * 0.05;
  
  let damageReduction = baseReduction * (1 + speedBonus);
  damageReduction = Math.min(damageReduction, incomingDamage * 0.8);
  
  return Math.max(0, incomingDamage - damageReduction);
}

export function canAttack(attacker: Card, defender: Card, distance: number): boolean {
  const maxRange = getAttackRange(attacker);
  return distance <= maxRange;
}

export function getAttackRange(card: Card): number {
  switch (card.type) {
    case 'ranged':
      return 3;
    case 'attack':
      return 1;
    case 'defense':
      return 1;
    case 'mixed':
      return 2;
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
  
  // الحد الأقصى للعلاج
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
  
  // فرصة الحرجة مضاعفة للقدرات الخاصة
  const criticalChance = attacker.speed * 0.1;
  const isCritical = Math.random() < criticalChance;
  
  if (isCritical) {
    damage *= 2;
  }
  
  return Math.round(damage);
}

export function calculateComboDamage(
  cards: Card[],
  defender: Card
): CombatResult {
  if (cards.length === 0) {
    throw new Error('يجب تقديم بطاقة واحدة على الأقل');
  }
  
  const mainAttacker = cards[0];
  let totalDamage = 0;
  let abilitiesUsed: string[] = [];
  
  cards.forEach((card, index) => {
    const result = calculateDamage(card, defender);
    totalDamage += result.damage;
    abilitiesUsed.push(...result.abilitiesUsed);
    
    // مكافأة الكومبو
    if (index > 0) {
      const comboBonus = 0.2 * index;
      totalDamage += Math.round(result.damage * comboBonus);
    }
  });
  
  return {
    attacker: mainAttacker,
    defender,
    damage: totalDamage,
    isCritical: Math.random() < 0.3, // فرصة أعلى للحرجة في الكومبو
    abilitiesUsed
  };
}

export function getTypeAdvantage(attackerType: string, defenderType: string): number {
  const advantages: Record<string, Record<string, number>> = {
    attack: {
      defense: 0.8,    // الهجوم ضعيف ضد الدفاع
      ranged: 1.2,     // الهجوم قوي ضد الرماة
      attack: 1.0,
      mixed: 1.0
    },
    defense: {
      attack: 1.2,     // الدفاع قوي ضد الهجوم
      ranged: 0.9,     // الدفاع ضعيف قليلاً ضد الرماة
      defense: 1.0,
      mixed: 1.0
    },
    ranged: {
      defense: 1.1,    // الرماة قويون ضد الدفاع
      attack: 0.8,     // الرماة ضعفاء ضد الهجوم
      ranged: 1.0,
      mixed: 1.0
    },
    mixed: {
      attack: 1.1,
      defense: 1.1,
      ranged: 1.1,
      mixed: 1.0
    }
  };
  
  return advantages[attackerType]?.[defenderType] || 1.0;
}

export function calculateDamageWithAdvantage(
  attacker: Card,
  defender: Card,
  distance: number
): CombatResult {
  if (!canAttack(attacker, defender, distance)) {
    return {
      attacker,
      defender,
      damage: 0,
      isCritical: false,
      abilitiesUsed: []
    };
  }
  
  const typeAdvantage = getTypeAdvantage(attacker.type, defender.type);
  const result = calculateDamage(attacker, defender);
  
  result.damage = Math.round(result.damage * typeAdvantage);
  
  return result;
}

export function simulateCombat(
  attacker: Card,
  defender: Card,
  rounds: number = 3
): { attackerHealth: number; defenderHealth: number; roundsPlayed: number } {
  let attackerHealth = attacker.health;
  let defenderHealth = defender.health;
  let roundsPlayed = 0;
  
  for (let i = 0; i < rounds; i++) {
    if (attackerHealth <= 0 || defenderHealth <= 0) break;
    
    roundsPlayed++;
    
    // المهاجم يهاجم
    const attackResult = calculateDamage(attacker, defender);
    defenderHealth = Math.max(0, defenderHealth - attackResult.damage);
    
    if (defenderHealth <= 0) break;
    
    // المدافع يرد
    const counterResult = calculateDamage(defender, attacker);
    attackerHealth = Math.max(0, attackerHealth - counterResult.damage);
  }
  
  return {
    attackerHealth,
    defenderHealth,
    roundsPlayed
  };
}
