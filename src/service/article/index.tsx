import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import {
  IAddArticleResponse,
  IArticleFiled,
  IGetArticlePaginationResponse,
  IPaginationRequest,
} from "@/types/article";

export const addArticle = async (data: IArticleFiled) => {
  return await $axios.post<ApiOk<IAddArticleResponse>>("/user/articles", {
    title: data.title,
    content: data.content,
    type: data.type,
  });
};

export const getArticlePagination = async (params?: IPaginationRequest) => {
  return await $axios.get<ApiOk<IGetArticlePaginationResponse>>(
    "/user/articles",
    { params }
  );
};

export const likeArticle = async (articleId: string) => {
  return await $axios.post<ApiOk<unknown>>(
    `/user/articles/like?articleId=${articleId}`
  );
};
