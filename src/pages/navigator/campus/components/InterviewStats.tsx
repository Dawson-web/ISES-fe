import { Typography, Tag, Skeleton, Empty, Divider } from '@arco-design/web-react';
import { Flame, BarChart3, Building2, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  IInterviewPost,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  ROUND_LABELS,
  CATEGORY_LABELS,
} from '@/types/interview';
import { getHotInterviewsApi, getInterviewStatsApi } from '@/service/interview';

const { Text } = Typography;

interface InterviewStatsProps {
  onViewDetail: (id: string) => void;
}

const InterviewStats = ({ onViewDetail }: InterviewStatsProps) => {
  // 热门面经
  const { data: hotData, isLoading: hotLoading } = useQuery({
    queryKey: ['hotInterviews'],
    queryFn: () => getHotInterviewsApi().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  // 统计数据
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['interviewStats'],
    queryFn: () => getInterviewStatsApi().then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });

  const hotList: IInterviewPost[] = hotData || [];

  return (
    <div className="space-y-4">
      {/* 热门面经 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
          <Flame size={14} className="text-orange-500" />
          <span className="text-[13px] font-medium text-gray-700">热门面经</span>
        </div>

        <Skeleton loading={hotLoading} animation text={{ rows: 5 }}>
          {hotList.length === 0 ? (
            <div className="py-8">
              <Empty description="暂无热门面经" />
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {hotList.slice(0, 8).map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onViewDetail(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onViewDetail(item.id);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`查看面经：${item.title}`}
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded text-xs flex items-center justify-center font-bold ${
                      index < 3
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-gray-800 line-clamp-1 font-medium">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Text className="text-[11px] text-gray-400">
                        {item.companyName}
                      </Text>
                      <Tag
                        color={DIFFICULTY_COLORS[item.difficulty]}
                        size="small"
                        className="!text-[10px] !px-1 !py-0"
                      >
                        {DIFFICULTY_LABELS[item.difficulty]}
                      </Tag>
                      <Text className="text-[11px] text-gray-400">
                        {item.metadata?.viewCount ?? 0} 浏览
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Skeleton>
      </div>

      {/* 统计看板 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
          <BarChart3 size={14} className="text-blue-500" />
          <span className="text-[13px] font-medium text-gray-700">面经统计</span>
        </div>

        <Skeleton loading={statsLoading} animation text={{ rows: 4 }}>
          {statsData ? (
            <div className="p-4 space-y-4">
              {/* 总数 */}
              <div className="flex items-center justify-center gap-2 py-3 bg-primary-50 rounded-lg">
                <TrendingUp size={18} className="text-primary" />
                <span className="text-2xl font-bold text-primary">
                  {statsData.totalCount}
                </span>
                <span className="text-sm text-gray-500">篇面经</span>
              </div>

              {/* 热门公司 TOP5 */}
              {statsData.companyStats && statsData.companyStats.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Building2 size={14} className="text-gray-400" />
                    <Text className="text-[12px] font-medium text-gray-600">热门公司</Text>
                  </div>
                  <div className="space-y-1.5">
                    {statsData.companyStats.slice(0, 5).map((stat) => (
                      <div key={stat.companyName} className="flex items-center justify-between">
                        <Text className="text-[12px] text-gray-700 line-clamp-1 flex-1">
                          {stat.companyName}
                        </Text>
                        <Tag size="small" color="arcoblue" className="!text-[10px]">
                          {stat.count} 篇
                        </Tag>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Divider className="!my-2" />

              {/* 轮次分布 */}
              {statsData.roundStats && statsData.roundStats.length > 0 && (
                <div>
                  <Text className="text-[12px] font-medium text-gray-600 mb-2 block">
                    轮次分布
                  </Text>
                  <div className="flex flex-wrap gap-1.5">
                    {statsData.roundStats.map((stat) => (
                      <Tag key={stat.round} bordered size="small">
                        {ROUND_LABELS[stat.round as keyof typeof ROUND_LABELS] || stat.round}{' '}
                        {stat.count}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* 类型分布 */}
              {statsData.categoryStats && statsData.categoryStats.length > 0 && (
                <div>
                  <Text className="text-[12px] font-medium text-gray-600 mb-2 block">
                    类型分布
                  </Text>
                  <div className="flex flex-wrap gap-1.5">
                    {statsData.categoryStats.map((stat) => (
                      <Tag key={stat.category} bordered size="small" color="cyan">
                        {CATEGORY_LABELS[stat.category as keyof typeof CATEGORY_LABELS] || stat.category}{' '}
                        {stat.count}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8">
              <Empty description="暂无统计数据" />
            </div>
          )}
        </Skeleton>
      </div>
    </div>
  );
};

export default InterviewStats;
