import ArticlePreview from "@/components/article/article-preview";
import { getArticleDetail } from "@/service/article";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();
  const articleId = searchParams.get("id") as string;
  const { isSuccess, data } = useQuery({
    queryKey: ["chatList"],
    queryFn: () => getArticleDetail(articleId),
  });

  return (
    <div className="w-full h-full">
      {isSuccess && (
        <ArticlePreview
          content={data.data.data.content}
          className="w-full h-full flex flex-col [&>div]:flex-1 [&>div>div]:h-full "
        />
      )}
    </div>
  );
}
