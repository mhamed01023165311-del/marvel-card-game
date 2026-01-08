// ثوابت اللعبة

export const GAME_CONSTANTS = {
  // إعدادات اللوحة
  BOARD_WIDTH: 3,
  BOARD_HEIGHT: 3,
  TILE_SIZE: 2,
  
  // إعدادات اللاعب
  STARTING_HEALTH: 100,
  STARTING_MANA: 10,
  MAX_HAND_SIZE: 7,
  STARTING_HAND_SIZE: 5,
  MAX_MANA: 20,
  
  // إعدادات اللعبة
  MAX_TURNS: 30,
  MANA_PER_TURN: 3,
  DRAW_PER_TURN: 1,
  
  // الألوان
  COLORS: {
    PLAYER1: '#0066FF',
    PLAYER2: '#FF3366',
    NEUTRAL: '#666666',
    
    // ألوان الأنواع
    ATTACK: '#FF4444',
    DEFENSE: '#4488FF',
    RANGED: '#AA44FF',
    MIXED: '#FFAA44',
    
    // ألوان الندرة
    COMMON: '#AAAAAA',
    RARE: '#44AAFF',
    EPIC: '#AA44FF',
    LEGENDARY: '#FFAA44',
    
    // واجهة المستخدم
    BACKGROUND: '#0A0A1A',
    CARD_BACK: '#1A1A2E',
    UI_PRIMARY: '#2D4263',
    UI_SECONDARY: '#C84B31',
    TEXT: '#FFFFFF',
    TEXT_SECONDARY: '#AAAAAA',
  },
  
  // البطاقات الأساسية
  BASE_CARDS: [
    {
      id: 'iron_man',
      name: 'أيرون مان',
      description: 'عبقري، ملياردير، فيلانثروبست',
      type: 'ranged' as const,
      rarity: 'epic' as const,
      attack: 8,
      defense: 5,
      speed: 7,
      health: 80,
      level: 1,
      maxLevel: 5,
      imageUrl: '',
      color: '#FF4444',
      abilities: []
    },
    {
      id: 'captain_america',
      name: 'كابتن أمريكا',
      description: 'البطل الأمريكي الأول',
      type: 'defense' as const,
      rarity: 'rare' as const,
      attack: 6,
      defense: 9,
      speed: 4,
      health: 90,
      level: 1,
      maxLevel: 5,
      imageUrl: '',
      color: '#4488FF',
      abilities: []
    }
  ]
};
