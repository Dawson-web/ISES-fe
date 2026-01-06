import { IUserInfo } from "@/types/user";
import { IArticle } from "@/types/article";
import { ICompany } from "@/types/company";

export interface IPagination {
  currentPage: number;
  pageSize: number;
  total: number;
}

export interface IAdminUser extends IUserInfo {
  user?: { email: string; createdAt?: string };
  User?: { email: string; createdAt?: string };
}

export interface IAdminUserListResponse {
  users: IAdminUser[];
  pagination: IPagination;
}

export interface IAdminArticleListResponse {
  articles: IArticle[];
  pagination: IPagination;
}

export interface IAdminCompanyListResponse {
  companies: ICompany[];
  pagination: IPagination;
}
