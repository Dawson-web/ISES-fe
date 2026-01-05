import ArticlePreview from "@/components/article/article-preview/index";
import CommentBox from "@/components/article/comment/index";
import { Card, Tooltip, Button, Avatar, Tag, Space, Typography } from "@arco-design/web-react";
import { Undo2, ThumbsUp, Eye, MessageCircle, Sparkles, BookOpenText } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getArticleDetailApi, postCommentApi } from "@/service/article";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiConfig } from "@/config";
import { ICommentForm } from "@/types/article";
import { toastMessage } from "@/components/toast";
import { createChatCompletion } from "@/api/ai";

export default function Page() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const articleId = searchParams.get("id") ?? "";

  const [isLiked, setIsLiked] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const { data } = useQuery({
    queryKey: ["article", articleId],
    enabled: Boolean(articleId),
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
  const articleTags = useMemo(
    () => (Array.isArray(article?.metadata?.tags) ? article?.metadata?.tags : []),
    [article?.metadata?.tags]
  );
  const plainLength = useMemo(() => {
    if (!article?.content) return 0;
    return String(article.content)
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim().length;
  }, [article?.content]);

  useEffect(() => {
    setAiSummary(article?.metadata?.excerpt ?? "");
  }, [article?.id]);

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
            content: [
              `标题：${article.title}`,
              `分类：${article.metadata?.category || "未提供"}`,
              `标签：${Array.isArray(article.metadata?.tags) && article.metadata.tags.length ? article.metadata.tags.join("、") : "未提供"}`,
              `正文：${plainContent.slice(0, 2800)}`
            ].join("\n"),
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
                <img alt="avatar" src={`${apiConfig.baseUrl}/uploads/avatars/${article?.creator?.id}.png`} />
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Typography.Text className="text-gray-900 dark:text-gray-100 truncate font-semibold">{article?.creator?.username}</Typography.Text>
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
            {Array.isArray(article?.metadata?.tags) && article?.metadata?.tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
                {article?.metadata?.tags.map((tag: string) => (
                  <span key={tag} className="text-[#1677ff]">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6">
          <Card className="mt-4 overflow-hidden border border-[#e9ecf1] dark:border-[#2a2c33] rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5f8ff] via-white to-[#eef2ff] dark:from-[#0d0f17] dark:via-[#0b0c13] dark:to-[#11121b]">
              <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#4c79ff]/15 blur-3xl" />
                <div className="absolute right-0 top-10 h-32 w-32 rounded-full bg-[#22d3ee]/12 blur-3xl" />
              </div>
              <div className="relative p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 shadow-sm">
                      <Sparkles size={18} className="text-blue-600 dark:text-blue-200" />
                    </div>
                    <div>
                      <div className="text-[12px] uppercase tracking-[0.08em] text-blue-600 dark:text-blue-200 font-semibold">AI 摘要</div>
                      <div className="text-base font-semibold text-gray-900 dark:text-gray-50">AI 智能概括</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">自动提炼要点，快速摸清文章核心</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 text-xs text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <BookOpenText size={14} className="text-blue-500" />
                        正文 {plainLength || 0} 字
                      </span>
                      <span className="h-4 w-px bg-gray-200 dark:bg-white/10" />
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {articleTags.length ? `标签 ${articleTags.length}` : "自动概括"}
                      </span>
                    </div>
                    <Button
                      size="small"
                      type="primary"
                      className="flex items-center gap-1"
                      loading={isGeneratingSummary}
                      disabled={!article}
                      onClick={handleGenerateSummary}
                    >
                      <Sparkles size={14} />
                      {aiSummary ? "重新生成" : "生成摘要"}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.15fr)]">
                  <div className="rounded-xl border border-white/80 dark:border-white/10 bg-white/90 dark:bg-[#0e1018]/80 shadow-sm px-4 py-3">
                    <Typography.Paragraph className="!mb-2 text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                      {aiSummary
                        ? aiSummary
                        : isGeneratingSummary
                          ? "AI 正在生成摘要..."
                          : "点击右上角的按钮，让 AI 帮你总结这篇文章的重点内容。"}
                    </Typography.Paragraph>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      最多截取前 2800 字进行概括，生成后可随时重新生成以贴合最新内容。
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                      <BookOpenText size={16} className="text-blue-600 dark:text-blue-300" />
                      文章标签 / 分类
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {articleTags.length
                        ? articleTags.map((tag: string) => (
                          <span key={tag} className="px-2.5 py-1 rounded-full bg-[#eef3ff] text-[12px] text-blue-700 dark:bg-white/10 dark:text-blue-100">
                            #{tag}
                          </span>
                        ))
                        : <span className="text-xs text-gray-500 dark:text-gray-400">暂无标签，生成摘要时将自动提炼要点</span>}
                    </div>
                    {article?.metadata?.category && (
                      <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ecfdf3] text-[12px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {article?.metadata?.category}
                      </div>
                    )}
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      结合标签与正文，摘要将突出关键信息并保持 120 字内。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="px-2 sm:px-8 py-6">
          <ArticlePreview
            content={String(article?.content)}
            title={article?.title}
            type={article?.metadata?.category}
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
