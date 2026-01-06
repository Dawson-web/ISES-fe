import { useState } from "react";
import {
  Avatar,
  Tag,
  Input,
  Select,
  Pagination,
  Skeleton,
  Empty,
  Typography,
  Divider,
} from "@arco-design/web-react";
import { IconSearch } from "@arco-design/web-react/icon";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getCompanyReferralsApi } from "@/service/company";
import { IReferralContent } from "@/types/company";
import { apiConfig } from "@/config";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const statusColorMap: Record<string, string> = {
  已发布: "green",
  已下线: "gray",
  审核中: "orangered",
  草稿: "gray",
};

const ReferralsPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string>("");
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ["referrals", pagination, companyId, keyword],
    queryFn: () =>
      getCompanyReferralsApi({
        page: pagination.page,
        pageSize: pagination.pageSize,
        companyId,
        keyword: keyword || undefined,
      }).then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });

  const items = data?.items || [];
  const total = data?.pagination?.total || 0;

  const renderMetadata = (item: IReferralContent) => {
    const meta = item.metadata || {};
    return (
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span className="rounded-full bg-[#f3f6fb] px-2 py-1">
          浏览 {meta.viewCount ?? 0}
        </span>
        <span className="rounded-full bg-[#f3f6fb] px-2 py-1">
          点赞 {meta.likeCount ?? 0}
        </span>
        <span className="rounded-full bg-[#f3f6fb] px-2 py-1">
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

  const handleCardClick = (id: string) => {
    navigate(`/navigator/referrals/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb]">
      <div className="bg-gradient-to-r from-[#0f5fff] via-[#3c83ff] to-[#6aa5ff] text-white">
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
                发现优质内推信息，直接与企业或员工对接
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 text-center">
                <div className="text-xs text-white/80">在招岗位</div>
                <div className="text-2xl font-semibold">{total}</div>
              </div>
              <div className="hidden sm:block text-sm text-white/80">
                实时更新 · 点击卡片查看详情
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Input
              allowClear
              style={{ width: 280 }}
              prefix={<IconSearch />}
              placeholder="搜索职位 / 关键字"
              value={keyword}
              onChange={(val) => setKeyword(val)}
              onPressEnter={() => setPagination((prev) => ({ ...prev, page: 1 }))}
            />
            <Select
              allowClear
              style={{ width: 220 }}
              placeholder="按公司筛选（即将开放）"
              value={companyId}
              onChange={(val) => {
                setCompanyId(val);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              options={[]}
              disabled
            />
            <Tag color="white" bordered={false} className="bg-white/10 text-white">
              优先展示认证企业内推
            </Tag>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-5 space-y-5">
        <div className="grid gap-2 md:grid-cols-1">
          <Skeleton loading={isLoading} animation>
            {items.length === 0 ? (
              <div className="col-span-full">
                <Empty description="暂无岗位内推" />
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-xl border border-[#e8ecf3] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#3c83ff] hover:shadow-[0_8px_20px_rgba(22,93,255,0.1)]"
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
                    </div>
                    <div className="flex flex-col items-end gap-2 text-right">
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <span className="rounded-full bg-[#f3f6fb] px-2 py-0.5">
                          浏览 {item.metadata?.viewCount ?? 0}
                        </span>
                        <span className="rounded-full bg-[#f3f6fb] px-2 py-0.5">
                          赞 {item.metadata?.likeCount ?? 0}
                        </span>
                        <span className="rounded-full bg-[#f3f6fb] px-2 py-0.5">
                          评 {item.metadata?.commentCount ?? 0}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {item.content?.location || "地点未填"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </Skeleton>
        </div>

        <div className="flex justify-end">
          <Pagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={total}
            showTotal
            sizeCanChange
            onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            onPageSizeChange={(pageSize) => setPagination({ page: 1, pageSize })}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
