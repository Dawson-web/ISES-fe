// 面经帖子类型
export interface IInterviewPost {
  id: string;
  title: string;
  companyName: string;
  companyId?: string;
  position: string;
  round: InterviewRound;
  difficulty: InterviewDifficulty;
  category: InterviewCategory;
  content: {
    questions: IInterviewQuestion[];
    summary?: string;
    tips?: string;
  };
  tags: string[];
  metadata: {
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    status?: 'published' | 'archived';
  };
  creatorId: string;
  creator?: {
    id: string;
    username: string;
    avatar?: string;
    school?: string;
    techDirection?: string;
  };
  company?: {
    id: string;
    name: string;
    logo?: string;
    description?: string;
  };
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 面试题目
export interface IInterviewQuestion {
  question: string;
  answer?: string;
  type?: string;
}

// 面试轮次枚举
export type InterviewRound = 'written_test' | 'first' | 'second' | 'third' | 'hr' | 'other';

// 难度枚举
export type InterviewDifficulty = 'easy' | 'medium' | 'hard';

// 面试类型枚举
export type InterviewCategory = 'algorithm' | 'system_design' | 'behavioral' | 'project' | 'general';

// 列表请求参数
export interface IInterviewListRequest {
  page?: number;
  pageSize?: number;
  keyword?: string;
  companyName?: string;
  round?: InterviewRound;
  difficulty?: InterviewDifficulty;
  category?: InterviewCategory;
  tag?: string;
}

// 列表响应
export interface IInterviewListResponse {
  items: IInterviewPost[];
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

// 创建/编辑请求参数
export interface IInterviewPostRequest {
  title: string;
  companyName: string;
  companyId?: string;
  position: string;
  round: InterviewRound;
  difficulty: InterviewDifficulty;
  category: InterviewCategory;
  content: {
    questions: IInterviewQuestion[];
    summary?: string;
    tips?: string;
  };
  tags?: string[];
}

// 统计数据
export interface IInterviewStats {
  totalCount: number;
  companyStats: Array<{ companyName: string; count: number }>;
  difficultyStats: Array<{ difficulty: string; count: number }>;
  categoryStats: Array<{ category: string; count: number }>;
  roundStats: Array<{ round: string; count: number }>;
}

// 中文映射
export const ROUND_LABELS: Record<InterviewRound, string> = {
  written_test: '笔试',
  first: '一面',
  second: '二面',
  third: '三面',
  hr: 'HR面',
  other: '其他',
};

export const DIFFICULTY_LABELS: Record<InterviewDifficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

export const CATEGORY_LABELS: Record<InterviewCategory, string> = {
  algorithm: '算法',
  system_design: '系统设计',
  behavioral: '行为面',
  project: '项目经验',
  general: '综合',
};

export const DIFFICULTY_COLORS: Record<InterviewDifficulty, string> = {
  easy: 'green',
  medium: 'orangered',
  hard: 'red',
};
