import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const Page = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center text-center px-6 max-w-md">
        {/* 404 大字 */}
        <div className="relative mb-6">
          <span className="text-[120px] sm:text-[160px] font-black text-gray-100 leading-none select-none">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl font-bold text-gray-800">
            页面走丢了
          </span>
        </div>

        <p className="text-gray-500 text-base sm:text-lg mb-8 leading-relaxed">
          你迷失在了神秘的角落，让我们带你回去吧
        </p>

        {/* 按钮组 */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
            onClick={() => navigate('/')}
            aria-label="返回首页"
          >
            <Home size={16} />
            返回首页
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-gray-600 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors active:scale-95"
            onClick={() => navigate(-1)}
            aria-label="返回上一页"
          >
            <ArrowLeft size={16} />
            返回上页
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;