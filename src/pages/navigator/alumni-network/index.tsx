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
import { Building2, GraduationCap, Users, Maximize2, Minimize2 } from 'lucide-react';
import { getAlumniNetwork } from '@/service/user';
import userStore from '@/store/User';
import { apiConfig } from '@/config';
import type { IAlumniNetworkData, IAlumniNode } from '@/types/user';

const { Text } = Typography;

// 色板 - 白底场景下的低饱和配色
const PALETTE = {
  // 节点颜色
  school: '#059669',
  company: '#2563eb',
  alumni: '#d97706',
  // 公司节点渐变色 - 取自自然色
  companySet: ['#2563eb', '#0891b2', '#7c3aed', '#c026d3', '#e11d48', '#ea580c'],
  // 连线
  edgeSchool: 'rgba(5, 150, 105, 0.3)',
  // 高亮
  focusEdge: 'rgba(37, 99, 235, 0.72)',
  dimOpacity: 0.1,
};

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getAvatarUrl = (avatar?: string | null) => {
  if (!avatar) return '';
  if (/^(https?:)?\/\//.test(avatar) || avatar.startsWith('data:')) return avatar;
  return `${apiConfig.baseUrl}${avatar}`;
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
  onChat?: () => void;
  onProfile?: () => void;
}) => {
  void onChat;
  void onProfile;
  const avatarUrl = getAvatarUrl(alumni.avatar);

  return (
    <div className="w-60">
      <div className="p-3.5">
        <div className="flex items-center gap-3 mb-3">
          <Avatar size={38} className="text-white font-bold bg-amber-600 flex-shrink-0 !cursor-pointer">
            {avatarUrl ? <img src={avatarUrl} alt="avatar" /> : alumni.username.charAt(0)}
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-gray-900 text-[13px] truncate">{alumni.username}</span>
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${alumni.online ? 'bg-emerald-400' : 'bg-gray-300'
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
        {/* <div className="flex gap-2">
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
      </div> */}
      </div>
    </div>
  );
};

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
      shadowBlur: 30,
      shadowColor: `${PALETTE.school}66`,
      opacity: searchKeyword && !schoolMatched ? PALETTE.dimOpacity : 1,
      borderColor: 'rgba(15,23,42,0.15)',
      borderWidth: 2,
    },
    label: {
      show: true,
      fontSize: 13,
      fontWeight: 600,
      color: '#064e3b',
      backgroundColor: 'rgba(255,255,255,0.92)',
      borderRadius: 999,
      padding: [5, 10],
      textBorderColor: 'rgba(255,255,255,0.95)',
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
    const companyLogoUrl = getAvatarUrl(company.companyLogo);

    const hasMatchedAlumni = company.alumni.some(
      (a) => isMatch(a.username) || isMatch(company.companyName),
    );
    const visible = searchKeyword ? (companyMatched || hasMatchedAlumni) : true;

    nodes.push({
      id: companyId,
      name: company.companyName,
      symbol: companyLogoUrl ? `image://${companyLogoUrl}` : 'circle',
      symbolKeepAspect: true,
      symbolSize: companySize,
      category: 1,
      itemStyle: {
        color: cColor,
        shadowBlur: visible ? 18 : 0,
        shadowColor: visible ? hexToRgba(cColor, 0.28) : 'transparent',
        opacity: visible ? 1 : PALETTE.dimOpacity,
        borderColor: hexToRgba(cColor, companyLogoUrl ? 0.65 : 0.35),
        borderWidth: companyLogoUrl ? 3 : 1.5,
      },
      label: {
        show: visible,
        position: 'bottom',
        distance: 8,
        fontSize: company.alumniCount >= 6 ? 12 : 11,
        fontWeight: 600,
        color: '#334155',
        backgroundColor: 'rgba(255,255,255,0.94)',
        borderRadius: 999,
        padding: [4, 8],
        formatter: `${company.companyName}\n${company.alumniCount} 人`,
        lineHeight: 16,
        textBorderColor: 'rgba(255,255,255,0.95)',
        textBorderWidth: 1,
        opacity: visible ? 1 : PALETTE.dimOpacity,
      },
      nodeType: 'company',
      companyId: company.companyId,
      companyName: company.companyName,
      companyLogo: company.companyLogo,
    });

    links.push({
      source: schoolId,
      target: companyId,
      lineStyle: {
        color: PALETTE.edgeSchool,
        width: 1.6 + ratio * 2.8,
        opacity: visible ? 0.62 : PALETTE.dimOpacity,
      },
    });

    company.alumni.forEach((alumni) => {
      const alumniId = `alumni_${alumni.id}`;
      const alumniMatched = isMatch(alumni.username) || companyMatched;
      const aVisible = searchKeyword ? alumniMatched : true;
      const avatarUrl = getAvatarUrl(alumni.avatar);
      const alumniSize = searchKeyword && alumniMatched ? 30 : 22;

      nodes.push({
        id: alumniId,
        name: alumni.username,
        symbol: avatarUrl ? `image://${avatarUrl}` : 'circle',
        symbolSize: alumniSize,
        category: 2,
        itemStyle: {
          color: cColor,
          borderColor: alumni.online ? '#34d399' : '#94a3b8',
          borderWidth: 2,
          shadowBlur: aVisible ? 8 : 0,
          shadowColor: aVisible ? 'rgba(15,23,42,0.16)' : 'transparent',
          opacity: aVisible ? 1 : PALETTE.dimOpacity,
        },
        label: {
          show: aVisible,
          position: 'bottom',
          distance: 6,
          fontSize: 10,
          fontWeight: 500,
          color: '#334155',
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: 4,
          padding: [2, 4],
          formatter: alumni.username.length > 8 ? `${alumni.username.slice(0, 8)}…` : alumni.username,
          textBorderColor: 'rgba(255,255,255,0.95)',
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
          color: hexToRgba(cColor, aVisible ? 0.34 : PALETTE.dimOpacity),
          width: searchKeyword && alumniMatched ? 1.9 : 1.35,
          opacity: aVisible ? 0.82 : PALETTE.dimOpacity,
        },
      });
    });
  });

  return {
    backgroundColor: '#ffffff',
    tooltip: { show: false },
    legend: {
      data: categories.map((c) => c.name),
      bottom: 12,
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#6b7280', fontSize: 11 },
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
          repulsion: 700,
          gravity: 0.05,
          edgeLength: [80, 240],
          friction: 0.5,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { color: PALETTE.focusEdge, width: 3.2, opacity: 1 },
          itemStyle: { shadowBlur: 20 },
        },
        lineStyle: { curveness: 0.15 },
        labelLayout: {
          hideOverlap: true,
        },
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
  const totalAlumni = data?.totalAlumni ?? 0;

  const graphOption = useMemo(() => {
    if (!data || totalAlumni === 0) return null;
    return buildGraphOption(data, activeSearch);
  }, [data, totalAlumni, activeSearch]);

  // 统一窗口 resize，组件销毁时释放图表
  useEffect(() => {
    const handleResize = () => chartRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.dispose();
      chartRef.current = undefined;
    };
  }, []);

  // 无数据时释放图表实例
  useEffect(() => {
    if (totalAlumni === 0) {
      chartRef.current?.dispose();
      chartRef.current = undefined;
    }
  }, [totalAlumni]);

  // 图表实例与配置联动：等待容器尺寸稳定后再渲染，修复首屏偶发空白
  useEffect(() => {
    if (!graphOption || !chartContainerRef.current) return;

    const container = chartContainerRef.current;
    if (!chartRef.current || chartRef.current.isDisposed()) {
      chartRef.current = echarts.init(container);
    }

    const applyOption = () => {
      if (!chartRef.current || chartRef.current.isDisposed()) return;
      if (container.clientWidth === 0 || container.clientHeight === 0) return;
      chartRef.current.setOption(graphOption, true);
      chartRef.current.resize();
    };

    const frame = window.requestAnimationFrame(applyOption);
    const retryTimers = [120, 360].map((delay) =>
      window.setTimeout(applyOption, delay),
    );

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
        applyOption();
      })
      : null;
    observer?.observe(container);

    return () => {
      window.cancelAnimationFrame(frame);
      retryTimers.forEach((timer) => window.clearTimeout(timer));
      observer?.disconnect();
    };
  }, [graphOption, isFullscreen]);

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
        navigate(`/navigator/info/company?companyId=${nd.companyId}`);
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
  }, [navigate, data?.totalAlumni]);

  const handleSearch = useCallback((value: string) => {
    setActiveSearch(value.trim());
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // 统计
  const companyCount = data?.companies?.length ?? 0;
  const topCompany = data?.companies?.[0]?.companyName || '-';
  const gradeCount = data?.grades?.length ?? 0;
  const companyRanking = useMemo(
    () => (data?.companies || []).slice().sort((a, b) => b.alumniCount - a.alumniCount).slice(0, 5),
    [data?.companies],
  );

  // 全屏容器样式
  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-white flex flex-col'
    : 'h-full flex flex-col bg-white';

  return (
    <div className={containerClass}>
      {/* 顶部工具条 */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white/90">
        <div className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          {/* 左侧 - 标题 + 统计数字 */}
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-[15px] font-semibold text-gray-900 leading-none mb-1">
                校友图谱
              </h1>
              {data?.school && (
                <span className="text-[11px] text-gray-500">{data.school}</span>
              )}
            </div>

            {/* 内联数据指标 */}
            {!isLoading && data && (
              <div className="hidden sm:flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <Users size={12} />
                  <span className="text-gray-700">{totalAlumni}</span>
                  <span className="text-gray-500">人</span>
                </span>
                <span className="w-px h-3 bg-gray-300" />
                <span className="flex items-center gap-1.5 text-blue-600">
                  <Building2 size={12} />
                  <span className="text-gray-700">{companyCount}</span>
                  <span className="text-gray-500">家</span>
                </span>
                <span className="w-px h-3 bg-gray-300" />
                <span className="flex items-center gap-1.5 text-violet-600">
                  <GraduationCap size={12} />
                  <span className="text-gray-700">{gradeCount}</span>
                  <span className="text-gray-500">届</span>
                </span>
                {topCompany !== '-' && (
                  <>
                    <span className="w-px h-3 bg-gray-300" />
                    <Tag size="small" className="!bg-gray-100 !border-gray-200 !text-gray-600 !text-[10px]">
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
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
                style={{
                  background: `
                    radial-gradient(circle at 50% 50%, rgba(5,150,105,0.06), transparent 24%),
                    radial-gradient(circle at 82% 78%, rgba(37,99,235,0.06), transparent 20%),
                    radial-gradient(circle at 18% 22%, rgba(217,119,6,0.04), transparent 18%),
                    #ffffff
                  `,
                }}
              />

              {/* 网格底纹 */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(15,23,42,0.025) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(15,23,42,0.025) 1px, transparent 1px)
                  `,
                  backgroundSize: '48px 48px',
                }}
              />

              {/* 搜索状态标签 */}
              {activeSearch && (
                <div className="absolute top-3 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 text-[11px] px-3 py-1.5 rounded-md shadow-sm">
                  <IconSearch style={{ fontSize: 12 }} className="text-gray-400" />
                  <span>{activeSearch}</span>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-700 ml-1"
                    onClick={() => { setSearchValue(''); setActiveSearch(''); }}
                    aria-label="清除搜索"
                  >
                    ✕
                  </button>
                </div>
              )}

              {companyRanking.length > 0 && (
                <div className="absolute top-4 right-4 z-10 hidden xl:block w-64 rounded-2xl border border-gray-200/90 bg-white/88 backdrop-blur-md shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-[12px] font-semibold text-gray-900">热门去向</div>
                    <div className="text-[10px] text-gray-500 mt-1">按当前图谱中的校友人数排序</div>
                  </div>
                  <div className="p-3 space-y-2.5">
                    {companyRanking.map((company, index) => {
                      const color = PALETTE.companySet[index % PALETTE.companySet.length];
                      const companyLogoUrl = getAvatarUrl(company.companyLogo);
                      return (
                        <button
                          key={company.companyId || company.companyName}
                          type="button"
                          className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left transition-colors hover:bg-gray-50"
                          onClick={() => navigate(`/navigator/info/company?companyId=${company.companyId}`)}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar
                              size={28}
                              className="flex-shrink-0 border border-white shadow-sm"
                              style={{
                                backgroundColor: hexToRgba(color, 0.14),
                                color,
                                boxShadow: `0 0 0 4px ${hexToRgba(color, 0.12)}`,
                              }}
                            >
                              {companyLogoUrl ? <img src={companyLogoUrl} alt={company.companyName} /> : company.companyName.charAt(0)}
                            </Avatar>
                            <span className="truncate text-[12px] font-medium text-gray-700">
                              {company.companyName}
                            </span>
                          </div>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                            {company.alumniCount} 人
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 底部操作提示 */}
              <div className="absolute bottom-3 left-4 z-10 rounded-full border border-gray-200/80 bg-white/88 px-3 py-1.5 text-[10px] text-gray-500 flex items-center gap-3 shadow-sm backdrop-blur-sm">
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
                      const query = new URLSearchParams({
                        userId: hoveredAlumni.alumni.id,
                        username: hoveredAlumni.alumni.username || "",
                      });
                      navigate(`/navigator/chat?${query.toString()}`);
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
