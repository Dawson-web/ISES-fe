import { likeArticle } from "@/service/article";
import { IArticleDetail } from "@/types/article";
import { Badge, Card, Title } from "@mantine/core";
import { ThumbsUp } from "lucide-react";
import { FC } from "react";
import { toast } from "sonner";
import UserAvatar from "../user_avatar";

interface Props {
  article: IArticleDetail;
}
const ArticleItem: FC<Props> = ({ article }) => {
  const handleLike = async () => {
    try {
      await likeArticle(String(article.id));
    } catch (error) {
      toast.error(String(error));
    }
  };
  return (
    <Card>
      <div className="flex items-end gap-2">
        <UserAvatar size="small" src={article.UserInfo.avatar}></UserAvatar>
        <div className="font-semibold text-sm">
          作者:{article.UserInfo.username}
        </div>
      </div>
      <div className="flex gap-4 items-center mt-4 flex-wrap">
        <Badge size="1.1rem" className="p-4">
          {article.type}
        </Badge>
        <Title className="text-xl font-bold ml-1 ">{article.title}</Title>
      </div>
      <Card.Section className="flex items-center justify-end p-2 gap-4">
        <div className="flex  items-center gap-2 ">
          <ThumbsUp
            size="1.1rem"
            className="text-yellow-400 hover:text-yellow-500 hover:scale-110 transition-[transform] duration-300 ease-in-out"
            onClick={handleLike}
          />
          {article.likesCount}
        </div>
        <div className="font-semibold text-sm">
          发布时间：{article.createdAt.split("T")[0]}
        </div>

        {/* <EditorContent editor={editor}></EditorContent> */}
      </Card.Section>
    </Card>
  );
};

export default ArticleItem;