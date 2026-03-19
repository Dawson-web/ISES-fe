import { Avatar, Tag, Typography } from '@arco-design/web-react';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import dayjs from 'dayjs';
import {
  IInterviewPost,
  ROUND_LABELS,
  DIFFICULTY_LABELS,
  CATEGORY_LABELS,
  DIFFICULTY_COLORS,
} from '@/types/interview';
import { apiConfig } from '@/config';

const { Text } = Typography;

interface InterviewCardProps {
  item: IInterviewPost;
  onClick: (id: string) => void;
}

const InterviewCard = ({ item, onClick }: InterviewCardProps) => {
  const questionCount = item.content?.questions?.length ?? 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClick(item.id);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300 hover:bg-gray-50/50 cursor-pointer"
      onClick={() => onClick(item.id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`查看面经：${item.title}`}
    >
      <div className="p-4 flex gap-3">
        {/* 左侧头像 */}
        <div className="flex-shrink-0">
          <Avatar size={40} className="shadow-sm">
            {item.creator?.avatar ? (
              <img
                src={apiConfig.baseUrl + item.creator.avatar}
                alt={item.creator.username}
                className="w-full h-full object-cover"
              />
            ) : (
              item.creator?.username?.[0] || 'U'
            )}
          </Avatar>
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 min-w-0">
          {/* 标题行 */}
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-1 flex-1 min-w-0">
              {item.title}
            </h3>
            <Tag
              color={DIFFICULTY_COLORS[item.difficulty]}
              className="!text-xs !px-2 !py-0 flex-shrink-0"
            >
              {DIFFICULTY_LABELS[item.difficulty]}
            </Tag>
          </div>

          {/* 公司 + 岗位 + 标签 */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {item.companyName && (
              <Tag color="arcoblue" bordered size="small">
                {item.companyName}
              </Tag>
            )}
            {item.position && (
              <Tag bordered size="small">
                {item.position}
              </Tag>
            )}
            <Tag bordered size="small" color="purple">
              {ROUND_LABELS[item.round]}
            </Tag>
            <Tag bordered size="small" color="cyan">
              {CATEGORY_LABELS[item.category]}
            </Tag>
          </div>

          {/* 题目摘要 */}
          <div className="text-[13px] text-gray-600 line-clamp-1 mb-2">
            {questionCount > 0
              ? `${questionCount} 道面试题 · ${item.content.questions[0].question}`
              : item.content?.summary || '暂无摘要'}
          </div>

          {/* 底部：作者 + 数据统计 */}
          <div className="flex items-center justify-between">
            <Text className="text-[12px] text-gray-400">
              {item.creator?.username || '匿名用户'} · {dayjs(item.createdAt).format('YYYY/MM/DD')}
            </Text>

            <div className="flex items-center gap-3 text-[12px] text-gray-400">
              <span className="flex items-center gap-1">
                <Eye size={13} />
                {item.metadata?.viewCount ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={13} />
                {item.metadata?.likeCount ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={13} />
                {item.metadata?.commentCount ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 自定义标签 */}
      {item.tags && item.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1">
          {item.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewCard;
