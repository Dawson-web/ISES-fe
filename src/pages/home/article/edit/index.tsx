import ArticlePreview from "@/components/article/article-preview";
import { getArticleDetail } from "@/service/article";
import { Card } from "@mantine/core";
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
        <Card className=" flex flex-col ">
          <div className="flex sm:flex-row flex-col sm:items-center sm:justify-center">
            <ArticlePreview
              editable={true}
              showMenu={true}
              showEdit={true}
              content={data.data.data.content}
              title={data.data.data.title}
              type={data.data.data.type}
              className="w-full h-full flex flex-col [&>div]:flex-1 [&>div>div]:h-full "
            />
          </div>
        </Card>
      )}
    </div>
  );
}
