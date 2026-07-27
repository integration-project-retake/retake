export type Tier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Borked';

export interface GameDto {
  id: number;
  steamAppid: number;
  name: string;
  createdAt: string;
}

export interface ReportDto {
  id: number;
  user_id: number;
  username: string;
  game_id: number;
  gameName: string;
  tier: Tier;
  distribution: string;
  comment: string;
  protonVersion: string;
  createdAt: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}
