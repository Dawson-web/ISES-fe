import { useMemo, useState } from "react";
import {
  Avatar,
  Tag,
  Input,
  Pagination,
  Skeleton,
  Empty,
  Typography,
  Button,
  Modal,
  Message,
  Space,
} from "@arco-design/web-react";
import {
  IconCheck,
  IconClose,
  IconPlus,
  IconSearch,
} from "@arco-design/web-react/icon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import {
  addCompanyReferralApi,
  getCompanyReferralsApi,
  getPendingReferralsApi,
  reviewCompanyReferralApi,
} from "@/service/company";
import {
  IReferralContent,
  IReferralCreatePayload,
  IReferralReviewPayload,
  IReferralStatus,
} from "@/types/company";
import { apiConfig } from "@/config";
import { useNavigate } from "react-router-dom";
import userStore from "@/store/User";

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

const EMPTY_REFERRAL_FORM = {
  title: "",
  position: "",
  location: "",
  reward: "",
  expireAt: "",
  contact: "",
  description: "",
};

const ReferralsPage = observer(() => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = userStore.role === 2;

  const [viewMode, setViewMode] = useState<"published" | "pending">("published");
  const [keyword, setKeyword] = useState<string>("");
  const [listPagination, setListPagination] = useState({ page: 1, pageSize: 10 });
  const [pendingPagination, setPendingPagination] = useState({ page: 1, pageSize: 10 });
  const [createVisible, setCreateVisible] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_REFERRAL_FORM);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [rejectRemark, setRejectRemark] = useState("");
  const [rejectTarget, setRejectTarget] = useState<IReferralContent | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const { data: publishedData, isLoading: publishedLoading } = useQuery({
    queryKey: ["referrals", "published", listPagination, keyword],
    queryFn: () =>
      getCompanyReferralsApi({
        page: listPagination.page,
        pageSize: listPagination.pageSize,
        keyword: keyword || undefined,
        status: "published",
      }).then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });

  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ["referrals", "pending", pendingPagination, keyword],
    queryFn: () =>
      getPendingReferralsApi({
        page: pendingPagination.page,
        pageSize: pendingPagination.pageSize,
        keyword: keyword || undefined,
      }).then((res) => res.data),
    enabled: isAdmin,
    placeholderData: (previousData) => previousData,
  });

  const addReferralMutation = useMutation({
    mutationFn: (payload: IReferralCreatePayload) => addCompanyReferralApi(payload),
    onSuccess: (res: any) => {
      Message.success(res.message || "内推提交成功，等待管理员审核");
      setCreateVisible(false);
      setCreateForm(EMPTY_REFERRAL_FORM);
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
    onError: (err: unknown) => {
      Message.error(err instanceof Error ? err.message : "发布失败");
    },
  });

  const reviewReferralMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IReferralReviewPayload }) =>
      reviewCompanyReferralApi(id, payload),
    onSuccess: (res: any) => {
      Message.success(res.message || "审核成功");
      setRejectVisible(false);
      setRejectTarget(null);
      setRejectRemark("");
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
    onError: (err: unknown) => {
      Message.error(err instanceof Error ? err.message : "审核失败");
    },
    onSettled: () => {
      setReviewingId(null);
    },
  });

  const isPendingView = isAdmin && viewMode === "pending";
  const data = isPendingView ? pendingData : publishedData;
  const isLoading = isPendingView ? pendingLoading : publishedLoading;
  const items = data?.items || [];
  const total = data?.pagination?.total || 0;

  const statusStats = useMemo(
    () => ({
      published: publishedData?.pagination?.total ?? 0,
      pending: pendingData?.pagination?.total ?? 0,
    }),
    [publishedData?.pagination?.total, pendingData?.pagination?.total]
  );

  const toOptional = (value: string) => {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  };

  const renderMetadata = (item: IReferralContent) => {
    const meta = item.metadata || {};
    const status = (meta.status || "published") as IReferralStatus;

    return (
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <Tag color={STATUS_COLOR_MAP[status]}>{STATUS_LABEL_MAP[status]}</Tag>
        <span className="rounded-full bg-gray-100 px-2 py-1">
          浏览 {meta.viewCount ?? 0}
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-1">
          点赞 {meta.likeCount ?? 0}
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-1">
          评论 {meta.commentCount ?? 0}
        </span>
        <span className="text-gray-400">
          发布 {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
        </span>
      </div>
    );
  };

  const renderContent = (item: IReferralContent) => {
    const c = item.content || {};
    return (
      <div className="flex flex-col gap-1 text-[12px] text-gray-700">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[13px] font-semibold text-gray-900 line-clamp-1">
            {c.position || item.title}
          </span>
          {c.companyName && (
            <Tag color="arcoblue" bordered>
              {c.companyName}
            </Tag>
          )}
          {c.location && <Tag bordered>地点：{c.location}</Tag>}
          {c.reward && <Tag color="green">奖励：{c.reward}</Tag>}
          {c.expireAt && (
            <Tag color="orangered" bordered>
              截止：{dayjs(c.expireAt).format("YYYY-MM-DD")}
            </Tag>
          )}
          {c.contact && (
            <Tag color="blue" bordered>
              联系：{c.contact}
            </Tag>
          )}
        </div>
        {c.description && (
          <div className="text-gray-600 leading-relaxed line-clamp-1">
            {c.description}
          </div>
        )}
      </div>
    );
  };

  const submitReferral = () => {
    if (!createForm.position.trim()) {
      Message.warning("请填写岗位名称");
      return;
    }

    addReferralMutation.mutate({
      title: toOptional(createForm.title),
      position: toOptional(createForm.position),
      location: toOptional(createForm.location),
      reward: toOptional(createForm.reward),
      expireAt: toOptional(createForm.expireAt),
      contact: toOptional(createForm.contact),
      description: toOptional(createForm.description),
    });
  };

  const reviewReferral = (id: string, payload: IReferralReviewPayload) => {
    setReviewingId(id);
    reviewReferralMutation.mutate({ id, payload });
  };

  const openRejectModal = (item: IReferralContent) => {
    setRejectTarget(item);
    setRejectRemark("");
    setRejectVisible(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectTarget) return;
    reviewReferral(rejectTarget.id, {
      status: "rejected",
      remark: rejectRemark.trim() || undefined,
    });
  };

  const handleCardClick = (id: string) => {
    const safeId = encodeURIComponent(String(id || "").trim());
    if (!safeId) {
      Message.warning("内推ID无效，无法打开详情");
      return;
    }
    navigate(`detail?id=${safeId}`);
  };

  return (
    <div className="min-h-screen bg-page">
      <div className="bg-gradient-to-r from-primary-700 via-primary to-primary-400 text-white">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-white/80">
                Navigator · Referrals
              </span>
              <Title heading={3} style={{ margin: 0, color: "white" }}>
                岗位内推
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                发现优质内推信息，发布岗位并完成管理员审核
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 text-center">
                <div className="text-xs text-white/80">在招岗位</div>
                <div className="text-2xl font-semibold">{total}</div>
              </div>
              <Button
                type="primary"
                icon={<IconPlus />}
                onClick={() => setCreateVisible(true)}
              >
                发布内推
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Input
              allowClear
              style={{ width: 280 }}
              prefix={<IconSearch />}
              placeholder="搜索职位 / 关键字"
              value={keyword}
              onChange={(val) => {
                setKeyword(val);
              }}
              onPressEnter={() => {
                setListPagination((prev) => ({ ...prev, page: 1 }));
                setPendingPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
            <Tag color="white" bordered={false} className="bg-white/10 text-white">
              内推发布后默认进入待审核
            </Tag>
            {isAdmin && (
              <Space>
                <Button
                  type={viewMode === "published" ? "primary" : "secondary"}
                  onClick={() => {
                    setViewMode("published");
                  }}
                >
                  已发布({statusStats.published})
                </Button>
                <Button
                  type={viewMode === "pending" ? "primary" : "secondary"}
                  onClick={() => {
                    setViewMode("pending");
                  }}
                >
                  待审核({statusStats.pending})
                </Button>
              </Space>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-5 space-y-5">
        {isPendingView && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
            管理员审核视图：可对待审核内推执行通过或驳回
          </div>
        )}
        <div className="grid gap-2 md:grid-cols-1">
          <Skeleton loading={isLoading} animation>
            {items.length === 0 ? (
              <div className="col-span-full">
                <Empty description={isPendingView ? "暂无待审核内推" : "暂无岗位内推"} />
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card transition hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
                  onClick={() => handleCardClick(item.id)}
                >
                  <div className="relative flex items-center gap-3 p-3.5">
                    <Avatar size={40} className="shadow-sm">
                      {item.creator?.avatar ? (
                        <img src={apiConfig.baseUrl + item.creator.avatar} alt="" />
                      ) : (
                        item.creator?.username?.[0] || "U"
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      {renderContent(item)}
                      <Text type="secondary" className="text-[11px]">
                        由 {item.creator?.username || "认证用户"} 发布 ·{" "}
                        {dayjs(item.createdAt).format("YYYY/MM/DD")}
                      </Text>
                      {renderMetadata(item)}
                    </div>
                    <div className="flex flex-col items-end gap-2 text-right min-w-[110px]">
                      <span className="text-[11px] text-gray-400">
                        {item.content?.location || "地点未填"}
                      </span>
                      {isPendingView && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="mini"
                            type="primary"
                            status="success"
                            icon={<IconCheck />}
                            loading={
                              reviewingId === item.id && reviewReferralMutation.isPending
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              reviewReferral(item.id, { status: "published" });
                            }}
                          >
                            通过
                          </Button>
                          <Button
                            size="mini"
                            status="danger"
                            icon={<IconClose />}
                            loading={
                              reviewingId === item.id && reviewReferralMutation.isPending
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              openRejectModal(item);
                            }}
                          >
                            驳回
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </Skeleton>
        </div>

        <div className="flex justify-end">
          <Pagination
            current={isPendingView ? pendingPagination.page : listPagination.page}
            pageSize={isPendingView ? pendingPagination.pageSize : listPagination.pageSize}
            total={total}
            showTotal
            sizeCanChange
            onChange={(page) => {
              if (isPendingView) {
                setPendingPagination((prev) => ({ ...prev, page }));
              } else {
                setListPagination((prev) => ({ ...prev, page }));
              }
            }}
            onPageSizeChange={(pageSize) => {
              if (isPendingView) {
                setPendingPagination({ page: 1, pageSize });
              } else {
                setListPagination({ page: 1, pageSize });
              }
            }}
          />
        </div>
      </div>

      <Modal
        title="发布岗位内推"
        visible={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={submitReferral}
        confirmLoading={addReferralMutation.isPending}
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="内推标题（可选）"
            value={createForm.title}
            onChange={(value) => setCreateForm((prev) => ({ ...prev, title: value }))}
          />
          <Input
            placeholder="岗位名称（必填）"
            value={createForm.position}
            onChange={(value) =>
              setCreateForm((prev) => ({ ...prev, position: value }))
            }
          />
          <Input
            placeholder="地点"
            value={createForm.location}
            onChange={(value) =>
              setCreateForm((prev) => ({ ...prev, location: value }))
            }
          />
          <Input
            placeholder="奖励说明"
            value={createForm.reward}
            onChange={(value) =>
              setCreateForm((prev) => ({ ...prev, reward: value }))
            }
          />
          <Input
            placeholder="截止时间（如 2026-12-31）"
            value={createForm.expireAt}
            onChange={(value) =>
              setCreateForm((prev) => ({ ...prev, expireAt: value }))
            }
          />
          <Input
            placeholder="联系方式"
            value={createForm.contact}
            onChange={(value) =>
              setCreateForm((prev) => ({ ...prev, contact: value }))
            }
          />
        </div>
        <Input.TextArea
          className="mt-3"
          autoSize={{ minRows: 3, maxRows: 6 }}
          placeholder="岗位描述"
          value={createForm.description}
          onChange={(value) =>
            setCreateForm((prev) => ({ ...prev, description: value }))
          }
        />
      </Modal>

      <Modal
        title={`驳回内推：${rejectTarget?.title || ""}`}
        visible={rejectVisible}
        onCancel={() => {
          setRejectVisible(false);
          setRejectTarget(null);
          setRejectRemark("");
        }}
        onOk={handleRejectConfirm}
        confirmLoading={reviewReferralMutation.isPending}
      >
        <Input.TextArea
          autoSize={{ minRows: 3, maxRows: 6 }}
          placeholder="可选：填写驳回原因"
          value={rejectRemark}
          onChange={setRejectRemark}
        />
      </Modal>
    </div>
  );
});

export default ReferralsPage;
