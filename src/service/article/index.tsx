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
  return await $axios.post<ApiOk<any>>("/articles", {
      title: data.title,
      content: data.content,
      contentType: data.contentType,
      cover: data.cover,
      category: data.category,
      tags: data.tags,
      excerpt: data.excerpt,
    });
};

export const getArticleList = async (searchTerm:string) => {
  return await $axios.get<ApiOk<IArticleList>>("/articles", {
    params: {
      title:searchTerm,
    },
  });
}

export const getArticleDetailApi = async (id: string) => {
  return await $axios.get<ApiOk<IArticle>>(`/articles/detail/${id}`);
}

export const getHotArticlesApi = () => {
  return $axios.get<ApiOk<IArticle[]>>('/articles/hot-list');
};

export const postCommentApi = (data: ICommentForm) => {
  return $axios.post('/articles/comment', data);
};

export const getSelfArticleListApi = () => {
    return $axios.get<ApiOk<IArticle[]>>('/articles/self');
};

export const getCreatorListApi = () => {
  return $axios.get<ApiOk<ICreator[]>>('/articles/creator-list');
};