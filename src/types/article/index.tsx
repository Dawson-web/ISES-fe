export const ArticleCategoryType = {
  campus: '校园',
  company: '公司',
  life: '日常'
}

export const ArticleCategoryTypeColor = {
  campus: '#f53f3f',
  company: '#165dff',
  life: '#00b42a'
}

export const LifeContentTypeColor = {
  '动态': '#00b42a',
  '技术': '#165dff',
  '分享': '#f53f3f'
}

export interface IArticleForm {
  title: string;
  content: string;
  type: string;
  cover?: string;
  category?: string;
  contentType?: string;
  tags?: string[];
  excerpt?: string;
}

export interface ICommentForm {
  content: string,
  targetType: string,
  targetId: string,
}

export interface IComment {
  id: string,
  content: string,
  userInfoId: string,
  targetType: string,
  targetId: string,
  createdAt: string,
  updatedAt: string,
  replies?: IComment[],
  author: {
    id: string,
    username: string,
    avatar: string,
  }
}

export interface IArticle {
  id: number;
  title: string;
  content: string;
  contentType: string;
  isLiked?: boolean;
  isFavorited?: boolean;
  metadata: {
    tags: string[];
    excerpt: string;
    category: string;
    status: string;
    likeCount: number;
    commentCount: number;
    viewCount: number;
  };
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  comments:IComment[]
}

export interface IArticleList {
  articles: IArticle[];
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

export interface IArticleFavorite {
  id: string;
  targetId: string;
  targetType: string;
  createdAt: string;
  updatedAt: string;
  content?: IArticle | null;
}

export interface IArticleFavoriteList {
  favorites: IArticleFavorite[];
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ICreator {
  articleCount: number;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  creatorId: string;
  totalComments: number;
  totalLikes: number;
  totalViews: number;
}
