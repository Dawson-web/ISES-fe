import ArticlePreview from "@/components/article/article-preview";
import CommentBox from "@/components/article/comment";
import { getArticleDetail } from "@/service/article";
import { Tooltip } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Undo2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Page() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const articleId = searchParams.get("id") as string;

  const { isSuccess, data } = useQuery({
    queryKey: [articleId],
    queryFn: () => getArticleDetail(articleId),
  });

  return (
    <div className="w-full h-full">
      {isSuccess && (
        <>
          <Tooltip label="返回">
            <Undo2
              className="text-gray-600 dark:text-white"
              onClick={() => {
                navigate("/home");
              }}
            />
          </Tooltip>
          <div className="flex sm:flex-row flex-col sm:items-center sm:justify-center">
            <ArticlePreview
              content={data.data.data.content}
              className="w-full h-full flex flex-col [&>div]:flex-1 [&>div>div]:h-full "
            />
            <div>11</div>
          </div>
          <CommentBox
            commentId={data.data.data.commentId}
            content={data.data.data.Comment.content}
            className=""
          />
        </>
      )}
    </div>
  );
}
