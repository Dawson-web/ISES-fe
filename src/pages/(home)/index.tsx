import { useState, useEffect } from 'react';
import { Input, Select, Button, Typography, Space, Avatar, Divider, Card, Tag, Badge, Result } from '@arco-design/web-react';
import { IconSearch, IconEdit, IconDown, IconEye, IconHeart, IconMessage, IconClockCircle, IconCalendar, IconUser } from '@arco-design/web-react/icon';
import { IContent, IContentListRequest, IContentListResponse } from '@/types/article';
import { toastMessage } from '@/components/toast';
import UserProfile from '@/components/profile/UserProfile';
import { useDisclosure } from '@mantine/hooks';

const { Title, Text } = Typography;

const Home: React.FC = () => {
  const [userProfileOpened, { open: openUserProfile, close: closeUserProfile }] = useDisclosure(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('');
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);

  // 招聘季节数据
  const recruitmentSeasons = [
    { name: '寒假实习', period: '12月-2月', status: 'past', color: '#86909C' },
    { name: '春招', period: '3月-5月', status: 'past', color: '#00B42A' },
    { name: '暑期实习', period: '6月-8月', status: 'current', color: '#3370FF' },
    { name: '秋招', period: '9月-11月', status: 'future', color: '#FF7D00' },
  ];

  // 公司校友数据
  const companyAlumni = [
    {
      id: '1',
      name: '张三',
      company: '字节跳动',
      position: '前端工程师',
      status: 'online' as const,
      avatar: '👨‍💻'
    },
    {
      id: '2',
      name: '李四',
      company: '腾讯',
      position: '后端工程师',
      status: 'offline' as const,
      avatar: '👩‍💻'
    },
    {
      id: '3',
      name: '王五',
      company: '阿里巴巴',
      position: '产品经理',
      status: 'online' as const,
      avatar: '👨‍💼'
    },
    {
      id: '4',
      name: '赵六',
      company: '美团',
      position: '算法工程师',
      status: 'offline' as const,
      avatar: '👩‍🔬'
    },
    {
      id: '5',
      name: '钱七',
      company: '滴滴',
      position: 'UI设计师',
      status: 'online' as const,
      avatar: '🎨'
    }
  ];

  // 当前日期判断
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 12 || month <= 2) return 0;
    if (month >= 3 && month <= 5) return 1;
    if (month >= 6 && month <= 8) return 2;
    return 3;
  };

  // 文章数据
  const articles = [
    {
      id: 1,
      title: '2024暑期实习面试全攻略：从简历到offer',
      excerpt: '详细介绍暑期实习申请的完整流程，包括简历优化、面试技巧、常见问题解答等实用内容...',
      author: '前端小李',
      avatar: '👨‍💻',
      publishTime: '2024-06-15',
      readTime: 8,
      views: 1234,
      likes: 89,
      comments: 23,
      tags: ['实习', '面试', '求职'],
      category: '求职指导',
      featured: true
    },
    {
      id: 2,
      title: 'React 18 新特性深度解析',
      excerpt: '全面介绍React 18的并发渲染、自动批处理、Suspense等新特性，帮助开发者快速上手...',
      author: 'React专家',
      avatar: '⚛️',
      publishTime: '2024-06-14',
      readTime: 12,
      views: 2156,
      likes: 156,
      comments: 45,
      tags: ['React', 'JavaScript', '前端'],
      category: '技术分享',
      featured: false
    },
    {
      id: 3,
      title: '字节跳动秋招技术岗位解析',
      excerpt: '深入分析字节跳动秋招的技术岗位要求、面试流程、薪资待遇等关键信息...',
      author: '字节员工',
      avatar: '🏢',
      publishTime: '2024-06-13',
      readTime: 6,
      views: 3421,
      likes: 234,
      comments: 67,
      tags: ['秋招', '字节跳动', '技术岗'],
      category: '企业分析',
      featured: true
    },
    {
      id: 4,
      title: 'TypeScript 高级类型系统实战',
      excerpt: '从实际项目出发，深入讲解TypeScript的高级类型系统，提升代码质量和开发效率...',
      author: 'TS大师',
      avatar: '📝',
      publishTime: '2024-06-12',
      readTime: 15,
      views: 1876,
      likes: 123,
      comments: 34,
      tags: ['TypeScript', '类型系统', '编程'],
      category: '技术分享',
      featured: false
    },
    {
      id: 5,
      title: '春招失败经验总结与秋招准备',
      excerpt: '分享春招失败的教训和反思，以及如何更好地准备秋招，避免重蹈覆辙...',
      author: '求职者小王',
      avatar: '👤',
      publishTime: '2024-06-11',
      readTime: 10,
      views: 987,
      likes: 67,
      comments: 28,
      tags: ['春招', '秋招', '经验分享'],
      category: '求职心得',
      featured: false
    }
  ];

  // 搜索文章
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(value.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(value.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase())) ||
      article.category.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredArticles(filtered);
  };

  // 高亮搜索关键词
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  };

  // 初始化显示所有文章
  useEffect(() => {
    setFilteredArticles(articles);
  }, []);

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    openUserProfile();
  };

  const handleArticleClick = (articleId: number) => {
    console.log('查看文章:', articleId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex flex-col px-6 py-2 gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-2xl font-bold">Aigei</div>
            <Button type="primary" size="small" className="ml-2">发布文章</Button>
          </div>
          <Text className="text-gray-500 text-sm">悲观者永远正确 乐观者永远前行 ~ 🥰</Text>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">


          {/* 左侧文章列表 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* 搜索框 */}
              <div className="mb-6">
                <Input.Search
                  placeholder="搜索文章、技术、面试..."
                  prefix={<IconSearch />}
                  value={searchValue}
                  onChange={setSearchValue}
                  onSearch={handleSearch}
                  className="mb-4"
                  style={{ maxWidth: '400px' }}
                />
                <Text className="text-sm text-gray-500">
                  {searchValue ? `找到 ${filteredArticles.length} 篇相关文章` : `共 ${articles.length} 篇文章`}
                </Text>
              </div>

              {/* 文章列表 */}
              <div className="space-y-3">
                {filteredArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="cursor-pointer hover-lift article-card border-0 shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <Tag
                            color="blue"
                            size="small"
                            className="rounded-full px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 border-blue-200"
                          >
                            {article.category}
                          </Tag>
                          {article.featured && (
                            <Badge
                              count="精选"
                              style={{
                                backgroundColor: '#f53f3f',
                                borderColor: '#f53f3f',
                                fontSize: '10px',
                                height: '18px',
                                lineHeight: '18px'
                              }}
                            />
                          )}
                        </div>

                        <Title
                          heading={6}
                          className="mb-0 hover:text-blue-600 transition-colors leading-relaxed font-medium text-gray-900"
                          style={{ fontSize: '16px', lineHeight: '1.5' }}
                        >
                          {article.title}
                        </Title>
                      </div>

                      <div className="flex items-center space-x-3 text-gray-400 ml-4 flex-shrink-0">
                        <div className="flex items-center space-x-1">
                          <IconEye className="text-sm" />
                          <Text className="text-xs font-medium">{article.views}</Text>
                        </div>
                        <div className="flex items-center space-x-1">
                          <IconHeart className="text-sm" />
                          <Text className="text-xs font-medium">{article.likes}</Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* 底部操作区 */}
              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <Text className="text-gray-500 mb-2">
                    {searchValue ? `没有找到包含"${searchValue}"的文章` : '暂无文章'}
                  </Text>
                  <Text className="text-sm text-gray-400">
                    {searchValue ? '试试其他关键词吧' : '等待更多精彩内容'}
                  </Text>
                </div>
              )}
            </div>
          </div>
          {/* 右侧时间轴 */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
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
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-500 ${season.status === 'current'
                            ? 'bg-blue-500 ring-4 ring-blue-200 timeline-current'
                            : season.status === 'past'
                              ? 'bg-gray-400'
                              : 'bg-gray-200'
                            }`}
                        />
                        {index < recruitmentSeasons.length - 1 && (
                          <div className={`w-0.5 h-10 mt-2 ${index < getCurrentSeason() ? 'bg-blue-300' : 'bg-gray-200'
                            }`} />
                        )}
                      </div>
                      <div className="flex-1 -mt-0.5 flex justify-between">
                        <Text className={`font-medium transition-colors leading-tight ${season.status === 'current' ? 'text-blue-600' : 'text-gray-900'
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
                <Button type="primary" long>
                  内推详情
                </Button>
                <Button type="secondary" long>
                  公司爆料
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1">
              {/* 公司校友列表 */}
              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <IconUser className="mr-2 text-green-500" />
                  <Text className="font-medium text-gray-900">公司校友</Text>
                </div>

                {/* 校友列表 */}
                <div className="space-y-3">
                  {companyAlumni.length === 0 && companyAlumni.slice(0, 3).map((alumni) => (
                    <>
                      <div
                        key={alumni.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleUserClick(alumni.id)}
                        style={{ border: '1px solid transparent' }}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar size={32} style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            {alumni.name.charAt(0)}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <Text className="font-medium text-gray-900 text-sm truncate">
                              {alumni.name}
                            </Text>
                            <Text className="text-xs text-gray-500 truncate">
                              {alumni.company} · {alumni.position}
                            </Text>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Tag
                            size="small"
                            color={alumni.status === 'online' ? 'green' : 'gray'}
                            style={{
                              borderRadius: '12px',
                              padding: '2px 8px',
                              fontSize: '10px'
                            }}
                          >
                            {alumni.status === 'online' ? '在线' : '离线'}
                          </Tag>
                          <Button
                            type="text"
                            size="mini"
                            icon={<IconMessage />}
                            className="text-gray-400 hover:text-blue-500"
                            style={{
                              borderRadius: '6px',
                              padding: '4px'
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <Button
                          type="text"
                          size="small"
                          className="text-blue-500 hover:text-blue-600"
                          style={{
                            borderRadius: '8px',
                            padding: '8px 16px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          查看全部校友 →
                        </Button>
                      </div>
                    </>
                  ))}
                  {companyAlumni.length >= 0 && (
                    <Result
                    status='404'
                    subTitle='未填写个人公司信息，或公司暂无校友'
                    // extra={[
                    //   <Button key='again' style={{ margin: '0 16px' }}>
                    //     去填写
                    //   </Button>,
                    //   <Button key='back' type='primary'>
                    //     去查看
                    //   </Button>,
                    // ]}
                  ></Result>
                  )}
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 用户资料弹窗 */}
      <UserProfile
        opened={userProfileOpened}
        close={closeUserProfile}
        userInfoId={selectedUserId}
      />
    </div>
  );
};

export default Home;