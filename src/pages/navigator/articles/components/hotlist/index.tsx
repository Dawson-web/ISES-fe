import ISESSkeleton from '@/components/skeleton';
import { getHotArticlesApi } from '@/service/article';
import { Button, Typography, Avatar, Card } from '@arco-design/web-react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
 
const { Title, Text } = Typography;

export default function HotList() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["getHotArticlesApi"],
    queryFn: () => getHotArticlesApi().then(res => res.data.data),
  });


  const hotArticles = data || [];

  return (
    <>
      {isLoading ? (
        <ISESSkeleton count={3} type="list-user" className="w-full md:w-[300px] flex-shrink-0" />
      ) : (
       
    <div className="w-full md:w-[300px] flex-shrink-0">
    <Card className="mb-4" bordered={false}>
      <div className="flex items-center justify-between mb-4">
        <Title heading={6} className="!m-0">全站热榜</Title>
      </div>
      <div className="space-y-3">
        {hotArticles.map((article, index) => (
          <div key={index} className="flex items-start gap-3 group cursor-pointer" onClick={() => {
            navigate(`/navigator/articles/detail?id=${article.id}`);
          }}>
            <div
              className={clsx(
                'text-[20px] w-6',
                index === 0 ? 'text-[#F53F3F] font-bold' :
                  index === 1 ? 'text-[#FF7D00] font-semibold' :
                    index === 2 ? 'text-[#14C9C9] font-medium' : 'text-[#8A919F] group-hover:text-[#1e80ff]'
              )}
            >
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <Text className="line-clamp-2 text-[14px] text-[#252933] dark:text-[#E5E6E8]  group-hover:text-[#1e80ff]">
                  {article.title}
              </Text>
              <Text className="text-[12px] text-[#8A919F] mt-1">
                {article.metadata.viewCount} 热度 {index < 3 ? '🔥' : ''}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </Card>

    <Card bordered={false}>
      <div className="flex items-center justify-between mb-4">
        <Title heading={6} className="!m-0">创作者榜单</Title>
        <Button
          type="text"
          className="text-[#8A919F] hover:text-[#1e80ff] text-sm"
        >
          更多 &gt;
        </Button>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 group cursor-pointer">
            <div className="text-[16px] font-medium text-[#8A919F] group-hover:text-[#1e80ff] w-6">
              {i}
            </div>
            <Avatar size={36}>
              <img src="/favicon.webp" alt="avatar" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <Text className="text-[14px] text-[#252933] dark:text-[#E5E6E8] font-medium group-hover:text-[#1e80ff]">
                创作者昵称
              </Text>
              <Text className="text-[12px] text-[#8A919F]">
                1000+ 关注
              </Text>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
      )}
    </>
  );
};