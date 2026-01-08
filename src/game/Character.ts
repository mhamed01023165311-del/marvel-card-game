import { Card } from '../types';

export class Character {
  private card: Card;
  private position: { x: number; y: number };
  private rotation: number;
  private scale: number;
  private isActive: boolean;
  private animationState: 'idle' | 'attack' | 'defense' | 'damage' | 'death';

  constructor(card: Card, x: number, y: number) {
    this.card = card;
    this.position = { x, y };
    this.rotation = 0;
    this.scale = 1;
    this.isActive = true;
    this.animationState = 'idle';
  }

  getCard(): Card {
    return this.card;
  }

  getPosition(): { x: number; y: number } {
    return this.position;
  }

  setPosition(x: number, y: number): void {
    this.position = { x, y };
  }

  getRotation(): number {
    return this.rotation;
  }

  setRotation(rotation: number): void {
    this.rotation = rotation;
  }

  getScale(): number {
    return this.scale;
  }

  setScale(scale: number): void {
    this.scale = scale;
  }

  isAlive(): boolean {
    return this.card.health > 0 && this.isActive;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  getAnimationState(): string {
    return this.animationState;
  }

  setAnimationState(state: 'idle' | 'attack' | 'defense' | 'damage' | 'death'): void {
    this.animationState = state;
  }

  takeDamage(damage: number): void {
    this.card.health = Math.max(0, this.card.health - damage);
    if (this.card.health <= 0) {
      this.setAnimationState('death');
    } else {
      this.setAnimationState('damage');
    }
  }

  heal(amount: number): void {
    this.card.health = Math.min(100, this.card.health + amount);
  }

  attack(target: Character): number {
    const baseDamage = this.card.attack;
    const defenseReduction = target.card.defense * 0.5;
    const damage = Math.max(1, baseDamage - defenseReduction);
    
    this.setAnimationState('attack');
    target.setAnimationState('defense');
    
    return damage;
  }

  useAbility(abilityIndex: number, target?: Character): number {
    if (abilityIndex < 0 || abilityIndex >= this.card.abilities.length) {
      return 0;
    }

    const ability = this.card.abilities[abilityIndex];
    if (ability.currentCooldown > 0) {
      return 0;
    }

    ability.currentCooldown = ability.cooldown;
    
    if (target) {
      const damage = ability.effect(this.card, target.card);
      target.takeDamage(damage);
      return damage;
    }

    return 0;
  }

  update(): void {
    // تحديث وقت التبريد للقدرات
    this.card.abilities.forEach(ability => {
      if (ability.currentCooldown > 0) {
        ability.currentCooldown--;
      }
    });

    // تحريك الرسوم المتحركة
    switch (this.animationState) {
      case 'attack':
      case 'defense':
      case 'damage':
        setTimeout(() => {
          this.setAnimationState('idle');
        }, 500);
        break;
    }
  }

  render(): string {
    const status = this.isAlive() ? 'حي' : 'ميت';
    const position = `(${this.position.x}, ${this.position.y})`;
    
    return `
      الشخصية: ${this.card.name}
      الحالة: ${status}
      الموقع: ${position}
      الصحة: ${this.card.health}/100
      الهجوم: ${this.card.attack}
      الدفاع: ${this.card.defense}
      السرعة: ${this.card.speed}
      الرسوم المتحركة: ${this.animationState}
    `.trim();
  }

  toJSON(): any {
    return {
      card: this.card,
      position: this.position,
      rotation: this.rotation,
      scale: this.scale,
      isActive: this.isActive,
      animationState: this.animationState
    };
  }
}

export function createCharacterFromCard(card: Card, x: number, y: number): Character {
  return new Character(card, x, y);
}

export function getCharacterDistance(char1: Character, char2: Character): number {
  const pos1 = char1.getPosition();
  const pos2 = char2.getPosition();
  
  return Math.sqrt(
    Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
  );
}

export function canCharactersAttack(char1: Character, char2: Character, range: number = 1.5): boolean {
  const distance = getCharacterDistance(char1, char2);
  return distance <= range;
}

export function getCharactersInRange(
  characters: Character[],
  centerCharacter: Character,
  range: number
): Character[] {
  return characters.filter(char => {
    if (char === centerCharacter) return false;
    return getCharacterDistance(centerCharacter, char) <= range;
  });
                    }
