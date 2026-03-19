import { useState, useCallback } from 'react';
import { Typography } from '@arco-design/web-react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InterviewList from './components/InterviewList';
import InterviewForm from './components/InterviewForm';
import InterviewStats from './components/InterviewStats';

const { Title, Text } = Typography;

const Campus = () => {
  const navigate = useNavigate();
  const [formVisible, setFormVisible] = useState(false);

  const handleViewDetail = useCallback(
    (id: string) => {
      navigate(`/navigator/campus/detail?id=${id}`);
    },
    [navigate],
  );

  const handleOpenForm = useCallback(() => {
    setFormVisible(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormVisible(false);
  }, []);

  return (
    <div className="min-h-screen bg-page">
      {/* 顶部区域 */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <BookOpen size={18} className="text-emerald-600" />
              </div>
              <div>
                <Title heading={5} style={{ margin: 0 }}>
                  面经题库
                </Title>
                <Text className="text-xs text-gray-400 mt-0.5 block">
                  来自校友的真实面试经验
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="mx-auto max-w-6xl px-6 py-5 flex gap-5 md:flex-nowrap flex-wrap">
        {/* 左侧列表区 */}
        <div className="flex-1 min-w-0">
          <InterviewList onViewDetail={handleViewDetail} onOpenForm={handleOpenForm} />
        </div>

        {/* 右侧统计看板 */}
        <div className="w-full md:w-[300px] flex-shrink-0">
          <InterviewStats onViewDetail={handleViewDetail} />
        </div>
      </div>

      {/* 发布面经 Modal */}
      <InterviewForm visible={formVisible} onClose={handleCloseForm} />
    </div>
  );
};

export default Campus;
