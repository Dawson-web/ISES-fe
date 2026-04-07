import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Empty,
  Skeleton,
  Tag,
  Typography,
} from "@arco-design/web-react";
import { IconArrowLeft } from "@arco-design/web-react/icon";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getCompanyReferralDetailApi } from "@/service/company";
import { IReferralStatus } from "@/types/company";
import { apiConfig } from "@/config";
import { useNavigate, useSearchParams } from "react-router-dom";

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

const ReferralsDetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["referral-detail", id],
    queryFn: () => getCompanyReferralDetailApi(id).then((res) => res.data),
    enabled: !!id,
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
                    <Text type="secondary" className="block text-xs mt-1">
                      浏览：{item.metadata?.viewCount ?? 0} · 点赞：{item.metadata?.likeCount ?? 0} · 评论：
                      {item.metadata?.commentCount ?? 0}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
                  <Avatar size={40}>
                    {item.creator?.avatar ? (
                      <img src={apiConfig.baseUrl + item.creator.avatar} alt="" />
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
              </div>
            </Card>
          )}
        </Skeleton>
      </div>
    </div>
  );
};

export default ReferralsDetailPage;
