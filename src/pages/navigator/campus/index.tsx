import { Calendar, BookOpen, Users, Bell } from 'lucide-react';

const UPCOMING_FEATURES = [
  { icon: <Calendar size={24} className="text-primary" />, title: '校园日历', desc: '秋招/春招时间线、宣讲会日程一览' },
  { icon: <BookOpen size={24} className="text-green-500" />, title: '面经题库', desc: '热门公司面试经验、笔试真题汇总' },
  { icon: <Users size={24} className="text-purple-500" />, title: '学长学姐', desc: '找到同校校友，获取求职建议' },
  { icon: <Bell size={24} className="text-orange-500" />, title: '岗位提醒', desc: '订阅目标公司，新岗位实时推送' },
];

const Campus = () => {
  return (
    <div className="min-h-screen bg-page py-8 px-6">
      <div className="max-w-3xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary text-xs font-medium rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            功能开发中
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">校园频道</h1>
          <p className="text-gray-500 text-base">
            校园专属求职资源中心，正在紧锣密鼓地开发中
          </p>
        </div>

        {/* 功能预览卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {UPCOMING_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-400">
            如果你有好的建议，欢迎在消息页反馈给我们
          </p>
        </div>
      </div>
    </div>
  );
};

export default Campus;