import { Input, Button, Typography, Space, Avatar, Card, Tag, Grid, Result, Pagination } from '@arco-design/web-react';
import {  IconPlus, IconHeart, IconEye, IconMessage } from '@arco-design/web-react/icon';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {  IArticle, LifeContentTypeColor } from "@/types/article";
import HotList from './components/hotlist';
import { getArticleList } from '@/service/article';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ISESSkeleton from '@/components/skeleton';
import CreatorList from './components/creatorlist';

const { Title, Text } = Typography;



export default function ArticleList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  const handleArticleClick = (id: number) => {
    navigate(`/navigator/articles/detail?id=${id}`);
  };

  const { data, isLoading} = useQuery({
    queryKey: ["getArticleList", currentPage, pageSize],
    queryFn: () => getArticleList(searchTerm, currentPage, pageSize).then(res => res.data.data),
  });


  const { mutateAsync: searchArticle } = useMutation({
    mutationFn: () => getArticleList(searchTerm, currentPage, pageSize),
    onSuccess: () => {
      // 刷新文章详情数据
      queryClient.invalidateQueries({ queryKey: ["getArticleList", currentPage, pageSize] });
    },
  }); 

  const articles = data?.articles || [];
  const total = data?.pagination?.total || 0;


  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#17171A]">
      {/* 头部搜索区域 */}
      <div className="bg-white dark:bg-[#232324] border-b border-[#E5E6E8] dark:border-[#333335] sticky top-0 z-10">
        <div className=" mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            <Input.Search
              placeholder="搜索感兴趣的内容..."
              style={{ width: 320 }}
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              onSearch={() => searchArticle()}
              allowClear
              size="large"
              className="shadow-sm"
            />
            {/* <Select
              placeholder="选择文章类型"
              value={type}
              onChange={val => setType(val || '')}
              style={{ width: 200 }}
              allowClear
              size="large"
              className="shadow-sm"
              defaultValue="全部"
              mode='multiple'
            >
              {CONTENT_TYPE_LIFE.map(option => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select> */}
            <Button 
              type="primary" 
              icon={<IconPlus />} 
              size="large"
              className="ml-auto shadow-sm "
              onClick={() => navigate('/navigator/articles/edit')}
            >
              写文章
            </Button>
          </div>
        </div>
      </div>

      {/* 主体内容区域 */}
      <div className=" mx-auto px-6 py-4 flex gap-4 md:flex-nowrap flex-wrap">
        
        {/* 左侧内容区 */}
        <div className="flex-1">
          <div className="">
            <Grid.Row gutter={[0, 1]}>
              {isLoading ? (
                <ISESSkeleton count={3} type="list-info" className="w-full" />
              ) : (
                <>
                  {articles.map((article: IArticle) => (
                    <Grid.Col key={article.id} span={24}>
                      <Card
                        className="group hover:bg-[#F8FAFD] dark:hover:bg-[#2B2B2D] transition-colors cursor-pointer border-none rounded-none"
                        onClick={() => handleArticleClick(article.id)}
                      >
                        <div className="flex gap-4">
                          {/* 左侧作者头像 */}
                          <div className="flex-shrink-0">
                            <Avatar size={40}>
                              {article.creator.avatar ? (
                                <img 
                                  src={article.creator.avatar} 
                                  alt={article.creator.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                article.creator.username[0]
                              )}
                            </Avatar>
                          </div>

                          {/* 右侧内容 */}
                          <div className="flex-1 min-w-0">
                            {/* 作者信息 */}
                            <div className="flex items-center gap-2 mb-2">
                              <Text className="text-[14px] font-medium text-[#252933] dark:text-[#E5E6E8]">
                                {article.creator.username}
                              </Text>
                              <Text className="text-[12px] text-[#8A919F] line-clamp-1">
                                {article.metadata.excerpt}
                              </Text>
                              <Text className="text-[12px] text-[#8A919F] line-clamp-1">
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
                                  border: 'none',
                                  padding: '0 8px',
                                  height: '20px',
                                  fontSize: '12px',
                                  borderRadius: '10px'
                                }}
                                color={LifeContentTypeColor[article.contentType as keyof typeof LifeContentTypeColor]}
                              >
                                {article.contentType}
                              </Tag>
                            </div>

                            {/* 文章内容 */}
                            <Text className="text-[#515767] dark:text-[#A4A4A4] text-[14px] leading-relaxed line-clamp-2 mb-3">
                              {article.metadata.excerpt}
                            </Text>
                            
                            {/* 文章数据 */}
                            <Space size="large" className="text-[#8A919F]">
                              <Space className="text-xs">
                                <IconHeart />
                                <span>{article.metadata.likeCount}</span>
                              </Space>
                              <Space className="text-xs">
                                <IconEye />
                                <span>{article.metadata.viewCount}</span>
                              </Space>
                              <Space className="text-xs">
                                <IconMessage />
                                <span>{article.comments.length}</span>
                              </Space>
                            </Space>
                          </div>
                        </div>
                      </Card>
                    </Grid.Col>
                  ))}

                  {articles.length === 0 && (
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

                  {/* 添加分页组件 */}
                  {total > 0 && (
                    <Grid.Col span={24}>
                      <div className="flex justify-center mt-4">
                        <Pagination
                          total={total}
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
                    </Grid.Col>
                  )}
                </>
              )}
            </Grid.Row>
          </div>
        </div>

        {/* 右侧热榜区域 */}
        <div className="flex flex-col gap-4 w-full md:w-[300px]">
        <HotList />
        <CreatorList />
      </div>
      </div>
    </div>
  );
}