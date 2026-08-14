import type { Language } from '@/context/LanguageContext';


const genreLabels: Record<Language, Record<string, string>> = {
  en: {},

  es: {
    Action: 'Acción',
    Adventure: 'Aventura',
    Casual: 'Casual',
    Indie: 'Indie',
    'Massively Multiplayer': 'Multijugador masivo',
    RPG: 'Rol',
    Racing: 'Carreras',
    Simulation: 'Simulación',
    Sports: 'Deportes',
    Strategy: 'Estrategia',
    'Free to Play': 'Free to Play',
    'Early Access': 'Acceso anticipado',
  },

  nl: {
    Action: 'Actie',
    Adventure: 'Avontuur',
    Casual: 'Casual',
    Indie: 'Indie',
    'Massively Multiplayer': 'Massively multiplayer',
    RPG: 'Rollenspel',
    Racing: 'Racen',
    Simulation: 'Simulatie',
    Sports: 'Sport',
    Strategy: 'Strategie',
    'Free to Play': 'Free to play',
    'Early Access': 'Vroege toegang',
  },

  de: {
    Action: 'Action',
    Adventure: 'Abenteuer',
    Casual: 'Casual',
    Indie: 'Indie',
    'Massively Multiplayer': 'Massively Multiplayer',
    RPG: 'Rollenspiel',
    Racing: 'Rennspiel',
    Simulation: 'Simulation',
    Sports: 'Sport',
    Strategy: 'Strategie',
    'Free to Play': 'Free to Play',
    'Early Access': 'Early Access',
  },

  fr: {
    Action: 'Action',
    Adventure: 'Aventure',
    Casual: 'Casual',
    Indie: 'Indépendant',
    'Massively Multiplayer': 'Multijoueur massif',
    RPG: 'RPG',
    Racing: 'Course',
    Simulation: 'Simulation',
    Sports: 'Sport',
    Strategy: 'Stratégie',
    'Free to Play': 'Free to Play',
    'Early Access': 'Accès anticipé',
  },

  zh: {
    Action: '动作',
    Adventure: '冒险',
    Casual: '休闲',
    Indie: '独立',
    'Massively Multiplayer': '大型多人在线',
    RPG: '角色扮演',
    Racing: '竞速',
    Simulation: '模拟',
    Sports: '体育',
    Strategy: '策略',
    'Free to Play': '免费游玩',
    'Early Access': '抢先体验',
  },

  ja: {
    Action: 'アクション',
    Adventure: 'アドベンチャー',
    Casual: 'カジュアル',
    Indie: 'インディー',
    'Massively Multiplayer': 'MMO',
    RPG: 'RPG',
    Racing: 'レース',
    Simulation: 'シミュレーション',
    Sports: 'スポーツ',
    Strategy: 'ストラテジー',
    'Free to Play': '基本プレイ無料',
    'Early Access': '早期アクセス',
  },

  tr: {
    Action: 'Aksiyon',
    Adventure: 'Macera',
    Casual: 'Rahat',
    Indie: 'Bağımsız',
    'Massively Multiplayer': 'Devasa Çok Oyunculu',
    RPG: 'RYO',
    Racing: 'Yarış',
    Simulation: 'Simülasyon',
    Sports: 'Spor',
    Strategy: 'Strateji',
    'Free to Play': 'Ücretsiz Oyna',
    'Early Access': 'Erken Erişim',
  },
};

export function getGenreLabel(genre: string, language: Language): string {
  return genreLabels[language][genre] ?? genre;
}