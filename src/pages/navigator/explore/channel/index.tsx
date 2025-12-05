import ArticlePreview from "@/components/article/article-preview/index";
import CommentBox from "@/components/article/comment/index";
import { Card, Tooltip, Button, Avatar, Tag, Space, Typography } from "@arco-design/web-react";
import { Undo2, ThumbsUp, Eye, MessageCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleDetailApi, postCommentApi } from "@/service/article";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiConfig } from "@/config";
import { ICommentForm } from "@/types/article";
import { toastMessage } from "@/components/toast";
import { createChatCompletion } from "@/api/ai";

export default function Page() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const articleId = String(searchParams.get('id'));

  const [isLiked, setIsLiked] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

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

  useEffect(() => {
    setAiSummary(article?.metadata?.excerpt ?? "");
  }, [article?.id, article?.metadata?.excerpt]);

  const { mutateAsync: generateSummary, isPending: isGeneratingSummary } = useMutation({
    mutationFn: async () => {
      if (!article) {
        throw new Error("文章未加载完成");
      }

      const plainContent = String(article.content || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const result = await createChatCompletion({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "你是一名专业的内容编辑，请用简体中文概括以下文章，输出一段不超过120字的摘要，突出核心观点与关键信息。",
          },
          {
            role: "user",
            content: `标题：${article.title}\n正文：${plainContent.slice(0, 2800)}`,
          },
        ],
        temperature: 0.6,
      });

      const summaryText = result?.choices?.[0]?.message?.content?.trim();
      if (!summaryText) {
        throw new Error("AI 未返回摘要内容");
      }
      return summaryText;
    },
    onSuccess: (summary) => {
      setAiSummary(summary);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "生成摘要失败，请稍后重试";
      toastMessage.error(message);
    },
  });

  const handleGenerateSummary = async () => {
    await generateSummary();
  };

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

        <div className="px-4 sm:px-6">
          <div className="rounded-xl border border-black/5 dark:border-white/10 bg-gray-50 dark:bg-[#101015] px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <Typography.Title heading={6} className="!m-0 text-gray-900 dark:text-gray-100">AI 智能概括</Typography.Title>
                <Typography.Text type="secondary" className="block mt-1 text-[12px]">
                  一键生成摘要，快速了解文章要点
                </Typography.Text>
              </div>
              <Button
                size="mini"
                type="secondary"
                loading={isGeneratingSummary}
                disabled={!article}
                onClick={handleGenerateSummary}
              >
                {aiSummary ? "重新生成" : "生成摘要"}
              </Button>
            </div>
            <div className="mt-3 text-[14px] leading-6 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {aiSummary
                ? aiSummary
                : isGeneratingSummary
                  ? "AI 正在生成摘要..."
                  : "点击右上方按钮生成这篇文章的 AI 摘要。"}
            </div>
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
