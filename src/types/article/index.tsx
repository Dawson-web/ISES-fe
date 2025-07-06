import { IUserInfo } from "../user";

// 基于数据库模型的新类型定义
export interface IContentMetadata {
  tags?: string[];
  category?: string;
  featured?: boolean;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  status?: 'draft' | 'published' | 'archived';
  readTime?: number;
  excerpt?: string;
  rating?: number;
  targetUrl?: string;
}

export interface IContent {
  id: string;
  title: string;
  contentType: string;
  content: any;
  metadata: IContentMetadata;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  creator?: IUserInfo;
  likes?: ILike[];
  favorites?: IFavorite[];
  comments?: IComment[];
}

export interface IComment {
  id: string;
  content: any;
  userInfoId: string;
  targetType: 'content' | 'comment';
  targetId: string;
  createdAt: Date;
  updatedAt: Date;
  author?: IUserInfo;
  targetContent?: IContent;
  parentComment?: IComment;
  replies?: IComment[];
  favorites?: IFavorite[];
}

export interface ILike {
  id: string;
  userInfoId: string;
  targetType: 'content' | 'comment';
  targetId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: IUserInfo;
  content?: IContent;
  comment?: IComment;
}

export interface IFavorite {
  id: string;
  userInfoId: string;
  targetType: 'content' | 'comment';
  targetId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: IUserInfo;
  content?: IContent;
  comment?: IComment;
}

// API 请求和响应类型
export interface IContentListRequest {
  page?: number;
  pageSize?: number;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  creatorId?: string;
  search?: string;
  featured?: boolean;
}

export interface IContentListResponse {
  contents: IContent[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    pageSize: number;
  };
}

export interface ICreateContentRequest {
  title: string;
  contentType: string;
  content: any;
  metadata?: Partial<IContentMetadata>;
}

export interface IUpdateContentRequest {
  id: string;
  title?: string;
  contentType?: string;
  content?: any;
  metadata?: Partial<IContentMetadata>;
}

export interface ICreateCommentRequest {
  content: any;
  targetType: 'content' | 'comment';
  targetId: string;
}

export interface IToggleLikeRequest {
  targetType: 'content' | 'comment';
  targetId: string;
}

export interface IToggleFavoriteRequest {
  targetType: 'content' | 'comment';
  targetId: string;
}

// 兼容旧的类型定义
export interface IArticleFiled {
  title: string;
  content: string;
  type: string | null;
}

export interface IUpdateArticleRequest {
  title?: string;
  content?: string;
  type?: string;
  articleId: string;
}

export interface IArticleDetail {
  id: number;
  title: string;
  content: string;
  type: string;
  userInfoId: string;
  commentId: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  UserInfo: IUserInfo;
}

export interface IPagination {
  currentPage: number;
  total: number;
  pageSize: number;
}

export interface IAddArticleResponse {
  id: number;
  title: string;
  content: string;
  type: string;
  userInfoId: string;
  commentId: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
}

export interface IGetArticlePaginationResponse {
  articles: IArticleDetail[];
  pagination: IPagination;
}

export interface IPaginationRequest {
  title?: string;
  userInfoId?: string;
  pageSize: number;
  page: number;
}

export interface ICommentDetail {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetArticleDetailResponse {
  id: number;
  title: string;
  content: string;
  type: string;
  userInfoId: string;
  commentId: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  Comment: ICommentDetail;
}

export interface IPostCommentData {
  content: string;
  commentId: string;
  createdAt: string;
}

export interface IGetCollectsRequest {
  articleId?: string;
}
export interface IGetCollectsResponse {
  collects: IArticleDetail[];
  count: number;
}
