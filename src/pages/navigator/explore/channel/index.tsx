import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Tooltip, Button, Avatar, Tag, Space, Typography } from "@arco-design/web-react";
import {
  Undo2,
  ThumbsUp,
  Eye,
  MessageCircle,
  Sparkles,
  BookOpenText,
  Bookmark,
} from "lucide-react";

import ArticlePreview from "@/components/article/article-preview/index";
import CommentBox from "@/components/article/comment/index";
import {
  deleteArticleApi,
  deleteCommentApi,
  getArticleDetailApi,
  postCommentApi,
  toggleArticleFavoriteApi,
  toggleArticleLikeApi,
  updateCommentApi,
} from "@/service/article";
import { apiConfig } from "@/config";
import { IArticle, ICommentForm } from "@/types/article";
import { toastMessage } from "@/components/toast";
import { createChatCompletion } from "@/api/ai";
import { getValidUid } from "@/api/token";

export default function Page() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const articleId = searchParams.get("id") ?? "";
  const currentUserId = getValidUid() || "";

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const { data } = useQuery({
    queryKey: ["article", articleId],
    enabled: Boolean(articleId),
    queryFn: async () => {
      const res = await getArticleDetailApi(articleId);
      return res.data.data;
    },
  });

  const article = data;
  const isOwner = String(article?.creatorId || "") === currentUserId;

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
  }, [article?.id, article?.metadata?.excerpt]);

  useEffect(() => {
    setIsLiked(Boolean(article?.isLiked));
    setLikeCount(Number(article?.metadata?.likeCount || 0));
  }, [article?.id, article?.isLiked, article?.metadata?.likeCount]);

  useEffect(() => {
    setIsFavorited(Boolean(article?.isFavorited));
  }, [article?.id, article?.isFavorited]);

  const refreshArticleDetail = () => {
    queryClient.invalidateQueries({ queryKey: ["article", articleId] });
  };

  const { mutateAsync: submitComment } = useMutation({
    mutationFn: (payload: ICommentForm) => postCommentApi(payload),
    onSuccess: () => {
      toastMessage.success("评论发布成功");
      refreshArticleDetail();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "评论发布失败";
      toastMessage.error(message);
    },
  });

  const { mutateAsync: updateComment } = useMutation({
    mutationFn: (payload: { commentId: string; content: string }) =>
      updateCommentApi(payload.commentId, payload.content),
    onSuccess: () => {
      toastMessage.success("评论更新成功");
      refreshArticleDetail();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "评论更新失败";
      toastMessage.error(message);
    },
  });

  const { mutateAsync: deleteComment } = useMutation({
    mutationFn: (commentId: string) => deleteCommentApi(commentId),
    onSuccess: () => {
      toastMessage.success("评论删除成功");
      refreshArticleDetail();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "评论删除失败";
      toastMessage.error(message);
    },
  });

  const { mutateAsync: toggleLike, isPending: isTogglingLike } = useMutation({
    mutationFn: async () => {
      const targetId = String(article?.id || articleId || "").trim();
      if (!targetId) {
        throw new Error("文章ID缺失");
      }
      const res = await toggleArticleLikeApi(targetId);
      return res.data;
    },
    onSuccess: (res) => {
      const nextState = res.data;
      if (!nextState) return;

      setIsLiked(nextState.isLiked);
      setLikeCount(nextState.likeCount);
      toastMessage.success(res.message || (nextState.isLiked ? "已点赞" : "已取消点赞"));

      queryClient.setQueryData(["article", articleId], (prev: IArticle | undefined) => {
        if (!prev) return prev;
        return {
          ...prev,
          isLiked: nextState.isLiked,
          metadata: {
            ...(prev.metadata || {}),
            likeCount: nextState.likeCount,
          },
        };
      });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "点赞操作失败";
      toastMessage.error(message);
    },
  });

  const { mutateAsync: toggleFavorite, isPending: isTogglingFavorite } = useMutation({
    mutationFn: async () => {
      const targetId = String(article?.id || articleId || "").trim();
      if (!targetId) {
        throw new Error("文章ID缺失");
      }
      const res = await toggleArticleFavoriteApi(targetId);
      return res.data;
    },
    onSuccess: (res) => {
      const nextState = !!res.data?.isFavorited;
      setIsFavorited(nextState);
      toastMessage.success(res.message || (nextState ? "已收藏" : "已取消收藏"));

      queryClient.setQueryData(["article", articleId], (prev: IArticle | undefined) => {
        if (!prev) return prev;
        return {
          ...prev,
          isFavorited: nextState,
        };
      });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "收藏操作失败";
      toastMessage.error(message);
    },
  });

  const { mutateAsync: deleteArticle, isPending: isDeletingArticle } = useMutation({
    mutationFn: () => deleteArticleApi(articleId),
    onSuccess: () => {
      toastMessage.success("文章已删除");
      queryClient.invalidateQueries({ queryKey: ["getArticleList"] });
      queryClient.invalidateQueries({ queryKey: ["selfArticleList"] });
      navigate("/navigator");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "删除文章失败";
      toastMessage.error(message);
    },
  });

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
              `正文：${plainContent.slice(0, 2800)}`,
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

  const handleLike = async () => {
    await toggleLike();
  };

  const handleFavorite = async () => {
    await toggleFavorite();
  };

  const handleGenerateSummary = async () => {
    await generateSummary();
  };

  const handleEditArticle = () => {
    navigate(`/navigator/publish?id=${articleId}`);
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm("确认删除这篇文章？删除后无法恢复。")) {
      return;
    }
    await deleteArticle();
  };

  return (
    <div className="w-full h-full min-h-screen bg-[linear-gradient(180deg,rgba(247,248,250,1),rgba(255,255,255,1))] dark:bg-[linear-gradient(180deg,#0f0f11,#17171A)] py-8 px-4">
      <Card className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur dark:bg-[#151518]/90">
        <div className="px-4 pt-5 pb-3 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar size={44}>
                <img alt="avatar" src={`${apiConfig.baseUrl}/uploads/avatars/${article?.creator?.id}.png`} />
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Typography.Text className="truncate font-semibold text-gray-900 dark:text-gray-100">
                    {article?.creator?.username}
                  </Typography.Text>
                  <Tag color="gray" className="hidden sm:inline">
                    作者
                  </Tag>
                </div>
                <div className="mt-1 text-[12px] text-gray-500 dark:text-gray-400">
                  编辑于 {String(article?.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isOwner ? (
                <>
                  <Button size="mini" type="primary" shape="round" onClick={handleEditArticle}>
                    编辑
                  </Button>
                  <Button
                    size="mini"
                    status="danger"
                    shape="round"
                    loading={isDeletingArticle}
                    onClick={handleDeleteArticle}
                  >
                    删除
                  </Button>
                </>
              ) : (
                <Button size="mini" type="primary" shape="round">
                  关注
                </Button>
              )}
              <Tooltip content="返回">
                <Button type="text" shape="circle" onClick={() => history.back()}>
                  <Undo2 className="text-gray-600 dark:text-gray-300" size={18} />
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="mt-3">
            <Typography.Title
              heading={4}
              className="!m-0 text-[18px] font-semibold leading-snug text-gray-900 dark:text-gray-100 sm:text-[20px]"
            >
              {article?.title}
            </Typography.Title>
          </div>

          <div className="mt-6 text-[15px] leading-7 text-gray-900 dark:text-gray-100">
            {articleTags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
                {articleTags.map((tag: string) => (
                  <span key={tag} className="text-[#1677ff]">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6">
          <Card className="mt-4 overflow-hidden rounded-2xl border border-[#e9ecf1] shadow-[0_12px_40px_rgba(15,23,42,0.05)] dark:border-[#2a2c33] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5f8ff] via-white to-[#eef2ff] dark:from-[#0d0f17] dark:via-[#0b0c13] dark:to-[#11121b]">
              <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#4c79ff]/15 blur-3xl" />
                <div className="absolute right-0 top-10 h-32 w-32 rounded-full bg-[#22d3ee]/12 blur-3xl" />
              </div>
              <div className="relative p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/80 bg-white/80 p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
                      <Sparkles size={18} className="text-blue-600 dark:text-blue-200" />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-blue-600 dark:text-blue-200">
                        AI 摘要
                      </div>
                      <div className="text-base font-semibold text-gray-900 dark:text-gray-50">
                        AI 智能概括
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        自动提炼要点，快速摸清文章核心
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 rounded-lg border border-white/80 bg-white/80 px-3 py-2 text-xs text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 sm:flex">
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
                  <div className="rounded-xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-[#0e1018]/80">
                    <Typography.Paragraph className="!mb-2 whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-100">
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
                  <div className="rounded-xl border border-white/80 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                      <BookOpenText size={16} className="text-blue-600 dark:text-blue-300" />
                      文章标签 / 分类
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {articleTags.length ? (
                        articleTags.map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#eef3ff] px-2.5 py-1 text-[12px] text-blue-700 dark:bg-white/10 dark:text-blue-100"
                          >
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          暂无标签，生成摘要时将自动提炼要点
                        </span>
                      )}
                    </div>
                    {article?.metadata?.category && (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#ecfdf3] px-2.5 py-1 text-[12px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {article.metadata.category}
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

        <div className="px-2 py-6 sm:px-8">
          <ArticlePreview
            content={String(article?.content)}
            title={article?.title}
            type={article?.metadata?.category}
            className="flex h-full w-full flex-col [&>div]:flex-1 [&>div>div]:h-full"
          />
        </div>

        <div className="sticky top-0 z-10 border-y border-black/5 bg-white/70 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-[#151518]/70 supports-[backdrop-filter]:backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button type={isLiked ? "primary" : "secondary"} loading={isTogglingLike} onClick={handleLike}>
              <span className="flex items-center gap-2">
                <ThumbsUp size={18} />
                {likeCount}
              </span>
            </Button>
            <Button
              type={isFavorited ? "primary" : "secondary"}
              loading={isTogglingFavorite}
              onClick={handleFavorite}
            >
              <span className="flex items-center gap-2">
                <Bookmark size={18} />
                {isFavorited ? "已收藏" : "收藏"}
              </span>
            </Button>
            <Space size={4} align="center">
              <Eye size={18} className="text-gray-500" />
              <Typography.Text type="secondary">{article?.metadata.viewCount}</Typography.Text>
            </Space>
            <Space size={4} align="center">
              <MessageCircle size={18} className="text-gray-500" />
              <Typography.Text type="secondary">{article?.metadata.commentCount}</Typography.Text>
            </Space>
            {article?.metadata?.category && (
              <Tag className="ml-auto" color="purple">
                {article.metadata.category}
              </Tag>
            )}
          </div>
        </div>

        <div className="px-4 py-6 sm:px-6">
          <Typography.Title heading={6} className="!m-0 mb-2 text-gray-900 dark:text-gray-100">
            共 {article?.metadata.commentCount ?? 0} 条评论
          </Typography.Title>
          <CommentBox
            articleId={String(article?.id || articleId)}
            comments={Array.isArray(article?.comments) ? article.comments : []}
            currentUserId={currentUserId}
            onSubmitComment={submitComment}
            onEditComment={(commentId, content) => updateComment({ commentId, content })}
            onDeleteComment={(commentId) => deleteComment(commentId)}
          />
        </div>
      </Card>
    </div>
  );
}
