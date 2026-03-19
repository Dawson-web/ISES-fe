import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  Input,
  Select,
  Space,
  Tag,
  Typography,
  Skeleton,
  Empty,
  Avatar,
  Button,
} from '@arco-design/web-react';
import { IconSearch, IconUser } from '@arco-design/web-react/icon';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import * as echarts from 'echarts';
import { Network, Building2, GraduationCap, Users, TrendingUp, MessageSquareText } from 'lucide-react';
import { getAlumniNetwork } from '@/service/user';
import userStore from '@/store/User';
import type { IAlumniNetworkData, IAlumniNode } from '@/types/user';

const { Text, Title } = Typography;

// 配色常量
const COLORS = {
  school: '#22c55e',
  company: '#3b82f6',
  alumni: '#f59e0b',
  companyGradient: ['#3b82f6', '#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f97316'],
  edge: {
    schoolToCompany: 'rgba(34, 197, 94, 0.25)',
    companyToAlumni: 'rgba(59, 130, 246, 0.15)',
  },
  highlight: {
    edge: 'rgba(59, 130, 246, 0.8)',
    dim: 0.08,
  },
};

// 统计卡片组件
const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) => (
  <Card
    className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    bodyStyle={{ padding: 12 }}
  >
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center w-9 h-9 rounded-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <Text className="text-xs text-gray-500">{label}</Text>
        <div className="text-lg font-semibold text-gray-900 leading-tight">{value}</div>
      </div>
    </div>
  </Card>
);

// 校友悬浮卡片组件
const AlumniTooltipCard = ({
  alumni,
  companyName,
  onChat,
  onProfile,
}: {
  alumni: IAlumniNode;
  companyName: string;
  onChat: () => void;
  onProfile: () => void;
}) => (
  <div className="w-56 p-3">
    <div className="flex items-center gap-3 mb-3">
      <Avatar size={40} className="text-white font-bold bg-amber-500 flex-shrink-0">
        {alumni.avatar ? <img src={alumni.avatar} alt="avatar" /> : alumni.username.charAt(0)}
      </Avatar>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Text className="font-semibold text-gray-900 text-sm truncate">{alumni.username}</Text>
          <Tag
            size="small"
            color={alumni.online ? 'green' : 'gray'}
            className="!rounded-xl !text-[10px]"
          >
            {alumni.online ? '在线' : '离线'}
          </Tag>
        </div>
        <Text className="text-xs text-gray-500 truncate block">
          {companyName} · {alumni.department || '未知部门'}
        </Text>
      </div>
    </div>
    <div className="space-y-1 mb-3">
      {alumni.position && (
        <Text className="text-xs text-gray-600 block">
          💼 {alumni.position}
        </Text>
      )}
      {alumni.grade && (
        <Text className="text-xs text-gray-600 block">
          🎓 {alumni.grade}{alumni.major ? ` · ${alumni.major}` : ''}
        </Text>
      )}
    </div>
    <div className="flex gap-2">
      <Button
        type="primary"
        size="mini"
        className="flex-1"
        icon={<MessageSquareText size={12} />}
        onClick={onChat}
      >
        聊天
      </Button>
      <Button
        size="mini"
        className="flex-1"
        icon={<IconUser />}
        onClick={onProfile}
      >
        查看
      </Button>
    </div>
  </div>
);

// 构建 ECharts 力导向图配置
const buildGraphOption = (
  data: IAlumniNetworkData,
  searchKeyword: string,
): echarts.EChartsOption => {
  const nodes: any[] = [];
  const links: any[] = [];
  const categories = [
    { name: '学校', itemStyle: { color: COLORS.school } },
    { name: '公司', itemStyle: { color: COLORS.company } },
    { name: '校友', itemStyle: { color: COLORS.alumni } },
  ];

  // 判断搜索匹配
  const isMatch = (text: string) => {
    if (!searchKeyword) return true;
    return text.toLowerCase().includes(searchKeyword.toLowerCase());
  };

  // 中心节点: 学校
  const schoolId = `school_${data.school}`;
  const schoolMatched = isMatch(data.school);
  nodes.push({
    id: schoolId,
    name: data.school,
    symbolSize: 65,
    category: 0,
    itemStyle: {
      color: COLORS.school,
      shadowBlur: 20,
      shadowColor: `${COLORS.school}60`,
      opacity: searchKeyword && !schoolMatched ? COLORS.highlight.dim : 1,
    },
    label: {
      show: true,
      fontSize: 14,
      fontWeight: 'bold',
      color: '#111827',
      opacity: searchKeyword && !schoolMatched ? COLORS.highlight.dim : 1,
    },
    nodeType: 'school',
  });

  // 公司与校友节点
  data.companies.forEach((company, companyIdx) => {
    const companyId = `company_${company.companyName}`;
    const companyColor = COLORS.companyGradient[companyIdx % COLORS.companyGradient.length];
    const companyMatched = isMatch(company.companyName);

    // 公司节点大小: 30 ~ 55，按校友数映射
    const maxAlumni = Math.max(...data.companies.map((c) => c.alumniCount), 1);
    const sizeRatio = company.alumniCount / maxAlumni;
    const companySize = 30 + sizeRatio * 25;

    // 检查公司下是否有任何匹配的校友
    const hasMatchedAlumni = company.alumni.some(
      (a) => isMatch(a.username) || isMatch(company.companyName),
    );
    const companyVisible = searchKeyword ? (companyMatched || hasMatchedAlumni) : true;

    nodes.push({
      id: companyId,
      name: `${company.companyName} (${company.alumniCount})`,
      symbolSize: companySize,
      category: 1,
      itemStyle: {
        color: companyColor,
        shadowBlur: companyVisible ? 10 : 0,
        shadowColor: companyVisible ? `${companyColor}40` : 'transparent',
        opacity: companyVisible ? 1 : COLORS.highlight.dim,
      },
      label: {
        show: company.alumniCount >= 2 || companyVisible,
        fontSize: 11,
        color: '#374151',
        opacity: companyVisible ? 1 : COLORS.highlight.dim,
      },
      nodeType: 'company',
      companyId: company.companyId,
      companyName: company.companyName,
    });

    // 学校 → 公司连线
    links.push({
      source: schoolId,
      target: companyId,
      lineStyle: {
        color: COLORS.edge.schoolToCompany,
        width: 1.5 + sizeRatio * 2,
        opacity: companyVisible ? 0.6 : COLORS.highlight.dim,
      },
    });

    // 校友节点
    company.alumni.forEach((alumni) => {
      const alumniId = `alumni_${alumni.id}`;
      const alumniMatched = isMatch(alumni.username) || companyMatched;
      const alumniVisible = searchKeyword ? alumniMatched : true;

      nodes.push({
        id: alumniId,
        name: alumni.username,
        symbolSize: searchKeyword && alumniMatched ? 28 : 18,
        category: 2,
        itemStyle: {
          color: companyColor,
          borderColor: alumni.online ? '#22c55e' : '#d1d5db',
          borderWidth: 2,
          opacity: alumniVisible ? 1 : COLORS.highlight.dim,
        },
        label: {
          show: alumniVisible,
          fontSize: 10,
          color: '#6b7280',
          opacity: alumniVisible ? 1 : COLORS.highlight.dim,
        },
        nodeType: 'alumni',
        alumniData: alumni,
        companyName: company.companyName,
      });

      // 公司 → 校友连线
      links.push({
        source: companyId,
        target: alumniId,
        lineStyle: {
          color: COLORS.edge.companyToAlumni,
          width: 1,
          opacity: alumniVisible ? 0.4 : COLORS.highlight.dim,
        },
      });
    });
  });

  return {
    tooltip: {
      show: false,
    },
    legend: {
      data: categories.map((c) => c.name),
      bottom: 16,
      left: 'center',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#6b7280', fontSize: 12 },
    },
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: nodes,
        links,
        categories,
        roam: true,
        draggable: true,
        force: {
          repulsion: 600,
          gravity: 0.08,
          edgeLength: [60, 180],
          friction: 0.6,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            color: COLORS.highlight.edge,
            width: 3,
          },
          itemStyle: {
            shadowBlur: 20,
          },
        },
        lineStyle: {
          curveness: 0.1,
        },
        scaleLimit: {
          min: 0.3,
          max: 3,
        },
      },
    ],
  };
};

const AlumniNetworkPage = observer(() => {
  const navigate = useNavigate();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType>();

  const [gradeFilter, setGradeFilter] = useState<string | undefined>(undefined);
  const [searchValue, setSearchValue] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // 当前悬浮的校友节点信息（用于 Popover）
  const [hoveredAlumni, setHoveredAlumni] = useState<{
    alumni: IAlumniNode;
    companyName: string;
    position: { x: number; y: number };
  } | null>(null);

  // 查询校友图谱数据
  const { data, isLoading } = useQuery({
    queryKey: ['alumni-network', gradeFilter],
    queryFn: () =>
      getAlumniNetwork({ grade: gradeFilter }).then((res) => res.data.data),
    staleTime: 1000 * 60 * 2,
  });

  // 构建图表配置
  const graphOption = useMemo(() => {
    if (!data || data.totalAlumni === 0) return null;
    return buildGraphOption(data, activeSearch);
  }, [data, activeSearch]);

  // 初始化 ECharts 实例
  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (!chartRef.current) {
      chartRef.current = echarts.init(chartContainerRef.current);
    }

    const handleResize = () => {
      chartRef.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.dispose();
      chartRef.current = undefined;
    };
  }, []);

  // 更新图表配置
  useEffect(() => {
    if (!chartRef.current || !graphOption) return;
    chartRef.current.setOption(graphOption, true);
  }, [graphOption]);

  // 图表事件处理
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    // 点击事件
    const handleClick = (params: any) => {
      const nodeData = params.data;
      if (!nodeData?.nodeType) return;

      if (nodeData.nodeType === 'company' && nodeData.companyId) {
        navigate(`/navigator/info/company?id=${nodeData.companyId}`);
      }

      if (nodeData.nodeType === 'alumni' && nodeData.alumniData) {
        navigate(`/navigator/profile?id=${nodeData.alumniData.id}`);
      }
    };

    // 鼠标悬浮事件
    const handleMouseOver = (params: any) => {
      const nodeData = params.data;
      if (!nodeData?.nodeType || nodeData.nodeType !== 'alumni') {
        setHoveredAlumni(null);
        return;
      }

      // 获取节点在容器中的像素坐标
      const chartContainer = chartContainerRef.current;
      if (!chartContainer) return;

      const rect = chartContainer.getBoundingClientRect();
      setHoveredAlumni({
        alumni: nodeData.alumniData,
        companyName: nodeData.companyName,
        position: {
          x: params.event?.offsetX ?? rect.width / 2,
          y: params.event?.offsetY ?? rect.height / 2,
        },
      });
    };

    const handleMouseOut = () => {
      setHoveredAlumni(null);
    };

    chart.on('click', handleClick);
    chart.on('mouseover', handleMouseOver);
    chart.on('mouseout', handleMouseOut);

    return () => {
      chart.off('click', handleClick);
      chart.off('mouseover', handleMouseOver);
      chart.off('mouseout', handleMouseOut);
    };
  }, [navigate]);

  // 搜索处理
  const handleSearch = useCallback((value: string) => {
    setActiveSearch(value.trim());
  }, []);

  // 统计数据
  const topCompany = data?.companies?.[0]?.companyName || '-';
  const companyCount = data?.companies?.length || 0;

  return (
    <div className="h-full flex flex-col bg-page">
      {/* 顶部栏: 标题 + 筛选 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Network size={22} className="text-green-500" />
            <div>
              <Title heading={5} style={{ margin: 0 }}>
                校友人脉图谱
              </Title>
              {data?.school && (
                <Text className="text-xs text-gray-500">{data.school}</Text>
              )}
            </div>
          </div>
          <Space size={12} className="flex-wrap">
            {data?.grades && data.grades.length > 0 && (
              <Select
                placeholder="年级筛选"
                allowClear
                style={{ width: 140 }}
                value={gradeFilter}
                onChange={(val) => setGradeFilter(val || undefined)}
                options={data.grades.map((g) => ({ label: g, value: g }))}
              />
            )}
            <Input.Search
              placeholder="搜索校友 / 公司"
              prefix={<IconSearch />}
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              onClear={() => { setSearchValue(''); setActiveSearch(''); }}
              allowClear
              style={{ width: 220 }}
            />
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="px-6 pt-4 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<Users size={18} />}
            label="校友总数"
            value={data?.totalAlumni ?? 0}
            color={COLORS.school}
          />
          <StatCard
            icon={<Building2 size={18} />}
            label="覆盖公司"
            value={companyCount}
            color={COLORS.company}
          />
          <StatCard
            icon={<TrendingUp size={18} />}
            label="热门公司"
            value={topCompany}
            color="#ec4899"
          />
          <StatCard
            icon={<GraduationCap size={18} />}
            label="年级分布"
            value={`${data?.grades?.length ?? 0} 届`}
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* 图谱区域 */}
      <div className="flex-1 px-6 pb-4">
        <Card
          className="h-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          bodyStyle={{ padding: 0, height: '100%', position: 'relative' }}
        >
          <Skeleton loading={isLoading} animation className="h-full p-6">
            {data && data.totalAlumni > 0 ? (
              <div className="relative h-full">
                {/* ECharts 容器 */}
                <div
                  ref={chartContainerRef}
                  className="w-full h-full"
                  style={{ minHeight: 400 }}
                />

                {/* 操作提示 */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <span>🖱 滚轮缩放</span>
                  <span>·</span>
                  <span>拖拽平移</span>
                  <span>·</span>
                  <span>点击公司跳转详情</span>
                  <span>·</span>
                  <span>悬浮校友查看卡片</span>
                </div>

                {/* 搜索状态提示 */}
                {activeSearch && (
                  <div className="absolute top-4 left-4 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <IconSearch className="text-blue-500" />
                    <span>搜索: &quot;{activeSearch}&quot;</span>
                    <Tag
                      size="small"
                      closable
                      onClose={() => { setSearchValue(''); setActiveSearch(''); }}
                      className="!text-xs"
                    >
                      清除
                    </Tag>
                  </div>
                )}

                {/* 校友悬浮卡片 */}
                {hoveredAlumni && (
                  <div
                    className="absolute z-50 bg-white rounded-xl shadow-lg border border-gray-200"
                    style={{
                      left: hoveredAlumni.position.x + 12,
                      top: hoveredAlumni.position.y - 60,
                      pointerEvents: 'auto',
                    }}
                    onMouseLeave={() => setHoveredAlumni(null)}
                  >
                    <AlumniTooltipCard
                      alumni={hoveredAlumni.alumni}
                      companyName={hoveredAlumni.companyName}
                      onChat={() => {
                        navigate(`/navigator/chat?userId=${hoveredAlumni.alumni.id}`);
                        setHoveredAlumni(null);
                      }}
                      onProfile={() => {
                        navigate(`/navigator/profile?id=${hoveredAlumni.alumni.id}`);
                        setHoveredAlumni(null);
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <Empty
                  description={
                    <div className="space-y-2">
                      <Text className="text-gray-500 block">
                        {!userStore.school
                          ? '请先在个人资料中填写学校信息'
                          : '暂未发现同校校友'}
                      </Text>
                      {!userStore.school && (
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => navigate('/navigator/profile')}
                        >
                          前往填写
                        </Button>
                      )}
                    </div>
                  }
                />
              </div>
            )}
          </Skeleton>
        </Card>
      </div>
    </div>
  );
});

export default AlumniNetworkPage;
