import { useState, useCallback } from 'react';
import {
  Typography,
  Tag,
  Avatar,
  Skeleton,
  Empty,
  Button,
  Divider,
  Message,
} from '@arco-design/web-react';
import { IconLeft } from '@arco-design/web-react/icon';
import { Heart, Eye, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  ROUND_LABELS,
  DIFFICULTY_LABELS,
  CATEGORY_LABELS,
  DIFFICULTY_COLORS,
} from '@/types/interview';
import { getInterviewDetailApi, toggleInterviewLikeApi } from '@/service/interview';
import { apiConfig } from '@/config';

const { Title, Text } = Typography;

const InterviewDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '';
  const queryClient = useQueryClient();
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});

  const { data: post, isLoading } = useQuery({
    queryKey: ['interviewDetail', id],
    queryFn: () => getInterviewDetailApi(id).then((res) => res.data),
    enabled: !!id,
  });

  const { mutateAsync: toggleLike } = useMutation({
    mutationFn: () => toggleInterviewLikeApi(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['interviewDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['hotInterviews'] });
      Message.success(res.data.isLiked ? '已点赞' : '已取消点赞');
    },
  });

  const handleToggleAnswer = useCallback((index: number) => {
    setShowAnswers((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const handleBack = useCallback(() => {
    navigate('/navigator/campus');
  }, [navigate]);

  if (!id) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <Empty description="无效的面经链接" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <Button
            type="text"
            icon={<IconLeft />}
            onClick={handleBack}
            className="!text-gray-600"
          >
            返回面经列表
          </Button>
          {post && (
            <div className="flex items-center gap-3">
              <Button
                type={post.isLiked ? 'primary' : 'outline'}
                size="small"
                icon={<Heart size={14} />}
                onClick={() => toggleLike()}
              >
                {post.isLiked ? '已点赞' : '点赞'} {post.metadata?.likeCount ?? 0}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 主体内容 */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <Skeleton loading={isLoading} animation text={{ rows: 12 }}>
          {!post ? (
            <Empty description="面经不存在或已被删除" />
          ) : (
            <div className="space-y-6">
              {/* 标题区域 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <Title heading={3} className="!mb-3">
                  {post.title}
                </Title>

                {/* 标签行 */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {post.companyName && (
                    <Tag color="arcoblue" size="medium">
                      {post.companyName}
                    </Tag>
                  )}
                  {post.position && (
                    <Tag bordered size="medium">
                      {post.position}
                    </Tag>
                  )}
                  <Tag color="purple" size="medium">
                    {ROUND_LABELS[post.round]}
                  </Tag>
                  <Tag color={DIFFICULTY_COLORS[post.difficulty]} size="medium">
                    {DIFFICULTY_LABELS[post.difficulty]}
                  </Tag>
                  <Tag color="cyan" size="medium">
                    {CATEGORY_LABELS[post.category]}
                  </Tag>
                </div>

                {/* 作者信息 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar size={36}>
                      {post.creator?.avatar ? (
                        <img
                          src={apiConfig.baseUrl + post.creator.avatar}
                          alt={post.creator.username}
                        />
                      ) : (
                        post.creator?.username?.[0] || 'U'
                      )}
                    </Avatar>
                    <div>
                      <Text className="text-[14px] font-medium text-gray-800 block">
                        {post.creator?.username || '匿名用户'}
                      </Text>
                      {post.creator?.school && (
                        <Text className="text-[12px] text-gray-400">
                          {post.creator.school}
                          {post.creator.techDirection && ` · ${post.creator.techDirection}`}
                        </Text>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[13px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {post.metadata?.viewCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {post.metadata?.likeCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {post.metadata?.commentCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {dayjs(post.createdAt).format('YYYY-MM-DD')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 面试题目列表 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <Title heading={5} className="!mb-4 flex items-center gap-2">
                  <AlertCircle size={18} className="text-primary" />
                  面试题目（共 {post.content?.questions?.length || 0} 题）
                </Title>

                <div className="space-y-4">
                  {post.content?.questions?.map((q, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 overflow-hidden"
                    >
                      {/* 题目 */}
                      <div className="flex items-start gap-3 p-4 bg-gray-50">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <Text className="text-[14px] text-gray-800 font-medium">
                            {q.question}
                          </Text>
                          {q.type && (
                            <Tag size="small" className="mt-1" bordered>
                              {q.type}
                            </Tag>
                          )}
                        </div>
                      </div>

                      {/* 答案区域 */}
                      {q.answer && (
                        <div className="px-4 pb-3 pt-2">
                          <Button
                            type="text"
                            size="small"
                            className="!text-primary"
                            icon={
                              showAnswers[index] ? (
                                <CheckCircle size={14} />
                              ) : (
                                <Eye size={14} />
                              )
                            }
                            onClick={() => handleToggleAnswer(index)}
                          >
                            {showAnswers[index] ? '收起答案' : '查看参考答案'}
                          </Button>

                          {showAnswers[index] && (
                            <div className="mt-2 p-3 bg-green-50 rounded-lg text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {q.answer}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 总结和Tips */}
              {(post.content?.summary || post.content?.tips) && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                  {post.content.summary && (
                    <div>
                      <Title heading={6} className="!mb-2">
                        📝 面经总结
                      </Title>
                      <Text className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {post.content.summary}
                      </Text>
                    </div>
                  )}

                  {post.content.summary && post.content.tips && <Divider className="!my-3" />}

                  {post.content.tips && (
                    <div>
                      <Title heading={6} className="!mb-2">
                        💡 面试Tips
                      </Title>
                      <Text className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {post.content.tips}
                      </Text>
                    </div>
                  )}
                </div>
              )}

              {/* 标签 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Tag key={tag} color="arcoblue" size="small" bordered>
                      #{tag}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          )}
        </Skeleton>
      </div>
    </div>
  );
};

export default InterviewDetail;
