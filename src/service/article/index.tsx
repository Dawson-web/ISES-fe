import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import {
  IArticleForm,
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