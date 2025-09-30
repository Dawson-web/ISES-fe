import ArticlePreview from "@/components/article/article-preview/index";
import CommentBox from "@/components/article/comment/index";
import { Card, Tooltip, Badge, Group, Text, ActionIcon, Button } from "@mantine/core";
import { Undo2, ThumbsUp, Eye, MessageCircle, Clock } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { getArticleDetailApi, postCommentApi } from "@/service/article";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar } from "@arco-design/web-react";
import { apiConfig } from "@/config";
import { ICommentForm } from "@/types/article";
import { toastMessage } from "@/components/toast";

export default function Page() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const articleId = String(searchParams.get('id'));

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const { data } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const res = await getArticleDetailApi(articleId);
      return res.data.data;
    },
  });

  const { mutateAsync: submitComment } = useMutation({
    mutationFn: (data: ICommentForm) => postCommentApi(data),
    onSuccess: () => {
      toastMessage.success("评论发布成功");
      // 刷新文章详情数据
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
    },
  });

  const article = data;


  return (
    <div className="w-full h-full p-6 bg-[#F7F8FA] dark:bg-[#17171A]">
      <Card className="flex flex-col gap-4 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center">
          <Tooltip label="返回">
            <ActionIcon
              variant="subtle"
              onClick={() => history.back()}
            >
              <Undo2 className="text-gray-600" />
            </ActionIcon>
          </Tooltip>
          
          <Group>
            {Array.isArray(article?.metadata.tags) && article?.metadata.tags.map((tag: string) => (
              <Badge key={tag} variant="light">
                {tag}
              </Badge>
            ))}
          </Group>
        </div>

        <div className="flex items-center gap-4 mb-4">
        <Avatar>
            <img
              alt='avatar'
              src={`${apiConfig.baseUrl}/uploads/avatars/${article?.creator.id}.png`}
            />
          </Avatar>
          <div>
            <Text size="sm" fw={500}>{article?.creator.username}</Text>
            <Group gap="xs" mt={4}>
              <Clock size={14} className="text-gray-500" />
              <Text size="xs" c="dimmed">
                {String(article?.createdAt)}
              </Text>
            </Group>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col sm:items-center sm:justify-center">
          <ArticlePreview
            content={String(article?.content)}
            title={article?.title}
            type={article?.metadata.category}
            className="w-full h-full flex flex-col [&>div]:flex-1 [&>div>div]:h-full"
          />
        </div>

        <Group className="mt-4 pb-4 border-b">
          <Button 
            variant={isLiked ? "filled" : "subtle"}
            leftSection={<ThumbsUp size={18} />}
            onClick={handleLike}
          >
            {article?.metadata.likeCount || likeCount}
          </Button>
          
          <Group gap="xs">
            <Eye size={18} className="text-gray-500" />
            <Text size="sm" c="dimmed">
              {article?.metadata.viewCount}
            </Text>
          </Group>

          <Group gap="xs">
            <MessageCircle size={18} className="text-gray-500" />
            <Text size="sm" c="dimmed">
              {article?.metadata.commentCount}
            </Text>
          </Group>

          {article?.metadata.category && (
            <Badge variant="light" color="blue">
              {article?.metadata.category}
            </Badge>
          )}
        </Group>

        <CommentBox
          comments={Array.isArray(article?.comments) ? article?.comments : []}
          articleId={String(article?.id)}
          onSubmitComment={submitComment}
        />
      </Card>
    </div>
  );
} 