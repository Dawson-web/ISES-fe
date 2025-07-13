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