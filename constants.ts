import { Card, HeroType, AnimationStyle } from './types';

// صور شخصيات كاملة (Full Body) لتبدو كمجسمات عند الوقوف
export const INITIAL_CARDS: Card[] = [
  {
    id: 'c1',
    name: 'Iron Man',
    power: 8,
    health: 6,
    description: 'Tech genius.',
    image: 'https://i.pinimg.com/originals/a0/0c/3c/a00c3c8da790696eb67e7c813639c09c.png', 
    type: HeroType.AVENGER,
    color: 'from-red-600 to-yellow-500',
    animation: AnimationStyle.HOVER,
  },
  {
    id: 'c2',
    name: 'Captain America',
    power: 6,
    health: 9,
    description: 'The First Avenger.',
    image: 'https://png.pngtreep.com/png-clipart/20230401/ourmid/pngtree-captain-america-png-image_6675317.png', // Placeholder for transparent PNG logic
    cutoutImage: 'https://freepngimg.com/thumb/captain_america/5-2-captain-america-png-HD.png',
    type: HeroType.AVENGER,
    color: 'from-blue-600 to-red-500',
    animation: AnimationStyle.HEAVY,
  },
  {
    id: 'c3',
    name: 'Thor',
    power: 9,
    health: 8,
    description: 'God of Thunder.',
    image: 'https://freepngimg.com/thumb/thor/3-2-thor-png-picture.png',
    type: HeroType.AVENGER,
    color: 'from-yellow-400 to-blue-800',
    animation: AnimationStyle.HOVER,
  },
  {
    id: 'c4',
    name: 'Hulk',
    power: 10,
    health: 10,
    description: 'Smash.',
    image: 'https://freepngimg.com/thumb/hulk/10-2-hulk-png-file.png',
    type: HeroType.AVENGER,
    color: 'from-green-600 to-green-900',
    animation: AnimationStyle.HEAVY,
  },
  {
    id: 'c5',
    name: 'Black Widow',
    power: 5,
    health: 5,
    description: 'Assassin.',
    image: 'https://freepngimg.com/thumb/black_widow/4-2-black-widow-transparent.png',
    type: HeroType.AVENGER,
    color: 'from-gray-800 to-red-600',
    animation: AnimationStyle.AGILE,
  },
  {
    id: 'c6',
    name: 'Spider-Man',
    power: 7,
    health: 6,
    description: 'Web slinger.',
    image: 'https://freepngimg.com/thumb/spiderman/4-2-spiderman-png-clipart.png',
    type: HeroType.AVENGER,
    color: 'from-red-600 to-blue-600',
    animation: AnimationStyle.AGILE,
  },
  {
    id: 'c7',
    name: 'Dr. Strange',
    power: 8,
    health: 7,
    description: 'Magic.',
    image: 'https://freepngimg.com/thumb/doctor_strange/2-2-doctor-strange-png-clipart.png',
    type: HeroType.AVENGER,
    color: 'from-purple-600 to-indigo-900',
    animation: AnimationStyle.MYSTIC,
  },
  {
    id: 'c8',
    name: 'Black Panther',
    power: 7,
    health: 7,
    description: 'Wakanda Forever.',
    image: 'https://freepngimg.com/thumb/black_panther/2-2-black-panther-png-pic.png',
    type: HeroType.AVENGER,
    color: 'from-gray-900 to-purple-500',
    animation: AnimationStyle.AGILE,
  },
  {
    id: 'c9',
    name: 'Scarlet Witch',
    power: 10,
    health: 4,
    description: 'Chaos Magic.',
    image: 'https://freepngimg.com/thumb/scarlet_witch/3-2-scarlet-witch-png-image.png',
    type: HeroType.AVENGER,
    color: 'from-red-500 to-pink-600',
    animation: AnimationStyle.MYSTIC,
  },
  {
    id: 'c10',
    name: 'Hawkeye',
    power: 5,
    health: 5,
    description: 'Archer.',
    image: 'https://freepngimg.com/thumb/hawkeye/1-2-hawkeye-png.png',
    type: HeroType.AVENGER,
    color: 'from-purple-800 to-gray-800',
    animation: AnimationStyle.AGILE,
  },
];

export const OPPONENT_POOL: Card[] = [
  {
    id: 'o1',
    name: 'Thanos',
    power: 12,
    health: 12,
    description: 'Titan.',
    image: 'https://freepngimg.com/thumb/thanos/3-2-thanos-png.png',
    type: HeroType.VILLAIN,
    color: 'from-purple-600 to-yellow-600',
    animation: AnimationStyle.HEAVY,
  },
  {
    id: 'o2',
    name: 'Loki',
    power: 7,
    health: 7,
    description: 'Mischief.',
    image: 'https://freepngimg.com/thumb/loki/2-2-loki-png-picture.png',
    type: HeroType.VILLAIN,
    color: 'from-green-600 to-yellow-400',
    animation: AnimationStyle.MYSTIC,
  },
  {
    id: 'o3',
    name: 'Magneto',
    power: 9,
    health: 8,
    description: 'Magnetism.',
    image: 'https://freepngimg.com/thumb/magneto/1-2-magneto-png-image.png',
    type: HeroType.MUTANT,
    color: 'from-red-700 to-purple-800',
    animation: AnimationStyle.HOVER,
  },
    {
    id: 'o4',
    name: 'Venom',
    power: 9,
    health: 9,
    description: 'Symbiote.',
    image: 'https://freepngimg.com/thumb/venom/3-2-venom-png-clipart.png',
    type: HeroType.VILLAIN,
    color: 'from-gray-900 to-black',
    animation: AnimationStyle.AGILE,
  },
];

// Hex Grid Generation Logic
// We use a small radius to fit tightly in the "Big Hex"
export const generateHexGrid = (radius: number): any[] => {
  const hexes = [];
  // Generating a grid. To split it top/bottom, we use 'r' (row) coordinate.
  for (let q = -radius; q <= radius; q++) {
    let r1 = Math.max(-radius, -q - radius);
    let r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      hexes.push({ 
        q, 
        r, 
        id: `${q},${r}`, 
        occupant: null,
        // Zone Logic: If r < 0 it's top (Enemy), if r >= 0 it's bottom (Player)
        zone: r < 0 ? 'OPPONENT' : 'PLAYER'
      });
    }
  }
  return hexes;
};
