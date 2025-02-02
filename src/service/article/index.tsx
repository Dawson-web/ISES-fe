import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import {
  IAddArticleResponse,
  IArticleFiled,
  IGetArticleDetailResponse,
  IGetArticlePaginationResponse,
  IGetCollectsRequest,
  IGetCollectsResponse,
  IPaginationRequest,
  IPostCommentData,
  IUpdateArticleRequest,
} from "@/types/article";

export const addArticle = async (data: IArticleFiled) => {
  return await $axios.post<ApiOk<IAddArticleResponse>>("/articles", {
    title: data.title,
    content: data.content,
    type: data.type,
  });
};
export const updateArticle = async (data: IUpdateArticleRequest) => {
  return await $axios.post<ApiOk<unknown>>("/articles/update", {
    title: data?.title,
    content: data.content,
    articleId: data.articleId,
    type: data?.type,
  });
};
export const getArticlePagination = async (params?: IPaginationRequest) => {
  return await $axios.get<ApiOk<IGetArticlePaginationResponse>>("/articles", {
    params,
  });
};

export const getCollects = async (params: IGetCollectsRequest) => {
  return await $axios.post<ApiOk<IGetCollectsResponse>>(
    `/articles/getcollects`,
    {
      ...params,
    }
  );
};

export const likeArticle = async (articleId: string) => {
  return await $axios.post<ApiOk<unknown>>(
    `/articles/like?articleId=${articleId}`
  );
};

export const uploadImage = async (formData: FormData) => {
  return await $axios.post<ApiOk<{ path: string }>>(
    `/articles/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getArticleDetail = async (articleId: string) => {
  return await $axios.get<ApiOk<IGetArticleDetailResponse>>(
    `/articles/detail/${articleId}`
  );
};

export const postComment = async (data: IPostCommentData) => {
  return await $axios.post<ApiOk<unknown>>(`/articles/comment`, data);
};
