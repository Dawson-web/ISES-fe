import { Input, Select, Button, Typography, Space, Avatar, Card, Tag, Grid, Tabs, Result } from '@arco-design/web-react';
import { IconSearch, IconPlus, IconHeart, IconEye, IconMessage, IconRefresh } from '@arco-design/web-react/icon';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IArticleDetail } from "@/types/article";
import HotList from './components/hotlist';

const { Title, Text } = Typography;
const TabPane = Tabs.TabPane;

// Demo数据
const DEMO_ARTICLES: IArticleDetail[] = [
  {
    id: 1,
    title: '如何使用React和TypeScript构建现代Web应用',
    type: '技术',
    content: '这是一篇关于React和TypeScript的教程...',
    userInfoId: '1',
    commentId: '1',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    likesCount: 150,
    UserInfo: {
      id: '1',
      userId: '1',
      username: '技术领航员',
      avatar: '/favicon.webp',
      introduce: '前端开发工程师',
      role: 1,
      school: '某知名大学',
      createdAt: new Date('2024-03-20'),
      updatedAt: new Date('2024-03-20'),
      online: true
    }
  },
  {
    id: 2,
    title: '前端性能优化实践指南',
    type: '分享',
    content: '性能优化是前端开发中的重要话题...',
    userInfoId: '2',
    commentId: '2',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
    likesCount: 120,
    UserInfo: {
      id: '2',
      userId: '2',
      username: '性能优化专家',
      avatar: '/favicon.webp',
      introduce: '高级前端工程师',
      role: 1,
      school: '某知名大学',
      createdAt: new Date('2024-03-19'),
      updatedAt: new Date('2024-03-19'),
      online: false
    }
  },
  {
    id: 3,
    title: '现代CSS技巧与最佳实践',
    type: '学习',
    content: '让我们探索CSS的现代特性...',
    userInfoId: '3',
    commentId: '3',
    createdAt: '2024-03-18',
    updatedAt: '2024-03-18',
    likesCount: 90,
    UserInfo: {
      id: '3',
      userId: '3',
      username: 'CSS魔法师',
      avatar: '/favicon.webp',
      introduce: 'UI/UX设计师',
      role: 1,
      school: '某知名大学',
      createdAt: new Date('2024-03-18'),
      updatedAt: new Date('2024-03-18'),
      online: true
    }
  }
];

// 获取文章类型对应的颜色
const getTypeStyles = (type: string) => {
  const styles = {
    '技术': { color: '#1657C9', bg: '#E8F3FF' },
    '分享': { color: '#00B42A', bg: '#E8FFEA' },
    '感悟': { color: '#7B61FF', bg: '#F5F3FF' },
    '学习': { color: '#FF7D00', bg: '#FFF3E8' },
    '日常': { color: '#14C9C9', bg: '#E8FFFB' }
  };
  return styles[type as keyof typeof styles] || { color: '#86909C', bg: '#F2F3F5' };
};

export default function ArticleList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState<string>('');
  const [activeTab, setActiveTab] = useState('发动态');

  const handleArticleClick = (id: number) => {
    navigate(`/articles/detail?id=${id}`);
  };

  const filteredArticles = DEMO_ARTICLES.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = type === '' || article.type === type;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#17171A]">
      {/* 头部搜索区域 */}
      <div className="bg-white dark:bg-[#232324] border-b border-[#E5E6E8] dark:border-[#333335] sticky top-0 z-10">
        <div className="max-w-[1140px] mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            <Input.Search
              placeholder="搜索感兴趣的内容..."
              style={{ width: 320 }}
              value={searchTerm}
              onChange={setSearchTerm}
              allowClear
              size="large"
              className="shadow-sm"
            />
            <Select
              placeholder="选择文章类型"
              value={type}
              onChange={val => setType(val || '')}
              style={{ width: 140 }}
              allowClear
              size="large"
              className="shadow-sm"
            >
              {['日常', '分享', '感悟', '学习', '技术'].map(option => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
            <Button 
              type="primary" 
              icon={<IconPlus />} 
              size="large"
              className="ml-auto shadow-sm !bg-[#1e80ff] hover:!bg-[#1e70ee]"
              onClick={() => navigate('/home/article/edit')}
            >
              写文章
            </Button>
          </div>
        </div>
      </div>

      {/* 主体内容区域 */}
      <div className="max-w-[1140px] mx-auto px-6 py-4 flex gap-6">
        {/* 左侧内容区 */}
        <div className="flex-1">
          <Tabs 
            activeTab={activeTab} 
            onChange={setActiveTab}
            className="article-tabs"
          >
            <TabPane key="发动态" title={<span className="px-2">发动态</span>} />
            <TabPane key="写文章" title={<span className="px-2">写文章</span>} />
            <TabPane key="发内推" title={<span className="px-2">发内推</span>} />
          </Tabs>

          <div className="mt-4">
            <Grid.Row gutter={[0, 1]}>
              {filteredArticles.map((article) => (
                <Grid.Col key={article.id} span={24}>
                  <Card
                    className="group hover:bg-[#F8FAFD] dark:hover:bg-[#2B2B2D] transition-colors cursor-pointer border-none rounded-none"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="flex gap-4">
                      {/* 左侧作者头像 */}
                      <div className="flex-shrink-0">
                        <Avatar size={40}>
                          {article.UserInfo.avatar ? (
                            <img 
                              src={article.UserInfo.avatar} 
                              alt={article.UserInfo.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            article.UserInfo.username[0]
                          )}
                        </Avatar>
                      </div>

                      {/* 右侧内容 */}
                      <div className="flex-1 min-w-0">
                        {/* 作者信息 */}
                        <div className="flex items-center gap-2 mb-2">
                          <Text className="text-[14px] font-medium text-[#252933] dark:text-[#E5E6E8]">
                            {article.UserInfo.username}
                          </Text>
                          <Text className="text-[12px] text-[#8A919F]">
                            {article.UserInfo.introduce}
                          </Text>
                          <Text className="text-[12px] text-[#8A919F]">
                            {article.createdAt.split('T')[0]}
                          </Text>
                        </div>

                        {/* 文章标题和标签 */}
                        <div className="flex items-center gap-2 mb-2">
                          <Title 
                            heading={5} 
                            className="!m-0 !text-[16px] !font-medium group-hover:text-[#1e80ff] transition-colors line-clamp-1"
                          >
                            {article.title}
                          </Title>
                          <Tag 
                            style={{
                              backgroundColor: getTypeStyles(article.type).bg,
                              color: getTypeStyles(article.type).color,
                              border: 'none',
                              padding: '0 8px',
                              height: '20px',
                              fontSize: '12px',
                              borderRadius: '10px'
                            }}
                          >
                            {article.type}
                          </Tag>
                        </div>

                        {/* 文章内容 */}
                        <Text className="text-[#515767] dark:text-[#A4A4A4] text-[14px] leading-relaxed line-clamp-2 mb-3">
                          {article.content}
                        </Text>
                        
                        {/* 文章数据 */}
                        <Space size="large" className="text-[#8A919F]">
                          <Space className="text-xs">
                            <IconHeart />
                            <span>{article.likesCount}</span>
                          </Space>
                          <Space className="text-xs">
                            <IconEye />
                            <span>1.2k</span>
                          </Space>
                          <Space className="text-xs">
                            <IconMessage />
                            <span>8</span>
                          </Space>
                        </Space>
                      </div>
                    </div>
                  </Card>
                </Grid.Col>
              ))}

              {filteredArticles.length === 0 && (
                <Grid.Col span={24}>
                  <div className="text-center py-16">
                    <Result
                      status="404"
                      title="暂无相关内容"
                      subTitle={<>
                      换个关键词试试，或者 
                      <Text 
                        className="text-[#1e80ff] hover:text-[#1e70ee] text-sm ml-1 cursor-pointer"
                        onClick={() => navigate('/articles/edit')}
                      >
                        发布相关内容
                      </Text>
                      </>}
                    />
                  </div>
                </Grid.Col>
              )}
            </Grid.Row>
          </div>
        </div>

        {/* 右侧热榜区域 */}
        <HotList />
      
      </div>
    </div>
  );
}