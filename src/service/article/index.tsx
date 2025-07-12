import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import {
  IArticle,
  IArticleForm,
  IArticleList,
} from "@/types/article";

export const createArticle = async (data: IArticleForm) => {
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

export const getArticleList = async () => {
  return await $axios.get<ApiOk<IArticleList>>("/articles");
}

export const getArticleDetail = async (id: string) => {
  return await $axios.get<ApiOk<IArticle>>(`/articles/detail/${id}`);
}

export const getHotArticles = () => {
  return $axios.get('/api/articles/hot');
};