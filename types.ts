// types.ts
export type CharacterClass = 'Melee' | 'Ranged' | 'Tank' | 'Hybrid';

export interface Card {
  id: string;
  name: string;
  class: CharacterClass;
  attack: number;
  defense: number;
  range: number;
  health: number;
  isHologram: boolean; // حالة التحول للهولوغرام
  isVertical: boolean; // حالة الكارت (رأسي أم أفقي)
  position?: { x: number; y: number }; // مكانه على الشبكة السداسية
}
