import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import {
  IArticle,
  IArticleFavoriteList,
  IArticleForm,
  IArticleList,
  ICommentForm,
  ICreator,
} from "@/types/article";

export const createArticleApi = async (data: IArticleForm) => {
  return await $axios.post<ApiOk<unknown>>("/articles", {
      title: data.title,
      content: data.content,
      contentType: data.contentType,
      cover: data.cover,
      category: data.category,
      tags: data.tags,
      excerpt: data.excerpt,
    });
};

export const getArticleList = async (
  searchTerm: string,
  page?: number,
  pageSize?: number,
  contentType?: string
) => {
  return await $axios.get<ApiOk<IArticleList>>("/articles", {
    params: {
      title: searchTerm,
      page,
      pageSize,
      contentType,
    },
  });
};

export const getArticleDetailApi = async (id: string) => {
  return await $axios.get<ApiOk<IArticle>>(`/articles/detail/${id}`);
};

export const updateArticleApi = async (data: {
  articleId: string;
  title?: string;
  content?: string;
  contentType?: string;
  category?: string;
  tags?: string[];
}) => {
  return await $axios.post<ApiOk<IArticle>>("/articles/update", data);
};

export const deleteArticleApi = async (id: string) => {
  return await $axios.delete<ApiOk<null>>(`/articles/${id}`);
};

export const toggleArticleLikeApi = async (targetId: string) => {
  return await $axios.post<ApiOk<{ isLiked: boolean; likeCount: number }>>('/articles/like/toggle', {
    targetId,
  });
};

export const toggleArticleFavoriteApi = async (targetId: string) => {
  return await $axios.post<ApiOk<{ isFavorited: boolean }>>('/articles/favorite/toggle', {
    targetId,
    targetType: 'content',
  });
};

export const checkArticleFavoriteApi = async (targetId: string) => {
  return await $axios.get<ApiOk<{ isFavorited: boolean }>>(`/articles/favorite/check/${targetId}`, {
    params: {
      targetType: 'content',
    },
  });
};

export const getFavoriteListApi = async (params?: {
  page?: number;
  pageSize?: number;
}) => {
  return await $axios.get<ApiOk<IArticleFavoriteList>>('/articles/favorite/list', {
    params: {
      targetType: 'content',
      ...params,
    },
  });
};

export const getHotArticlesApi = () => {
  return $axios.get<ApiOk<IArticle[]>>('/articles/hot-list');
};

export const postCommentApi = (data: ICommentForm) => {
  return $axios.post('/articles/comment', data);
};

export const updateCommentApi = (commentId: string, content: string) => {
  return $axios.put<ApiOk<unknown>>(`/articles/comment/${commentId}`, {
    content,
  });
};

export const deleteCommentApi = (commentId: string) => {
  return $axios.delete<ApiOk<{ removedCount: number }>>(`/articles/comment/${commentId}`);
};

export const getSelfArticleListApi = (searchValue: string, page?: number, pageSize?: number) => {
    return $axios.get<ApiOk<IArticleList>>('/articles/self', {
      params: {
        title: searchValue,
        page,
        pageSize
      }
    });
};

export const getCreatorListApi = () => {
  return $axios.get<ApiOk<ICreator[]>>('/articles/creator-list');
};
