import homeBg from '../assets/home-bg.png';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import FadeInAnimation from '../components/animation';
import { ArrowRight, UserPlus } from 'lucide-react';

export default function Page() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const targetPathRef = useRef<string>('');

  const handleButtonClick = (path: string) => {
    targetPathRef.current = path;
    setIsVisible(false);
  };

  const handleAnimationEnd = () => {
    if (targetPathRef.current) {
      navigate(targetPathRef.current);
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${homeBg})` }}
    >
      {/* 渐变遮罩层 */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />

      <FadeInAnimation
        className="relative z-10 px-8 pt-[20vh] sm:px-8 sm:pt-[18vh] md:px-12 md:pt-[20vh] lg:px-16 lg:pt-[22vh] xl:px-20 xl:pt-[24vh] 2xl:px-24 2xl:pt-[26vh] flex flex-col gap-3 max-w-4xl"
        visible={isVisible}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* 品牌标识 */}
        <div className="flex items-center text-sm">
          <span className="font-semibold text-gray-800">ISES</span>
          <span className="w-px h-3 bg-gray-400 mx-2" />
          <span className="text-gray-500 font-normal">职引 · 在校生求职平台</span>
        </div>

        {/* 主标题 */}
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight">
          Instant Share
        </h1>

        {/* 副标题 */}
        <p className="text-gray-600 text-xl mt-1 max-w-lg leading-relaxed">
          专为在校生定制的一站式求职爆料平台，发现岗位内推、薪资爆料、面经分享
        </p>

        {/* 按钮组 */}
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-medium rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-600 hover:shadow-primary/40 transition-all duration-200 active:scale-95"
            onClick={() => handleButtonClick('/login')}
            aria-label="前往登录"
          >
            登录
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95"
            onClick={() => handleButtonClick('/register')}
            aria-label="前往注册"
          >
            <UserPlus size={16} />
            注册
          </button>
        </div>

        {/* 特性标签 */}
        <div className="flex flex-wrap gap-3 mt-6">
          {['岗位内推', '薪资爆料', '面经分享', '校友社区'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium text-gray-500 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </FadeInAnimation>
    </div>
  );
}
