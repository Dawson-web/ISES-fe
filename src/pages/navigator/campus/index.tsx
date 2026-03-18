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
      {/* 顶部 Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-white/80">
                Navigator · Campus
              </span>
              <Title heading={4} style={{ margin: 0, color: 'white' }}>
                面经题库
              </Title>
            </div>
          </div>
          <Text style={{ color: 'rgba(255,255,255,0.8)' }} className="mt-1 block">
            来自校友的真实面试经验，助你拿下心仪 Offer
          </Text>
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
