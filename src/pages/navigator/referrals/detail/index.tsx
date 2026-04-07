import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Empty,
  Input,
  Message,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "@arco-design/web-react";
import { IconArrowLeft } from "@arco-design/web-react/icon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  addCompanyReferralCommentApi,
  getCompanyReferralCommentsApi,
  getCompanyReferralDetailApi,
  toggleCompanyReferralLikeApi,
} from "@/service/company";
import { IReferralComment, IReferralContent, IReferralStatus } from "@/types/company";
import { apiConfig } from "@/config";
import { Eye, Heart, MessageCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

const { Title, Text } = Typography;

const STATUS_LABEL_MAP: Record<IReferralStatus, string> = {
  pending: "待审核",
  published: "已发布",
  rejected: "已驳回",
};

const STATUS_COLOR_MAP: Record<IReferralStatus, "orange" | "green" | "red"> = {
  pending: "orange",
  published: "green",
  rejected: "red",
};

const resolveAssetUrl = (assetPath?: string) => {
  if (!assetPath) return "";
  if (/^https?:\/\//.test(assetPath)) return assetPath;
  return `${apiConfig.baseUrl}${assetPath}`;
};

const ReferralsDetailPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const id = (() => {
    const raw = (searchParams.get("id") || "").trim();
    if (!raw) return "";
    try {
      return decodeURIComponent(raw).trim();
    } catch {
      return raw;
    }
  })();
  const [commentText, setCommentText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["referral-detail", id],
    queryFn: () => getCompanyReferralDetailApi(id).then((res) => res.data),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const { data: commentData, isLoading: commentsLoading } = useQuery({
    queryKey: ["referral-comments", id],
    queryFn: () =>
      getCompanyReferralCommentsApi(id, {
        page: 1,
        pageSize: 50,
      }).then((res) => res.data),
    enabled: !!id,
  });

  const comments = commentData?.items || [];

  const toggleLikeMutation = useMutation({
    mutationFn: () => toggleCompanyReferralLikeApi(id),
    onSuccess: (res) => {
      const payload = res.data;
      if (!payload) return;
      queryClient.setQueryData(["referral-detail", id], (prev: IReferralContent | undefined) => {
        if (!prev) return prev;
        return {
          ...prev,
          isLiked: payload.isLiked,
          metadata: {
            ...(prev.metadata || {}),
            likeCount: payload.likeCount,
          },
        };
      });
    },
    onError: (err: unknown) => {
      Message.error(err instanceof Error ? err.message : "点赞操作失败");
    },
  });

  const submitCommentMutation = useMutation({
    mutationFn: (content: string) => addCompanyReferralCommentApi(id, content),
    onSuccess: (res) => {
      const payload = res.data;
      setCommentText("");
      Message.success(res.message || "评论成功");
      queryClient.invalidateQueries({ queryKey: ["referral-comments", id] });
      if (payload) {
        queryClient.setQueryData(["referral-detail", id], (prev: IReferralContent | undefined) => {
          if (!prev) return prev;
          return {
            ...prev,
            metadata: {
              ...(prev.metadata || {}),
              commentCount: payload.commentCount,
            },
          };
        });
      }
    },
    onError: (err: unknown) => {
      Message.error(err instanceof Error ? err.message : "评论失败");
    },
  });

  if (!id) {
    return (
      <div className="min-h-screen bg-page px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <Empty description="缺少内推ID，无法打开详情" />
          <div className="mt-4">
            <Button onClick={() => navigate("/navigator/referrals")}>返回内推列表</Button>
          </div>
        </div>
      </div>
    );
  }

  const item = data;
  const status = (item?.metadata?.status || "published") as IReferralStatus;
  const isLiked = !!item?.isLiked;

  return (
    <div className="min-h-screen bg-page px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <Button icon={<IconArrowLeft />} onClick={() => navigate("/navigator/referrals")}>
          返回内推列表
        </Button>

        <Skeleton loading={isLoading} animation>
          {!item ? (
            <Empty description="内推不存在或已删除" />
          ) : (
            <Card>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-2">
                    <Title heading={4} style={{ margin: 0 }}>
                      {item.title}
                    </Title>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag color="arcoblue">{item.content?.companyName || "未知公司"}</Tag>
                      {item.content?.position && <Tag>{item.content.position}</Tag>}
                      {item.content?.location && <Tag>{item.content.location}</Tag>}
                      {item.content?.reward && <Tag color="green">奖励：{item.content.reward}</Tag>}
                      <Tag color={STATUS_COLOR_MAP[status]}>{STATUS_LABEL_MAP[status]}</Tag>
                    </div>
                  </div>
                  <div className="text-right">
                    <Text type="secondary" className="block text-xs">
                      发布时间：{dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
                    </Text>
                    <Space size={12} className="mt-2">
                      <Text type="secondary" className="inline-flex items-center gap-1 text-xs">
                        <Eye size={14} />
                        {item.metadata?.viewCount ?? 0}
                      </Text>
                      <Text type="secondary" className="inline-flex items-center gap-1 text-xs">
                        <Heart size={14} />
                        {item.metadata?.likeCount ?? 0}
                      </Text>
                      <Text type="secondary" className="inline-flex items-center gap-1 text-xs">
                        <MessageCircle size={14} />
                        {item.metadata?.commentCount ?? 0}
                      </Text>
                    </Space>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
                  <Avatar size={40}>
                    {item.creator?.avatar ? (
                      <img src={resolveAssetUrl(item.creator.avatar)} alt="" />
                    ) : (
                      item.creator?.username?.[0] || "U"
                    )}
                  </Avatar>
                  <div>
                    <Text className="block">发布者：{item.creator?.username || "认证用户"}</Text>
                    <Text type="secondary" className="text-xs">
                      审核时间：
                      {item.metadata?.reviewedAt
                        ? dayjs(item.metadata.reviewedAt).format("YYYY-MM-DD HH:mm")
                        : "未审核"}
                    </Text>
                  </div>
                </div>

                <Descriptions
                  column={1}
                  data={[
                    {
                      label: "联系方式",
                      value: item.content?.contact || "未填写",
                    },
                    {
                      label: "截止日期",
                      value: item.content?.expireAt
                        ? dayjs(item.content.expireAt).format("YYYY-MM-DD")
                        : "未填写",
                    },
                    {
                      label: "岗位描述",
                      value: item.content?.description || "暂无描述",
                    },
                    {
                      label: "审核备注",
                      value: item.metadata?.reviewRemark || "无",
                    },
                  ]}
                  labelStyle={{ width: 90 }}
                />

                <div className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Button
                      type={isLiked ? "primary" : "secondary"}
                      loading={toggleLikeMutation.isPending}
                      onClick={() => toggleLikeMutation.mutate()}
                    >
                      {isLiked ? "已点赞" : "点赞"} ({item.metadata?.likeCount ?? 0})
                    </Button>
                    <Text type="secondary">浏览 {item.metadata?.viewCount ?? 0}</Text>
                    <Text type="secondary">评论 {item.metadata?.commentCount ?? 0}</Text>
                  </div>

                  <Input.TextArea
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    placeholder="写下你的评论..."
                    value={commentText}
                    onChange={setCommentText}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      type="primary"
                      loading={submitCommentMutation.isPending}
                      onClick={() => {
                        const content = commentText.trim();
                        if (!content) {
                          Message.warning("请输入评论内容");
                          return;
                        }
                        submitCommentMutation.mutate(content);
                      }}
                    >
                      发表评论
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <Skeleton loading={commentsLoading} animation>
                      {comments.length === 0 ? (
                        <Empty description="暂无评论，来发第一条吧" />
                      ) : (
                        comments.map((comment: IReferralComment) => (
                          <div
                            key={comment.id}
                            className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar size={28}>
                                {comment.author?.avatar ? (
                                  <img src={resolveAssetUrl(comment.author.avatar)} alt="" />
                                ) : (
                                  comment.author?.username?.[0] || "U"
                                )}
                              </Avatar>
                              <div className="min-w-0">
                                <div className="text-sm text-gray-900">
                                  {comment.author?.username || "匿名用户"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap break-words">
                              {typeof comment.content === "string"
                                ? comment.content
                                : JSON.stringify(comment.content)}
                            </div>
                          </div>
                        ))
                      )}
                    </Skeleton>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </Skeleton>
      </div>
    </div>
  );
};

export default ReferralsDetailPage;
