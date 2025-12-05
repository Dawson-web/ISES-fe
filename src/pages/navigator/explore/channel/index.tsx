import ArticlePreview from "@/components/article/article-preview/index";
import CommentBox from "@/components/article/comment/index";
import { Card, Tooltip, Button, Avatar, Tag, Space, Typography } from "@arco-design/web-react";
import { Undo2, ThumbsUp, Eye, MessageCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { getArticleDetailApi, postCommentApi } from "@/service/article";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiConfig } from "@/config";
import { ICommentForm } from "@/types/article";
import { toastMessage } from "@/components/toast";

export default function Page() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const articleId = String(searchParams.get('id'));

  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
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
    <div className="w-full h-full min-h-screen bg-[linear-gradient(180deg,rgba(247,248,250,1),rgba(255,255,255,1))] dark:bg-[linear-gradient(180deg,#0f0f11,#17171A)] py-8 px-4">
      <Card className="mx-auto w-full max-w-7xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl overflow-hidden bg-white/90 dark:bg-[#151518]/90 backdrop-blur">
        <div className="px-4 sm:px-6 pt-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar size={44}>
                <img alt='avatar' src={`${apiConfig.baseUrl}/uploads/avatars/${article?.creator.id}.png`} />
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Typography.Text className="text-gray-900 dark:text-gray-100 truncate font-semibold">{article?.creator.username}</Typography.Text>
                  <Tag color="gray" className="hidden sm:inline">作者</Tag>
                </div>
                <div className="mt-1 text-[12px] text-gray-500 dark:text-gray-400">编辑于 {String(article?.createdAt)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="mini" type="primary" shape="round">关注</Button>
              <Tooltip content="返回">
                <Button type="text" shape="circle" onClick={() => history.back()}>
                  <Undo2 className="text-gray-600 dark:text-gray-300" size={18} />
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="mt-3">
            <Typography.Title heading={4} className="!m-0 leading-snug text-[18px] sm:text-[20px] font-semibold text-gray-900 dark:text-gray-100">
              {article?.title}
            </Typography.Title>
          </div>

          <div className="mt-6 text-[15px] leading-7 text-gray-900 dark:text-gray-100">
            {Array.isArray(article?.metadata.tags) && article?.metadata.tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
                {article?.metadata.tags.map((tag: string) => (
                  <span key={tag} className="text-[#1677ff]">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-2 sm:px-8 py-6">
          <ArticlePreview
            content={String(article?.content)}
            title={article?.title}
            type={article?.metadata.category}
            className="w-full h-full flex flex-col [&>div]:flex-1 [&>div>div]:h-full"
          />
        </div>

        <div className="sticky top-0 z-10 px-4 sm:px-6 py-3 border-y border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#151518]/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
          <div className="flex flex-wrap items-center gap-4">
            <Button type={isLiked ? "primary" : "secondary"} onClick={handleLike}>
              <span className="flex items-center gap-2"><ThumbsUp size={18} />{(article?.metadata.likeCount ?? 0) + (isLiked ? 1 : 0)}</span>
            </Button>
            <Space size={4} align="center">
              <Eye size={18} className="text-gray-500" />
              <Typography.Text type="secondary">{article?.metadata.viewCount}</Typography.Text>
            </Space>
            <Space size={4} align="center">
              <MessageCircle size={18} className="text-gray-500" />
              <Typography.Text type="secondary">{article?.metadata.commentCount}</Typography.Text>
            </Space>
            {article?.metadata.category && (
              <Tag className="ml-auto" color="purple">{article?.metadata.category}</Tag>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6">
          <Typography.Title heading={6} className="!m-0 mb-2 text-gray-900 dark:text-gray-100">共 {article?.metadata.commentCount ?? 0} 条评论</Typography.Title>
          <CommentBox
            comments={Array.isArray(article?.comments) ? article?.comments : []}
            articleId={String(article?.id)}
            onSubmitComment={submitComment}
          />
        </div>
      </Card>
    </div>
  );
} 