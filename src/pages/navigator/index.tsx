import { useState, useEffect, useCallback, useRef } from 'react';
import { Input, Button, Typography } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';

import CampusCalander from './components/campuscalander';
import CompanyAlumni from './components/companyalumni';
import userStore from '@/store/User';
import { observer } from 'mobx-react-lite';
import { getSelfArticleListApi } from '@/service/article';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { LifeContentTypeColor } from '@/types/article';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const hitokotos = [
  '悲观者永远正确 乐观者永远前行 ~ 🥰',
  '你当像鸟飞往你的山',
  '我的冲锋是堂吉柯德的冲锋，名为生活的大风车，我要与你大战300回合！',
  '用代码表达言语的魅力，用代码书写山河的壮丽',
  '他们朝我扔泥巴,我拿泥巴种荷花',
  '如果我们觉得我们已错过了春天，那么夏天、秋天和冬天里仍会有机会和时间',
  '除了脚下的路，没有别的路可以走，这条路以死亡为终点，也无法回头……我们尽力而为'
]



const Home: React.FC = observer(() => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [pageSize] = useState<number>(100);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const loadingRef = useRef<boolean>(false);
  const userInfo = userStore;
  const navigate = useNavigate();
  // 取消无限滚动后的保留引用已移除

  // 初始化显示所有文章
  useEffect(() => {
    if (!userInfo.hitokoto || userInfo.hitokoto === "") {
      userInfo.hitokoto = hitokotos[Math.floor(Math.random() * hitokotos.length)]
    }
  }, []);

  // 获取文章数据
  const fetchArticles = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    try {
      const response = await getSelfArticleListApi(searchValue, 1, pageSize);
      const newData = response.data.data;
      setAllArticles(newData.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      loadingRef.current = false;
    }
  }, [searchValue, pageSize]);

  // 初始加载
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // 搜索功能
  const handleSearch = useCallback(() => {
    setAllArticles([]);
    fetchArticles();
  }, [fetchArticles]);

  // 取消无限滚动：不再设置观察器

  const handleArticleClick = (articleId: number) => {
    navigate(`/navigator/explore/channel?id=${articleId}`);
  };

  // 按年份分组文章（时间轴）
  const groupArticlesByYear = (articles: any[]) => {
    const groups: { [year: string]: any[] } = {};
    articles.forEach((article) => {
      const date = new Date(article.createdAt);
      const yearKey = String(date.getFullYear());
      if (!groups[yearKey]) groups[yearKey] = [];
      groups[yearKey].push(article);
    });

    // 年份倒序，年内按时间倒序
    return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, list]) => [
        year,
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      ] as [string, any[]]);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex flex-col px-6 py-2">
          <div className="flex items-center justify-between w-full">
            <div className="text-2xl font-bold">{userInfo.username || 'Aigei'}</div>
          </div>
          <Text className="text-gray-500 text-sm">{userInfo.hitokoto}</Text>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="py-4 px-6">
        <div className="flex flex-col lg:flex-row gap-4 ">


          {/* 左侧文章列表 */}
          <div className="flex-1">
            <div className="h-full bg-white border border-gray-200 p-6">
              {/* 搜索框 */}
              <div className="mb-6 flex items-end justify-between">
                <div className='flex-1 flex flex-nowrap gap-2 items-center '>
                  <Input.Search
                    placeholder="搜索文章、技术、面试..."
                    prefix={<IconSearch />}
                    value={searchValue}
                    onChange={setSearchValue}
                    onSearch={handleSearch}
                    style={{ maxWidth: '400px' }}
                  />
                  <Button type="primary" className="ml-2" onClick={() => navigate('/navigator/publish')}>发布文章</Button>
                </div>
                <Text className="text-sm text-gray-500 hidden sm:block">
                  {searchValue ? `找到 ${allArticles.length} 篇相关文章` : `共发布 ${allArticles.length} 篇文章`}
                </Text>
              </div>

              {/* 时间轴样式的文章列表（按年份分组） */}
              <div className="space-y-10">
                {groupArticlesByYear(allArticles).map(([year, articles]) => (
                  <div key={year} className="relative">
                    {/* 左侧年份与统计 */}
                    <div className="mb-4 flex items-center gap-3">
                      <div className="text-2xl font-extrabold text-gray-800">{year}</div>
                      <span className="text-md text-gray-400">发布 {articles.length} 篇文章</span>
                    </div>

                    {/* 纵向时间线 */}
                    <div className="relative pl-8">
                      <div className="absolute left-3 top-0 bottom-0 w-px" />

                      <div className="space-y-1">
                        {articles.map((article) => {
                          const d = new Date(article.createdAt);
                          const dateLabel = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                          return (
                            <div
                              key={article.id}
                              className="relative group rounded-md hover:bg-gray-50 transition-colors"
                              onClick={() => handleArticleClick(article.id)}
                            >
                              <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gray-300 group-hover:bg-blue-500" />
                              <div className="grid grid-cols-[64px_1fr_auto] items-center gap-3  px-2 cursor-pointer">
                                <div className="text-xs text-gray-500 tabular-nums">{dateLabel}</div>
                                <div className="truncate text-gray-900 hover:text-blue-600 hover:translate-x-2 transition-all	text-sm font-medium py-2">{article.title}</div>
                                <div className="text-xs text-gray-400">#{article.contentType}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 一次性加载，无更多提示 */}
            </div>
          </div>
          {/* 右侧时间轴 */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4">
            <CampusCalander />
            <CompanyAlumni />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Home;