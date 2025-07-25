import { useState, useEffect } from 'react';
import { Input, Button, Typography, Card, Tag, Pagination } from '@arco-design/web-react';
import { IconSearch, IconEye, IconHeart } from '@arco-design/web-react/icon';

import CampusCalander from './components/campuscalander';
import CompanyAlumni from './components/companyalumni';
import userStore from '@/store/User';
import { observer } from 'mobx-react-lite';
import { getSelfArticleListApi } from '@/service/article';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LifeContentTypeColor } from '@/types/article';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const userInfo = userStore;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 初始化显示所有文章
  useEffect(() => {
    if (!userInfo.hitokoto || userInfo.hitokoto === "") {
      userInfo.hitokoto = hitokotos[Math.floor(Math.random() * hitokotos.length)]
    }
  }, []);

  const { data } = useQuery({
    queryKey: ['getSelfArticleListApi', currentPage, pageSize],
    queryFn: () => getSelfArticleListApi(searchValue,currentPage, pageSize).then(res => res.data.data),
  });

  const { mutateAsync: searchArticleList } = useMutation({
    mutationFn: () => getSelfArticleListApi(searchValue,currentPage, pageSize),
    onSuccess: () => {
      // 刷新文章详情数据
      queryClient.invalidateQueries({ queryKey: ["getSelfArticleListApi", currentPage, pageSize] });
    },
  }); 

  const articles = data?.articles
  const pagination = data?.pagination

  const handleArticleClick = (articleId: number) => {
    navigate(`/navigator/articles/detail?id=${articleId}`);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex flex-col px-6 py-2">
          <div className="flex items-center justify-between w-full">
            <div className="text-2xl font-bold">{userInfo.username || 'Aigei'}</div>
            <Button type="primary" size="small" className="ml-2" onClick={() => navigate('/navigator/articles/edit')}>发布文章</Button>
          </div>
          <Text className="text-gray-500 text-sm">{userInfo.hitokoto}</Text>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="py-4 px-6">
        <div className="flex flex-col lg:flex-row gap-4 ">


          {/* 左侧文章列表 */}
          <div className="flex-1">
            <div className="h-full bg-white rounded-lg border border-gray-200 p-6">
              {/* 搜索框 */}
              <div className="mb-6 flex items-center justify-between">
                <Input.Search
                  placeholder="搜索文章、技术、面试..."
                  prefix={<IconSearch />}
                  value={searchValue}
                  onChange={setSearchValue}
                  onSearch={() => searchArticleList()}
                  style={{ maxWidth: '400px' }}
                />
                <Text className="text-sm text-gray-500">
                  {searchValue ? `找到 ${articles?.length} 篇相关文章` : `共发布 ${pagination?.total} 篇文章`}
                </Text>
              </div>

              {/* 文章列表 */}
              <div className="space-y-3">
                {articles?.map((article) => (
                  <Card
                    key={article.id}
                    className="cursor-pointer hover-lift article-card border-0 shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <Title
                          heading={6}
                          className="mb-0 hover:text-blue-600 transition-colors leading-relaxed font-medium text-gray-900 flex items-center gap-4"
                          style={{ fontSize: '16px', lineHeight: '1.5' }}
                        >
                          {article.title}
                            <Tag
                              color={LifeContentTypeColor[article.contentType as keyof typeof LifeContentTypeColor]}
                              style={{
                                border: 'none',
                                // padding: '0 8px',
                                height: '20px',
                                fontSize: '12px',
                                borderRadius: '10px'
                              }}
                            >
                              {article.contentType}
                            </Tag>
                        </Title>
                      </div>

                      <div className="flex items-center space-x-3 text-gray-400 ml-4 flex-shrink-0">
                        <div className="flex items-center space-x-1">
                          <IconEye className="text-sm" />
                          <Text className="text-xs font-medium">{article.metadata.viewCount}</Text>
                        </div>
                        <div className="flex items-center space-x-1">
                          <IconHeart className="text-sm" />
                          <Text className="text-xs font-medium">{article.metadata.likeCount}</Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* 分页 */}
              <div className="mt-4 flex justify-center">
                <Pagination
                  total={pagination?.total || 0}
                  current={currentPage}
                  pageSize={pageSize}
                  onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                  }}
                  showTotal
                  sizeCanChange
                  sizeOptions={[10, 20, 50]}
                />
              </div>
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