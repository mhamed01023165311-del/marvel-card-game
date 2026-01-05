// constants.ts
import { Card } from './types';

export const STARTER_DECK: Card[] = [
  { id: 'hulk-1', name: 'Hulk', class: 'Melee', attack: 10, defense: 10, range: 1, health: 100, isHologram: false, isVertical: true },
  { id: 'iron-1', name: 'Iron Man', class: 'Hybrid', attack: 8, defense: 6, range: 3, health: 80, isHologram: false, isVertical: true },
  { id: 'cap-1', name: 'Captain America', class: 'Tank', attack: 6, defense: 9, range: 1, health: 110, isHologram: false, isVertical: true },
  { id: 'thor-1', name: 'Thor', class: 'Melee', attack: 9, defense: 8, range: 1, health: 95, isHologram: false, isVertical: true }
];
