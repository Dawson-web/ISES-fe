import { IUserInfo } from "../user";

export interface IArticleFiled {
  title: string;
  content: string;
  type: string | null;
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
  title: string;
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
}

export interface IGetCollectsRequest {
  articleId?: string;
}
export interface IGetCollectsResponse {
  collects: IArticleDetail[];
  count: number;
}
