export type Tier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Borked';

export interface GameDto {
  headUrl: string | Blob | undefined;
  id: number;
  steamAppid: number;
  name: string;
  headerUrl: string;
  createdAt: string;
  tier: string;
  genres: string[];
}

export interface ReportDto {
  steamAppid: number;
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
  avatarUrl: string | null;
  bio: string | null;
  backgroundUrl: string | null;
  createdAt: string;
}

export interface DashboardTierStat {
  tier: string;
  count: number;
}

export interface DashboardGenreStat {
  genre: string;
  count: number;
}

export interface DashboardGenreCompatibilityStat {
  genre: string;
  platinum: number;
  gold: number;
  silver: number;
  bronze: number;
  borked: number;
  pending: number;
}

export interface DashboardGameReportStat {
  gameId: number;
  steamAppid: number;
  gameName: string;
  reportCount: number;
}

export interface DashboardContributorStat {
  userId: number;
  username: string;
  avatarUrl: string | null;
  reportCount: number;
}

export interface DashboardStatsDto {
  totalGames: number;
  totalReports: number;
  totalUsers: number;
  averageReportsPerGame: number;

  tierDistribution: DashboardTierStat[];

  genreDistribution: DashboardGenreStat[];

  compatibilityByGenre:
    DashboardGenreCompatibilityStat[];

  mostReportedGames:
    DashboardGameReportStat[];

  topContributors:
    DashboardContributorStat[];
}