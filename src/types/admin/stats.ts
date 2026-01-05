export interface IStatsSummary {
  users: number;
  userInfos: number;
  creators: number;
  contents: number;
  comments: number;
  likes: number;
  favorites: number;
  messages: number;
  companies: number;
  salaryReports: number;
  onlineUsers: number;
}

export interface IStatsTrendItem {
  date: string;
  count: number;
}

export interface IStatsTrends {
  users: IStatsTrendItem[];
  contents: IStatsTrendItem[];
  comments: IStatsTrendItem[];
  messages: IStatsTrendItem[];
}

export interface IStatsDistributionItem {
  type?: string;
  status?: string;
  count: number;
}

export interface IStatsDistributions {
  contentTypes: { type: string; count: number }[];
  companyStatus: { status: string; count: number }[];
}

export interface ITopContentByViews {
  id: string;
  title: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  creatorId: string;
  createdAt: string;
}

export interface IStatsRankings {
  topContentsByViews: ITopContentByViews[];
}

export interface IAdminStats {
  summary: IStatsSummary;
  trends: IStatsTrends;
  distributions: IStatsDistributions;
  rankings: IStatsRankings;
  rangeDays: number;
}
