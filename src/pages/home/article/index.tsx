import ArticlePreview from "@/components/article/article-preview";
import CommentBox from "@/components/article/comment";
import { getArticleDetail } from "@/service/article";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export default function Page() {
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("id") as string;
  const { isSuccess, data } = useQuery({
    queryKey: [articleId],
    queryFn: () => getArticleDetail(articleId),
  });

  return (
    <div className="w-full h-full">
      {isSuccess && (
        <>
          <ArticlePreview
            content={data.data.data.content}
            className="w-full h-full flex flex-col [&>div]:flex-1 [&>div>div]:h-full "
          />
          <CommentBox
            commentId={data.data.data.commentId}
            content={data.data.data.Comment.content}
          />
        </>
      )}
    </div>
  );
}
