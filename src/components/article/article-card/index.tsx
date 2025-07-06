import React from 'react';
import { Card, Avatar, Tag, Space, Button, Typography } from '@arco-design/web-react';
import { IconHeart, IconMessage, IconStar, IconEye, IconSchedule, IconUser } from '@arco-design/web-react/icon';
import { IContent } from '@/types/article';

interface ArticleCardProps {
  content: IContent;
  onCardClick?: (content: IContent) => void;
  onAuthorClick?: (authorId: string) => void;
  onLike?: (contentId: string) => void;
  onFavorite?: (contentId: string) => void;
  className?: string;
}

const { Text, Title } = Typography;

// 格式化相对时间
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString();
  }
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  content,
  onCardClick,
  onAuthorClick,
  onLike,
  onFavorite,
  className = ''
}) => {
  const {
    id,
    title,
    metadata,
    creator,
    createdAt,
    updatedAt
  } = content;

  const {
    excerpt,
    tags = [],
    category,
    viewCount = 0,
    likeCount = 0,
    commentCount = 0,
    readTime = 0,
    featured = false,
    rating = 0
  } = metadata;

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCardClick?.(content);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAuthorClick?.(creator?.id || '');
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(id);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(id);
  };

    // 根据分类获取颜色
  const getCategoryColor = (category: string) => {
    const colors = {
      '技术': '#3370ff',
      '设计': '#00d6b9', 
      '产品': '#ff7d00',
      '运营': '#f53f3f',
      '管理': '#722ed1',
      '其他': '#86909c'
    };
    return colors[category as keyof typeof colors] || colors['其他'];
  };

  return (
    <div
      className={`group bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden h-full ${className}`}
      onClick={handleCardClick}
    >      
      {/* 左侧色彩条 */}
      <div className="flex h-full">
        <div 
          className="w-1 flex-shrink-0" 
          style={{ backgroundColor: getCategoryColor(category || '其他') }}
        ></div>
        
        <div className="flex-1 p-4 flex flex-col">
          {/* 头部区域 */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <Title 
                heading={6} 
                className="line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-relaxed"
                style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}
              >
                {title}
              </Title>
              {category && (
                <Text className="text-xs text-gray-500 mt-1">{category}</Text>
              )}
            </div>
            {rating > 0 && (
              <div className="flex items-center ml-3 flex-shrink-0">
                <IconStar className="text-yellow-500 text-sm mr-1" />
                <Text className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</Text>
              </div>
            )}
          </div>

          {/* 摘要 */}
          {excerpt && (
            <Text 
              className="line-clamp-3 text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4 flex-grow"
            >
              {excerpt}
            </Text>
          )}

          {/* 标签 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <Text type="secondary" className="text-xs self-center">
                  +{tags.length - 3}
                </Text>
              )}
            </div>
          )}

          {/* 底部信息 */}
          <div className="space-y-2 sm:space-y-3 mt-auto">
            {/* 作者信息 */}
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center cursor-pointer hover:bg-gray-50 rounded-lg px-1.5 sm:px-2 py-1 -mx-1.5 sm:-mx-2 transition-colors min-w-0 flex-1"
                onClick={handleAuthorClick}
              >
                <Avatar 
                  size={24} 
                  className="mr-2 border-2 border-white shadow-sm flex-shrink-0"
                >
                  {creator?.avatar ? (
                    <img src={creator.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    creator?.username?.[0] || <IconUser />
                  )}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <Text className="text-xs sm:text-sm font-medium text-gray-900 truncate">{creator?.username || '匿名用户'}</Text>
                </div>
              </div>
              
              <Text type="secondary" className="text-xs flex-shrink-0 ml-2">
                {formatRelativeTime(createdAt)}
              </Text>
            </div>

            {/* 统计信息和操作 */}
            <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                  <IconEye className="mr-0.5 sm:mr-1 text-sm" />
                  <Text className="text-xs font-medium">{viewCount > 999 ? `${Math.floor(viewCount/1000)}k` : viewCount}</Text>
                </div>
                
                <div className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                  <IconMessage className="mr-0.5 sm:mr-1 text-sm" />
                  <Text className="text-xs font-medium">{commentCount}</Text>
                </div>
                
                {readTime > 0 && (
                  <div className="flex items-center text-gray-500 hidden sm:flex">
                    <IconSchedule className="mr-1 text-sm" />
                    <Text className="text-xs font-medium">{readTime}min</Text>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-0.5 sm:gap-1">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    likeCount > 0 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <IconHeart className="text-sm" />
                  {likeCount > 0 && <span className="hidden sm:inline">{likeCount}</span>}
                </button>
                
                <button
                  onClick={handleFavorite}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-yellow-50 hover:text-yellow-500 transition-all duration-200"
                >
                  <IconStar className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard; 