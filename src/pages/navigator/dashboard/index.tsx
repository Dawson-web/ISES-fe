import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Card,
  Grid,
  Typography,
  Space,
  Select,
  Table,
  Tag,
  Divider,
  Skeleton,
  Empty,
} from "@arco-design/web-react";
import { IconArrowFall, IconArrowRise } from "@arco-design/web-react/icon";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import userStore from "@/store/User";
import { getAdminStatsApi } from "@/service/admin";
import {
  IAdminStats,
  IStatsTrends,
} from "@/types/admin/stats";
import * as echarts from "echarts";

const { Row, Col } = Grid;
const { Title, Text } = Typography;

const SummaryCard = ({
  title,
  value,
  suffix,
}: {
  title: string;
  value: number;
  suffix?: string;
}) => (
  <Card
    className="h-full rounded-lg border border-[#e7ebf3] bg-white shadow-sm transition-transform duration-150 hover:-translate-y-0.5"
    bodyStyle={{ padding: 14 }}
  >
    <Space direction="vertical" size={6} className="w-full">
      <Text type="secondary" style={{ fontSize: 12, letterSpacing: 0.2 }}>
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#22c55e] mr-1" />
        {title}
      </Text>
      <div className="flex items-baseline gap-1">
        <span className="text-[26px] font-semibold leading-none text-gray-900">
          {value?.toLocaleString?.() ?? value}
        </span>
        {suffix ? <span className="text-sm text-gray-500">{suffix}</span> : null}
      </div>
    </Space>
  </Card>
);

const EChart = ({
  option,
  height = 260,
}: {
  option: echarts.EChartsOption;
  height?: number;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType>();

  useEffect(() => {
    if (!ref.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current);
    }
    const handleResize = () => {
      chartRef.current?.resize();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.dispose();
      chartRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option);
  }, [option]);

  return <div ref={ref} style={{ width: "100%", height }} />;
};

const ChartCard = ({
  title,
  subtitle,
  children,
  extra,
}: {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card
    className="h-full rounded-lg border border-[#e7ebf3] bg-white shadow-sm"
    bodyStyle={{ padding: 14 }}
  >
    <div className="flex items-start justify-between gap-3 mb-2">
      <div className="flex flex-col gap-1">
        <Text style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{title}</Text>
        {subtitle ? (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {subtitle}
          </Text>
        ) : null}
      </div>
      <Space size={8}>{extra}</Space>
    </div>
    {children}
  </Card>
);

type TrendKey = keyof IStatsTrends;

const StatsDashboard = observer(() => {
  const [range, setRange] = useState(30);

  const { data, isLoading } = useQuery({
    queryKey: ["adminStats", range],
    queryFn: () => getAdminStatsApi(range).then((res) => res.data.data),
    enabled: userStore.role === 2,
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });

  const summaryCards = useMemo(
    () => [
      { title: "用户数", value: data?.summary.users ?? 0 },
      { title: "创作者", value: data?.summary.creators ?? 0 },
      { title: "内容数", value: data?.summary.contents ?? 0 },
      { title: "评论数", value: data?.summary.comments ?? 0 },
      { title: "点赞", value: data?.summary.likes ?? 0 },
      { title: "收藏", value: data?.summary.favorites ?? 0 },
      { title: "消息", value: data?.summary.messages ?? 0 },
      { title: "企业", value: data?.summary.companies ?? 0 },
      { title: "薪资爆料", value: data?.summary.salaryReports ?? 0 },
      { title: "在线用户", value: data?.summary.onlineUsers ?? 0 },
    ],
    [data?.summary]
  );

  const trendBlocks: { title: string; key: TrendKey; color: string }[] = [
    { title: "新增用户", key: "users", color: "#2563eb" },
    { title: "内容发布", key: "contents", color: "#0ea5e9" },
    { title: "评论", key: "comments", color: "#f97316" },
    { title: "私信消息", key: "messages", color: "#a855f7" },
  ];

  const trendOption: echarts.EChartsOption = useMemo(() => {
    const dates =
      data?.trends?.users?.map((item) => item.date) ||
      data?.trends?.contents?.map((item) => item.date) ||
      [];
    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0f172acc",
        borderWidth: 0,
        textStyle: { color: "#e5e7eb", fontSize: 12 },
      },
      grid: { left: 52, right: 18, top: 60, bottom: 40 },
      legend: {
        data: trendBlocks.map((b) => b.title),
        top: 10,
        left: "center",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: "#4b5563", fontSize: 12 },
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: {
          formatter: (val: string) => dayjs(val).format("MM-DD"),
          color: "#6b7280",
        },
        axisLine: { lineStyle: { color: "#e5e7eb" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#6b7280" },
        splitLine: { lineStyle: { color: "#eef1f7" } },
      },
      series: trendBlocks.map((block) => ({
        name: block.title,
        type: "line",
        smooth: true,
        showSymbol: false,
        itemStyle: { color: block.color },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `${block.color}aa` },
            { offset: 1, color: `${block.color}10` },
          ]),
        },
        lineStyle: { width: 2.4, color: block.color },
        data: data?.trends?.[block.key]?.map((item) => item.count) || [],
      })),
    };
  }, [data?.trends, trendBlocks]);

  const contentTypeOption: echarts.EChartsOption = useMemo(() => {
    const pieColors = ["#2563eb", "#0ea5e9", "#22c55e", "#f59e0b", "#ec4899", "#a855f7"];
    return {
      tooltip: { trigger: "item" },
      legend: { top: "2%", textStyle: { color: "#4b5563" } },
      color: pieColors,
      series: [
        {
          name: "内容类型",
          type: "pie",
          radius: ["38%", "72%"],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
          labelLine: { length: 12, length2: 10, smooth: true },
          label: {
            formatter: "{b|{b}}\n{c} ({d}%)",
            rich: {
              b: { fontWeight: 600, color: "#1f2937" },
            },
          },
          data:
            data?.distributions?.contentTypes?.map((item) => ({
              name: item.type || "-",
              value: item.count,
            })) || [],
        },
      ],
    };
  }, [data?.distributions?.contentTypes]);

  const companyStatusOption: echarts.EChartsOption = useMemo(() => {
    const pieColors = ["#0ea5e9", "#22c55e", "#f97316"];
    return {
      tooltip: { trigger: "item" },
      legend: { top: "2%", textStyle: { color: "#4b5563" } },
      color: pieColors,
      series: [
        {
          name: "公司认证状态",
          type: "pie",
          radius: ["38%", "72%"],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
          labelLine: { length: 12, length2: 10, smooth: true },
          label: {
            formatter: "{b|{b}}\n{c} ({d}%)",
            rich: {
              b: { fontWeight: 600, color: "#1f2937" },
            },
          },
          data:
            data?.distributions?.companyStatus?.map((item) => ({
              name: item.status || "-",
              value: item.count,
            })) || [],
        },
      ],
    };
  }, [data?.distributions?.companyStatus]);

  const columns = [
    {
      title: "内容标题",
      dataIndex: "title",
      width: 240,
      ellipsis: true,
      render: (text: string) => (
        <Text ellipsis={{ rows: 1, showTooltip: true }}>{text || "-"}</Text>
      ),
    },
    {
      title: "浏览",
      dataIndex: "viewCount",
      width: 90,
      align: "right" as const,
    },
    {
      title: "点赞",
      dataIndex: "likeCount",
      width: 90,
      align: "right" as const,
    },
    {
      title: "评论",
      dataIndex: "commentCount",
      width: 90,
      align: "right" as const,
    },
    {
      title: "作者",
      dataIndex: "creatorId",
      width: 140,
      render: (text: string) => (
        <Tag color="blue" style={{ maxWidth: 120 }} className="truncate">
          {text || "-"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      width: 160,
      render: (text: string) =>
        text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "-",
    },
  ];

  if (userStore.role !== 2) {
    return (
      <div className="px-6 py-10">
        <Card>
          <Space direction="vertical" size={6}>
            <Title heading={4} style={{ margin: 0 }}>
              暂无权限
            </Title>
            <Text type="secondary">仅管理员可访问数据大盘。</Text>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-6 py-5 space-y-4 bg-[#f4f6fb]">
      <div className="flex items-center justify-between">
        <div>
          <Title heading={3} style={{ margin: 0 }}>
            数据大盘
          </Title>
          <Text type="secondary">
            统计范围：近 {data?.rangeDays ?? range} 天
          </Text>
        </div>
        <Space>
          <Text type="secondary">时间范围</Text>
          <Select
            style={{ width: 120 }}
            value={range}
            onChange={(value) => setRange(Number(value))}
            options={[
              { label: "近 7 天", value: 7 },
              { label: "近 30 天", value: 30 },
              { label: "近 90 天", value: 90 },
            ]}
          />
        </Space>
      </div>

      <Skeleton loading={isLoading} animation>
        <Card
          className="rounded-xl border border-[#e7ebf3] bg-white shadow-sm"
          bodyStyle={{ padding: 16 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Title heading={5} style={{ margin: 0 }}>
                核心概览
              </Title>
              <Tag color="arcoblue">实时</Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              近 {data?.rangeDays ?? range} 天 · 刷新频率 1 分钟
            </Text>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {summaryCards.map((item) => (
              <SummaryCard key={item.title} title={item.title} value={item.value} />
            ))}
          </div>
        </Card>
      </Skeleton>

      <Skeleton loading={isLoading} animation>
        <ChartCard
          title="趋势概览"
          subtitle={`按天 · 近 ${data?.rangeDays ?? range} 天`}
          extra={<Tag color="arcoblue" icon={<IconArrowRise />}>实时</Tag>}
        >
          {trendOption.series && (trendOption.series as any[]).length ? (
            <EChart option={trendOption} height={340} />
          ) : (
            <Empty description="暂无趋势数据" />
          )}
        </ChartCard>
      </Skeleton>

      <Skeleton loading={isLoading} animation>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <ChartCard title="内容类型分布" subtitle="按内容分类占比">
              {contentTypeOption.series && (contentTypeOption.series as any[])[0]?.data?.length ? (
                <EChart option={contentTypeOption} height={320} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </ChartCard>
          </Col>
          <Col xs={24} md={12}>
            <ChartCard title="公司认证状态分布" subtitle="企业认证情况">
              {companyStatusOption.series && (companyStatusOption.series as any[])[0]?.data?.length ? (
                <EChart option={companyStatusOption} height={320} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </ChartCard>
          </Col>
        </Row>
      </Skeleton>

      <Skeleton loading={isLoading} animation>
        <ChartCard
          title="浏览 Top 5 内容"
          subtitle="字段沿用内容详情的浏览数"
          extra={<Tag color="purple" icon={<IconArrowFall />}>metadata.viewCount</Tag>}
        >
          <Divider style={{ margin: "8px 0 16px" }} />
          <Table
            columns={columns}
            data={data?.rankings?.topContentsByViews || []}
            pagination={false}
            size="small"
            scroll={{ x: 820 }}
            tableLayout="fixed"
            bordered
            rowKey="id"
            locale={{ emptyText: <Empty description="暂无数据" /> }}
          />
        </ChartCard>
      </Skeleton>
    </div>
  );
});

export default StatsDashboard;
