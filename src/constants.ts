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
  
  // الرسائل
  MESSAGES: {
    WELCOME: 'مرحبًا في لعبة بطاقات مارفل التكتيكية!',
    YOUR_TURN: 'دورك!',
    OPPONENT_TURN: 'دور الخصم',
    GAME_START: 'بدأت اللعبة!',
    GAME_OVER: 'انتهت اللعبة!',
    WINNER: 'الفائز:',
    DRAW: 'تعادل!',
  },
  
  // مسارات الصور
  ASSET_PATHS: {
    CARD_BACK: '/assets/cards/card-back.png',
    CARD_FRAME_COMMON: '/assets/cards/frame-common.png',
    CARD_FRAME_RARE: '/assets/cards/frame-rare.png',
    CARD_FRAME_EPIC: '/assets/cards/frame-epic.png',
    CARD_FRAME_LEGENDARY: '/assets/cards/frame-legendary.png',
    
    // أبطال مارفل
    IRON_MAN: '/assets/heroes/iron-man.png',
    CAPTAIN_AMERICA: '/assets/heroes/captain-america.png',
    THOR: '/assets/heroes/thor.png',
    HULK: '/assets/heroes/hulk.png',
    BLACK_WIDOW: '/assets/heroes/black-widow.png',
    SPIDER_MAN: '/assets/heroes/spider-man.png',
    DOCTOR_STRANGE: '/assets/heroes/doctor-strange.png',
    BLACK_PANTHER: '/assets/heroes/black-panther.png',
    CAPTAIN_MARVEL: '/assets/heroes/captain-marvel.png',
    SCARLET_WITCH: '/assets/heroes/scarlet-witch.png',
    
    // نماذج ثلاثية الأبعاد
    MODELS: {
      IRON_MAN: '/assets/models/iron-man.glb',
      CAPTAIN_AMERICA: '/assets/models/captain-america.glb',
      THOR: '/assets/models/thor.glb',
    },
  },
  
  // البطاقات الأساسية
  BASE_CARDS: [
    {
      id: 'iron_man',
      name: 'أيرون مان',
      description: 'عبقري، ملياردير، playboy، فيلانثروبست',
      type: 'ranged' as const,
      rarity: 'epic' as const,
      attack: 8,
      defense: 6,
      speed: 7,
      health: 80,
      level: 1,
      maxLevel: 5,
      imageUrl: '/assets/heroes/iron-man.png',
      model3DUrl: '/assets/models/iron-man.glb',
      color: '#FF4444',
      abilities: [
        {
          name: 'أشعة Repulsor',
          description: 'يطلق أشعة قوية تضرر الخصم',
          effect: (attacker, defender) => attacker.attack * 1.5,
          cooldown: 2,
          currentCooldown: 0
        }
      ]
    },
    {
      id: 'captain_america',
      name: 'كابتن أمريكا',
      description: 'البطل الأمريكي الأول، درعه مصنوع من الفيبرانيوم',
      type: 'defense' as const,
      rarity: 'rare' as const,
      attack: 6,
      defense: 9,
      speed: 5,
      health: 90,
      level: 1,
      maxLevel: 5,
      imageUrl: '/assets/heroes/captain-america.png',
      model3DUrl: '/assets/models/captain-america.glb',
      color: '#4488FF',
      abilities: [
        {
          name: 'درع غير قابل للكسر',
          description: 'يمنع 50% من الضرر لمدة دور',
          effect: (attacker, defender) => 0,
          cooldown: 3,
          currentCooldown: 0
        }
      ]
    },
    // يمكن إضافة المزيد من البطاقات هنا
  ]
};

// وظائف مساعدة
export const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    attack: GAME_CONSTANTS.COLORS.ATTACK,
    defense: GAME_CONSTANTS.COLORS.DEFENSE,
    ranged: GAME_CONSTANTS.COLORS.RANGED,
    mixed: GAME_CONSTANTS.COLORS.MIXED
  };
  return colors[type] || GAME_CONSTANTS.COLORS.MIXED;
};

export const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: GAME_CONSTANTS.COLORS.COMMON,
    rare: GAME_CONSTANTS.COLORS.RARE,
    epic: GAME_CONSTANTS.COLORS.EPIC,
    legendary: GAME_CONSTANTS.COLORS.LEGENDARY
  };
  return colors[rarity] || GAME_CONSTANTS.COLORS.COMMON;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('ar-EG');
};

export const getCardCost = (card: any): number => {
  const baseCost = 3;
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    epic: 2,
    legendary: 3
  };
  return Math.floor(baseCost * (rarityMultiplier[card.rarity] || 1) * (card.level || 1));
};
