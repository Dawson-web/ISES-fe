import { likeArticle } from "@/service/article";
import { IArticleDetail } from "@/types/article";
import { Badge, Card, Title, Tooltip } from "@mantine/core";
import { Heart, HeartCrack, ThumbsDown, ThumbsUp } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";
import UserAvatar from "../../public/user_avatar";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

interface Props {
  article: IArticleDetail;
  onClick: () => void;
}
function colorByType(type: string) {
  switch (type) {
    case "日常":
      return "bg-[#2563eb]";
    case "分享":
      return "bg-[#4f46e5]";
    case "感悟":
      return "bg-[#8b5cf6]";
    case "学习":
      return "bg-[#facc15]";
  }
}

const ArticleItem: FC<Props> = ({ article, onClick }) => {
  const navigate = useNavigate();
  const [likesCount, setLikesCount] = useState<number>(article.likesCount);

  colorByType(article.type);

  const handleLike = async () => {
    try {
      await likeArticle(String(article.id));
      setLikesCount((prev) => Number(prev) + 1);
    } catch (error) {
      toast.error(String(error));
    }
  };

  const cancelLike = async () => {
    try {
      await likeArticle(String(article.id));
      setLikesCount((prev) => Number(prev) - 1);
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <Card className="flex-grow flex flex-col gap-1 justify-evenly  dark: rounded-lg shadow-md">
      <header
        className="flex items-end gap-2"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <div>
          <UserAvatar
            size="small"
            src={article.UserInfo.avatar}
            disabled={true}
          ></UserAvatar>
        </div>
        <div className="font-semibold text-sm">
          作者:{article.UserInfo.username}
        </div>
      </header>
      <main className="flex gap-4 items-center mt-4 flex-wrap ">
        <Badge
          className={clsx(`p-4 text-[16px]`, colorByType(article.type))}
          onClick={(e) => {
            // 阻止事件冒泡
            e.stopPropagation();
          }}
        >
          {article.type}
        </Badge>
        <Title
          className="text-xl font-bold ml-1 max-h-[100px] overflow-hidden text-ellipsis whitespace-nowrap hover:text-theme_blue"
          onClick={() => {
            navigate(`/home/article?id=${article.id}`);
          }}
        >
          {article.title}
        </Title>
      </main>
      <footer className="flex items-center justify-end p-2 gap-4    ">
        <div className="flex  items-center gap-2 ">
          {likesCount === article.likesCount ? (
            <Tooltip label="收藏">
              <Heart
                size="1.2rem"
                className="text-rose-500 hover:text-rose-600 hover:scale-110 transition-[transform] duration-300 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip label="取消收藏">
              <HeartCrack
                size="1.2rem"
                className="text-rose-500 hover:text-rose-600 hover:scale-110 transition-[transform] duration-300 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  cancelLike();
                }}
              />
            </Tooltip>
          )}
          {likesCount}
        </div>
        <div className="font-semibold text-sm">
          发布时间：{article.createdAt.split("T")[0]}
        </div>
      </footer>
    </Card>
  );
};

export default ArticleItem;
