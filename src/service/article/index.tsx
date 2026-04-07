import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import {
  IArticle,
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

export const getArticleList = async (searchTerm:string,page?:number,pageSize?:number) => {
  return await $axios.get<ApiOk<IArticleList>>("/articles", {
    params: {
      title:searchTerm,
      page,
      pageSize,
    },
  });
}

export const getArticleDetailApi = async (id: string) => {
  return await $axios.get<ApiOk<IArticle>>(`/articles/detail/${id}`);
}

export const toggleArticleLikeApi = async (targetId: string) => {
  return await $axios.post<ApiOk<{ isLiked: boolean; likeCount: number }>>('/articles/like/toggle', {
    targetId,
  });
};

export const getHotArticlesApi = () => {
  return $axios.get<ApiOk<IArticle[]>>('/articles/hot-list');
};

export const postCommentApi = (data: ICommentForm) => {
  return $axios.post('/articles/comment', data);
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
