import { useState, useCallback } from 'react';
import { Input, Select, Pagination, Skeleton, Empty, Tag, Button } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { PenLine } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  InterviewRound,
  InterviewDifficulty,
  InterviewCategory,
  ROUND_LABELS,
  DIFFICULTY_LABELS,
  CATEGORY_LABELS,
} from '@/types/interview';
import { getInterviewListApi } from '@/service/interview';
import InterviewCard from './InterviewCard';

interface InterviewListProps {
  onViewDetail: (id: string) => void;
  onOpenForm: () => void;
}

const ROUND_OPTIONS = Object.entries(ROUND_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const InterviewList = ({ onViewDetail, onOpenForm }: InterviewListProps) => {
  const [keyword, setKeyword] = useState('');
  const [round, setRound] = useState<InterviewRound | undefined>();
  const [difficulty, setDifficulty] = useState<InterviewDifficulty | undefined>();
  const [category, setCategory] = useState<InterviewCategory | undefined>();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ['interviewList', pagination, keyword, round, difficulty, category],
    queryFn: () =>
      getInterviewListApi({
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: keyword || undefined,
        round,
        difficulty,
        category,
      }).then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });

  const items = data?.items || [];
  const total = data?.pagination?.total || 0;

  const handleSearch = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleFilterChange = useCallback(
    (
      setter: (val: undefined) => void,
      value: string | undefined,
    ) => {
      setter(value as undefined);
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setKeyword('');
    setRound(undefined);
    setDifficulty(undefined);
    setCategory(undefined);
    setPagination({ page: 1, pageSize: 10 });
  }, []);

  const hasActiveFilter = !!keyword || !!round || !!difficulty || !!category;

  return (
    <div className="space-y-4">
      {/* 搜索和筛选区域 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            allowClear
            style={{ width: 260 }}
            prefix={<IconSearch />}
            placeholder="搜索公司、岗位、面试题目..."
            value={keyword}
            onChange={(val) => setKeyword(val)}
            onPressEnter={handleSearch}
          />

          <Select
            allowClear
            style={{ width: 130 }}
            placeholder="面试轮次"
            value={round}
            onChange={(val) => handleFilterChange(setRound as (val: undefined) => void, val)}
            options={ROUND_OPTIONS}
          />

          <Select
            allowClear
            style={{ width: 120 }}
            placeholder="难度"
            value={difficulty}
            onChange={(val) => handleFilterChange(setDifficulty as (val: undefined) => void, val)}
            options={DIFFICULTY_OPTIONS}
          />

          <Select
            allowClear
            style={{ width: 130 }}
            placeholder="面试类型"
            value={category}
            onChange={(val) => handleFilterChange(setCategory as (val: undefined) => void, val)}
            options={CATEGORY_OPTIONS}
          />

          {hasActiveFilter && (
            <Tag
              closable
              onClose={handleClearFilters}
              color="arcoblue"
              className="cursor-pointer"
            >
              清除筛选
            </Tag>
          )}

          <Button
            type="primary"
            icon={<PenLine size={14} />}
            className="ml-auto"
            onClick={onOpenForm}
          >
            分享面经
          </Button>
        </div>

        {/* 当前筛选条件提示 */}
        {hasActiveFilter && (
          <div className="text-xs text-gray-400">
            共找到 <span className="text-primary font-medium">{total}</span> 条面经
          </div>
        )}
      </div>

      {/* 面经卡片列表 */}
      <Skeleton loading={isLoading} animation>
        {items.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 py-16">
            <Empty
              description={
                hasActiveFilter
                  ? '没有找到匹配的面经，试试调整筛选条件'
                  : '暂无面经，快来分享你的面试经验吧'
              }
            />
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((item) => (
              <InterviewCard key={item.id} item={item} onClick={onViewDetail} />
            ))}
          </div>
        )}
      </Skeleton>

      {/* 分页 */}
      {total > 0 && (
        <div className="flex justify-end">
          <Pagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={total}
            showTotal
            sizeCanChange
            sizeOptions={[10, 20, 50]}
            onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            onPageSizeChange={(pageSize) => setPagination({ page: 1, pageSize })}
          />
        </div>
      )}
    </div>
  );
};

export default InterviewList;
