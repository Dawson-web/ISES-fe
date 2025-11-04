import { Button } from "@arco-design/web-react";
import Text from "@arco-design/web-react/es/Typography/text";
import { IconCalendar } from "@arco-design/web-react/icon";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

  // 招聘季节数据
  const recruitmentSeasons = [
    { name: '寒假实习', period: '12月-2月', status: 0, color: '#86909C' },
    { name: '春招', period: '3月-5月', status: 1, color: '#00B42A' },
    { name: '暑期实习', period: '6月-8月', status: 2, color: '#3370FF' },
    { name: '秋招', period: '9月-11月', status: 3, color: '#FF7D00' },
  ];

   // 当前日期判断
   const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 12 || month <= 2) return 0;
    if (month >= 3 && month <= 5) return 1;
    if (month >= 6 && month <= 8) return 2;
    return 3;
  };

const CampusCalander = () => {
  const navigate = useNavigate();

  return        <div className="bg-white border border-gray-200 p-4">
  {/* 招聘季节进度条 */}
  <div className="mb-4">
    <div className="flex items-center mb-4">
      <IconCalendar className="mr-2 text-blue-500" />
      <Text className="font-medium text-gray-900">招聘季节</Text>
    </div>
    {/* 桌面端垂直时间轴 */}
    <div className="block ">
      {recruitmentSeasons.map((season, index) => (
        <div key={season.name} className="flex items-start timeline-node">
          <div className="flex flex-col items-center mr-4 mt-0.5">
            <div>
            <span className="relative flex h-2 w-2">
              <span className={clsx(` absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75 ${season.status === getCurrentSeason()
                ? 'bg-blue-500 ring-2 ring-blue-200 timeline-current '
                : season.status < getCurrentSeason()
                  ? 'bg-gray-400'
                  : 'bg-gray-200'
                }`,
                season.status === getCurrentSeason() && 'animate-ping')}></span>
              <span className={clsx(`relative inline-flex rounded-full h-2 w-2  ${season.status === getCurrentSeason()
                ? 'bg-blue-600 ring-2 ring-blue-200 timeline-current '
                : season.status < getCurrentSeason()
                  ? 'bg-gray-400'
                  : 'bg-gray-200'
                }  `)}></span>
            </span>

            </div>
            {index < recruitmentSeasons.length - 1 && (
              <div className={`w-0.5 h-10 mt-2 ${index < getCurrentSeason() ? 'bg-blue-300' : 'bg-gray-200'
                }`} />
            )}
          </div>
          <div className="flex-1 -mt-0.5 flex justify-between">
            <Text className={`font-medium transition-colors leading-tight ${season.status === getCurrentSeason() ? 'text-blue-600' : 'text-gray-900'
              }`}>
              {season.name}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5 leading-tight">{season.period}</Text>
          </div>
        </div>
      ))}
    </div>

  </div>

  {/* 快速导航 */}
  <div className="space-y-2">
    <Button type="primary" long onClick={() => navigate('/navigator/info')}>
      内推详情
    </Button>
    <Button type="secondary" long onClick={() => navigate('/navigator/info')}>
      公司爆料
    </Button>
  </div>
</div>
};

export default CampusCalander;