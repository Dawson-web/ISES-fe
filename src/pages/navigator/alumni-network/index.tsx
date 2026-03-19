import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Input,
  Select,
  Tag,
  Typography,
  Skeleton,
  Empty,
  Avatar,
  Button,
} from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import * as echarts from 'echarts';
import { Building2, GraduationCap, Users, MessageSquareText, Maximize2, Minimize2 } from 'lucide-react';
import { getAlumniNetwork } from '@/service/user';
import userStore from '@/store/User';
import type { IAlumniNetworkData, IAlumniNode } from '@/types/user';

const { Text } = Typography;

// 色板 - 偏自然的低饱和色系，避免纯亮色的 AI 感
const PALETTE = {
  // 节点颜色
  school: '#059669',
  company: '#2563eb',
  alumni: '#d97706',
  // 公司节点渐变色 - 取自自然色
  companySet: ['#2563eb', '#0891b2', '#7c3aed', '#c026d3', '#e11d48', '#ea580c'],
  // 连线
  edgeSchool: 'rgba(5, 150, 105, 0.2)',
  edgeAlumni: 'rgba(37, 99, 235, 0.12)',
  // 高亮
  focusEdge: 'rgba(37, 99, 235, 0.75)',
  dimOpacity: 0.06,
};

// 校友悬浮卡片
const AlumniHoverCard = ({
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
  <div className="w-60">
    <div className="p-3.5">
      <div className="flex items-center gap-3 mb-3">
        <Avatar size={38} className="text-white font-bold bg-amber-600 flex-shrink-0">
          {alumni.avatar ? <img src={alumni.avatar} alt="avatar" /> : alumni.username.charAt(0)}
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-gray-900 text-[13px] truncate">{alumni.username}</span>
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                alumni.online ? 'bg-emerald-400' : 'bg-gray-300'
              }`}
            />
          </div>
          <Text className="text-[11px] text-gray-500 truncate block">
            {companyName} · {alumni.department || '未知部门'}
          </Text>
        </div>
      </div>
      {(alumni.position || alumni.grade) && (
        <div className="text-[11px] text-gray-500 mb-3 space-y-0.5">
          {alumni.position && <div>职位: {alumni.position}</div>}
          {alumni.grade && (
            <div>
              {alumni.grade}
              {alumni.major ? ` · ${alumni.major}` : ''}
            </div>
          )}
        </div>
      )}
      <div className="flex gap-2">
        <Button
          type="primary"
          size="mini"
          className="flex-1"
          icon={<MessageSquareText size={12} />}
          onClick={onChat}
        >
          私信
        </Button>
        <Button
          size="mini"
          className="flex-1"
          onClick={onProfile}
        >
          主页
        </Button>
      </div>
    </div>
  </div>
);

// 构建力导向图配置
const buildGraphOption = (
  data: IAlumniNetworkData,
  searchKeyword: string,
): echarts.EChartsOption => {
  const nodes: any[] = [];
  const links: any[] = [];
  const categories = [
    { name: '学校', itemStyle: { color: PALETTE.school } },
    { name: '公司', itemStyle: { color: PALETTE.company } },
    { name: '校友', itemStyle: { color: PALETTE.alumni } },
  ];

  const isMatch = (text: string) => {
    if (!searchKeyword) return true;
    return text.toLowerCase().includes(searchKeyword.toLowerCase());
  };

  // 学校中心节点
  const schoolId = `school_${data.school}`;
  const schoolMatched = isMatch(data.school);
  nodes.push({
    id: schoolId,
    name: data.school,
    symbolSize: 58,
    category: 0,
    itemStyle: {
      color: PALETTE.school,
      shadowBlur: 25,
      shadowColor: `${PALETTE.school}55`,
      opacity: searchKeyword && !schoolMatched ? PALETTE.dimOpacity : 1,
      borderColor: 'rgba(255,255,255,0.3)',
      borderWidth: 2,
    },
    label: {
      show: true,
      fontSize: 13,
      fontWeight: 600,
      color: '#f0fdf4',
      textBorderColor: 'rgba(0,0,0,0.5)',
      textBorderWidth: 2,
      opacity: searchKeyword && !schoolMatched ? PALETTE.dimOpacity : 1,
    },
    nodeType: 'school',
  });

  // 公司及校友节点
  data.companies.forEach((company, idx) => {
    const companyId = `company_${company.companyName}`;
    const cColor = PALETTE.companySet[idx % PALETTE.companySet.length];
    const companyMatched = isMatch(company.companyName);
    const maxAlumni = Math.max(...data.companies.map((c) => c.alumniCount), 1);
    const ratio = company.alumniCount / maxAlumni;
    const companySize = 28 + ratio * 24;

    const hasMatchedAlumni = company.alumni.some(
      (a) => isMatch(a.username) || isMatch(company.companyName),
    );
    const visible = searchKeyword ? (companyMatched || hasMatchedAlumni) : true;

    nodes.push({
      id: companyId,
      name: `${company.companyName} (${company.alumniCount})`,
      symbolSize: companySize,
      category: 1,
      itemStyle: {
        color: cColor,
        shadowBlur: visible ? 8 : 0,
        shadowColor: visible ? `${cColor}35` : 'transparent',
        opacity: visible ? 1 : PALETTE.dimOpacity,
        borderColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
      },
      label: {
        show: company.alumniCount >= 2 || visible,
        fontSize: 10,
        color: '#e5e7eb',
        textBorderColor: 'rgba(0,0,0,0.45)',
        textBorderWidth: 1.5,
        opacity: visible ? 1 : PALETTE.dimOpacity,
      },
      nodeType: 'company',
      companyId: company.companyId,
      companyName: company.companyName,
    });

    links.push({
      source: schoolId,
      target: companyId,
      lineStyle: {
        color: PALETTE.edgeSchool,
        width: 1.2 + ratio * 2,
        opacity: visible ? 0.5 : PALETTE.dimOpacity,
      },
    });

    company.alumni.forEach((alumni) => {
      const alumniId = `alumni_${alumni.id}`;
      const alumniMatched = isMatch(alumni.username) || companyMatched;
      const aVisible = searchKeyword ? alumniMatched : true;

      nodes.push({
        id: alumniId,
        name: alumni.username,
        symbolSize: searchKeyword && alumniMatched ? 24 : 15,
        category: 2,
        itemStyle: {
          color: cColor,
          borderColor: alumni.online ? '#34d399' : '#6b7280',
          borderWidth: 1.5,
          opacity: aVisible ? 0.85 : PALETTE.dimOpacity,
        },
        label: {
          show: aVisible,
          fontSize: 9,
          color: '#d1d5db',
          textBorderColor: 'rgba(0,0,0,0.4)',
          textBorderWidth: 1,
          opacity: aVisible ? 0.9 : PALETTE.dimOpacity,
        },
        nodeType: 'alumni',
        alumniData: alumni,
        companyName: company.companyName,
      });

      links.push({
        source: companyId,
        target: alumniId,
        lineStyle: {
          color: PALETTE.edgeAlumni,
          width: 0.8,
          opacity: aVisible ? 0.3 : PALETTE.dimOpacity,
        },
      });
    });
  });

  return {
    tooltip: { show: false },
    legend: {
      data: categories.map((c) => c.name),
      bottom: 12,
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#9ca3af', fontSize: 11 },
      itemGap: 20,
    },
    animationDuration: 1200,
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
          repulsion: 550,
          gravity: 0.07,
          edgeLength: [50, 200],
          friction: 0.55,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { color: PALETTE.focusEdge, width: 2.5 },
          itemStyle: { shadowBlur: 15 },
        },
        lineStyle: { curveness: 0.15 },
        scaleLimit: { min: 0.3, max: 3 },
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredAlumni, setHoveredAlumni] = useState<{
    alumni: IAlumniNode;
    companyName: string;
    position: { x: number; y: number };
  } | null>(null);

  // 查询数据
  const { data, isLoading } = useQuery({
    queryKey: ['alumni-network', gradeFilter],
    queryFn: () =>
      getAlumniNetwork({ grade: gradeFilter }).then((res) => res.data.data),
    staleTime: 1000 * 60 * 2,
  });

  const graphOption = useMemo(() => {
    if (!data || data.totalAlumni === 0) return null;
    return buildGraphOption(data, activeSearch);
  }, [data, activeSearch]);

  // 初始化 ECharts
  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(chartContainerRef.current, 'dark');
    }
    const handleResize = () => chartRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.dispose();
      chartRef.current = undefined;
    };
  }, []);

  // 更新图表
  useEffect(() => {
    if (!chartRef.current || !graphOption) return;
    chartRef.current.setOption(graphOption, true);
  }, [graphOption]);

  // 全屏切换时 resize
  useEffect(() => {
    setTimeout(() => chartRef.current?.resize(), 100);
  }, [isFullscreen]);

  // 图表交互事件
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const handleClick = (params: any) => {
      const nd = params.data;
      if (!nd?.nodeType) return;
      if (nd.nodeType === 'company' && nd.companyId) {
        navigate(`/navigator/info/company?id=${nd.companyId}`);
      }
      if (nd.nodeType === 'alumni' && nd.alumniData) {
        navigate(`/navigator/profile?id=${nd.alumniData.id}`);
      }
    };

    const handleMouseOver = (params: any) => {
      const nd = params.data;
      if (!nd?.nodeType || nd.nodeType !== 'alumni') {
        setHoveredAlumni(null);
        return;
      }
      setHoveredAlumni({
        alumni: nd.alumniData,
        companyName: nd.companyName,
        position: {
          x: params.event?.offsetX ?? 200,
          y: params.event?.offsetY ?? 200,
        },
      });
    };

    const handleMouseOut = () => setHoveredAlumni(null);

    chart.on('click', handleClick);
    chart.on('mouseover', handleMouseOver);
    chart.on('mouseout', handleMouseOut);

    return () => {
      chart.off('click', handleClick);
      chart.off('mouseover', handleMouseOver);
      chart.off('mouseout', handleMouseOut);
    };
  }, [navigate]);

  const handleSearch = useCallback((value: string) => {
    setActiveSearch(value.trim());
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // 统计
  const totalAlumni = data?.totalAlumni ?? 0;
  const companyCount = data?.companies?.length ?? 0;
  const topCompany = data?.companies?.[0]?.companyName || '-';
  const gradeCount = data?.grades?.length ?? 0;

  // 全屏容器样式
  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-[#0f1117] flex flex-col'
    : 'h-full flex flex-col bg-[#0f1117]';

  return (
    <div className={containerClass}>
      {/* 顶部工具条 - 深色调，贴合图谱 */}
      <div className="flex-shrink-0 border-b border-gray-800/60">
        <div className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          {/* 左侧 - 标题 + 统计数字 */}
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-[15px] font-semibold text-gray-100 leading-none mb-1">
                校友图谱
              </h1>
              {data?.school && (
                <span className="text-[11px] text-gray-500">{data.school}</span>
              )}
            </div>

            {/* 内联数据指标 */}
            {!isLoading && data && (
              <div className="hidden sm:flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Users size={12} />
                  <span className="text-gray-400">{totalAlumni}</span>
                  <span className="text-gray-600">人</span>
                </span>
                <span className="w-px h-3 bg-gray-700" />
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Building2 size={12} />
                  <span className="text-gray-400">{companyCount}</span>
                  <span className="text-gray-600">家</span>
                </span>
                <span className="w-px h-3 bg-gray-700" />
                <span className="flex items-center gap-1.5 text-purple-400">
                  <GraduationCap size={12} />
                  <span className="text-gray-400">{gradeCount}</span>
                  <span className="text-gray-600">届</span>
                </span>
                {topCompany !== '-' && (
                  <>
                    <span className="w-px h-3 bg-gray-700" />
                    <Tag size="small" className="!bg-gray-800 !border-gray-700 !text-gray-400 !text-[10px]">
                      Top: {topCompany}
                    </Tag>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 右侧 - 筛选器 */}
          <div className="flex items-center gap-2">
            {data?.grades && data.grades.length > 0 && (
              <Select
                placeholder="届别"
                allowClear
                size="small"
                style={{ width: 110 }}
                value={gradeFilter}
                onChange={(val) => setGradeFilter(val || undefined)}
                options={data.grades.map((g) => ({ label: g, value: g }))}
                triggerProps={{ className: 'alumni-select-popup' }}
              />
            )}
            <Input.Search
              placeholder="搜索校友或公司"
              prefix={<IconSearch />}
              size="small"
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              onClear={() => { setSearchValue(''); setActiveSearch(''); }}
              allowClear
              style={{ width: 180 }}
            />
            <button
              type="button"
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
              onClick={handleToggleFullscreen}
              aria-label={isFullscreen ? '退出全屏' : '全屏'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* 图谱区域 */}
      <div className="flex-1 relative overflow-hidden">
        <Skeleton loading={isLoading} animation className="h-full p-8">
          {data && data.totalAlumni > 0 ? (
            <>
              {/* ECharts 图谱 */}
              <div
                ref={chartContainerRef}
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a1d2e 0%, #0f1117 70%)' }}
              />

              {/* 网格底纹 */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '48px 48px',
                }}
              />

              {/* 搜索状态标签 */}
              {activeSearch && (
                <div className="absolute top-3 left-4 z-10 flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 text-gray-300 text-[11px] px-3 py-1.5 rounded-md">
                  <IconSearch style={{ fontSize: 12 }} className="text-gray-500" />
                  <span>{activeSearch}</span>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-300 ml-1"
                    onClick={() => { setSearchValue(''); setActiveSearch(''); }}
                    aria-label="清除搜索"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* 底部操作提示 */}
              <div className="absolute bottom-3 left-4 z-10 text-[10px] text-gray-600 flex items-center gap-3">
                <span>滚轮缩放</span>
                <span>·</span>
                <span>拖拽平移</span>
                <span>·</span>
                <span>点击节点跳转</span>
              </div>

              {/* 校友悬浮卡片 */}
              {hoveredAlumni && (
                <div
                  className="absolute z-50 bg-white rounded-lg shadow-2xl border border-gray-200"
                  style={{
                    left: Math.min(hoveredAlumni.position.x + 16, (chartContainerRef.current?.clientWidth || 800) - 260),
                    top: Math.max(hoveredAlumni.position.y - 50, 8),
                    pointerEvents: 'auto',
                  }}
                  onMouseLeave={() => setHoveredAlumni(null)}
                >
                  <AlumniHoverCard
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
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <Empty
                description={
                  <div className="space-y-2 text-center">
                    <Text className="text-gray-400 block">
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
      </div>
    </div>
  );
});

export default AlumniNetworkPage;
