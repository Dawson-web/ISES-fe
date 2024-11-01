import ArticleItem from "@/components/article-item";
import { getArticlePagination } from "@/service/article";
import { IArticleDetail, IPaginationRequest } from "@/types/article";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Pagination } from "@mantine/core";

export default function Page() {
  const [articles, setArticles] = useState<IArticleDetail[]>([]);
  const [page, onChange] = useState(1);
  const [total, setTotal] = useState(0);
  const [search] = useState("");
  const totalPages = useMemo(() => Math.ceil(total / 6), [total]);
  const handleGetArticleRecommand = async () => {
    try {
      const reqParams: IPaginationRequest = {
        title: search,
        page: page,
        pageSize: 6,
      };
      const res = await getArticlePagination(reqParams);
      setArticles(res.data.data.articles);
      setTotal(res.data.data.pagination.total);
    } catch (error) {
      toast.error(String(error));
    }
  };
  useEffect(() => {
    handleGetArticleRecommand();
  }, [page, search]);
  if (!articles.length) return null;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full ">
        <div className="w-full flex flex-col gap-2 justity-between ">
          {articles.slice(0, articles.length / 2).map((article) => {
            return <ArticleItem article={article} />;
          })}
        </div>
        <div className="w-full flex flex-col gap-2 justify-between ">
          {articles
            .slice(articles.length / 2, articles.length)
            .map((article) => {
              return <ArticleItem article={article} />;
            })}
        </div>
      </div>
      <Pagination
        total={totalPages}
        value={page}
        onChange={onChange}
        className="sm mt-8"
      />
    </>
  );
}
