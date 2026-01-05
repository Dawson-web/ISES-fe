import { useMemo, useRef, useState, useEffect } from "react";
import {
  Card,
  Grid,
  Typography,
  Statistic,
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
  <Card className="h-full rounded-lg border border-gray-100 bg-white shadow-sm">
    <Space direction="vertical" size={8} className="w-full">
      <Text type="secondary" style={{ fontSize: 12, letterSpacing: 0.2 }}>
        {title}
      </Text>
      <Statistic value={value} suffix={suffix} valueStyle={{ fontSize: 24, fontWeight: 700 }} />
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
      tooltip: { trigger: "axis" },
      grid: { left: 60, right: 20, top: 70, bottom: 40 },
      legend: {
        data: trendBlocks.map((b) => b.title),
        top: 8,
        left: "center",
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: { formatter: (val: string) => dayjs(val).format("MM-DD") },
      },
      yAxis: { type: "value" },
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
        data: data?.trends?.[block.key]?.map((item) => item.count) || [],
      })),
    };
  }, [data?.trends, trendBlocks]);

  const contentTypeOption: echarts.EChartsOption = useMemo(() => {
    const pieColors = ["#2563eb", "#0ea5e9", "#22c55e", "#f59e0b", "#ec4899", "#a855f7"];
    return {
      tooltip: { trigger: "item" },
      legend: { top: "2%" },
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
      legend: { top: "2%" },
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
    <div className="px-6 py-4 space-y-4 bg-[#f7f8fa]">
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
        <Card>
          <div className="flex items-center justify-between mb-3">
            <Title heading={5} style={{ margin: 0 }}>
              核心概览
            </Title>
            <Tag color="gray">实时</Tag>
          </div>
          <Row gutter={16}>
            {summaryCards.map((item) => (
              <Col key={item.title} xs={12} sm={8} md={6} lg={4}>
                <SummaryCard title={item.title} value={item.value} />
              </Col>
            ))}
          </Row>
        </Card>
      </Skeleton>

      <Skeleton loading={isLoading} animation>
        <Card>
          <Space direction="vertical" size={12} className="w-full">
            <div className="flex items-center gap-2">
              <Title heading={5} style={{ margin: 0 }}>
                趋势概览
              </Title>
              <Tag color="arcoblue" icon={<IconArrowRise />}>
                按天
              </Tag>
            </div>
            {trendOption.series && (trendOption.series as any[]).length ? (
              <EChart option={trendOption} height={320} />
            ) : (
              <Empty description="暂无趋势数据" />
            )}
          </Space>
        </Card>
      </Skeleton>

      <Skeleton loading={isLoading} animation>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Card>
              <Space direction="vertical" size={8} className="w-full">
                <Title heading={5} style={{ margin: 0 }}>
                  内容类型分布
                </Title>
                {contentTypeOption.series && (contentTypeOption.series as any[])[0]?.data?.length ? (
                  <EChart option={contentTypeOption} height={320} />
                ) : (
                  <Empty description="暂无数据" />
                )}
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <Space direction="vertical" size={8} className="w-full">
                <Title heading={5} style={{ margin: 0 }}>
                  公司认证状态分布
                </Title>
                {companyStatusOption.series && (companyStatusOption.series as any[])[0]?.data?.length ? (
                  <EChart option={companyStatusOption} height={320} />
                ) : (
                  <Empty description="暂无数据" />
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Skeleton>

      <Skeleton loading={isLoading} animation>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Title heading={5} style={{ margin: 0 }}>
                浏览 Top 5 内容
              </Title>
              <Tag color="purple" icon={<IconArrowFall />}>
                metadata.viewCount
              </Tag>
            </div>
            <Text type="secondary">字段沿用内容详情的浏览数</Text>
          </div>
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
        </Card>
      </Skeleton>
    </div>
  );
});

export default StatsDashboard;
