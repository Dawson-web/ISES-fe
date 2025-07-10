import ArticlePreview from "@/components/article/article-preview";
import CommentBox from "@/components/article/comment";
import { Card, Tooltip, Badge, Group, Text, ActionIcon, Button } from "@mantine/core";
import { Undo2, ThumbsUp, Eye, MessageCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatISODate } from "@/utils/date";
import UserAvatar from "@/components/public/user_avatar";
import { useState } from "react";

// Demo数据
const DEMO_ARTICLE = {
  id: '1',
  title: '示例文章标题',
  content: `
# 这是一个示例文章

这是文章的正文内容。

## 特点
- 支持Markdown格式
- 包含基础样式
- 可以展示图片和链接

## 代码示例
\`\`\`javascript
function hello() {
  console.log('Hello World!');
}
\`\`\`
  `,
  type: '技术',
  metadata: {
    tags: ['示例', '教程', '前端'],
    category: '技术',
    viewCount: 100,
    likeCount: 50,
    commentCount: 3,
    status: 'published',
  },
  creator: {
    id: '1',
    nickname: '示例作者',
    avatar: '/favicon.webp'
  },
  createdAt: new Date().toISOString(),
  Comment: {
    content: JSON.stringify([
      {
        userInfoId: '1',
        content: '这是一条示例评论',
        createdAt: new Date().toISOString()
      },
      {
        userInfoId: '2',
        content: '文章写得很好!',
        createdAt: new Date().toISOString()
      }
    ])
  },
  commentId: '1'
};

export default function Page() {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(DEMO_ARTICLE.metadata.likeCount);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="w-full h-full">
      <Card className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Tooltip label="返回">
            <ActionIcon
              variant="subtle"
              onClick={() => navigate("/articles")}
            >
              <Undo2 className="text-gray-600" />
            </ActionIcon>
          </Tooltip>
          
          <Group>
            {DEMO_ARTICLE.metadata.tags.map((tag: string) => (
              <Badge key={tag} variant="light">
                {tag}
              </Badge>
            ))}
          </Group>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <UserAvatar 
            src={DEMO_ARTICLE.creator.avatar}
            size="medium"
            disabled={true}
          />
          <div>
            <Text size="sm" fw={500}>{DEMO_ARTICLE.creator.nickname}</Text>
            <Group gap="xs" mt={4}>
              <Clock size={14} className="text-gray-500" />
              <Text size="xs" c="dimmed">
                {formatISODate(DEMO_ARTICLE.createdAt)}
              </Text>
            </Group>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col sm:items-center sm:justify-center">
          <ArticlePreview
            content={DEMO_ARTICLE.content}
            title={DEMO_ARTICLE.title}
            type={DEMO_ARTICLE.type}
            className="w-full h-full flex flex-col [&>div]:flex-1 [&>div>div]:h-full"
          />
        </div>

        <Group className="mt-4 pb-4 border-b">
          <Button 
            variant={isLiked ? "filled" : "subtle"}
            leftSection={<ThumbsUp size={18} />}
            onClick={handleLike}
          >
            {likeCount}
          </Button>
          
          <Group gap="xs">
            <Eye size={18} className="text-gray-500" />
            <Text size="sm" c="dimmed">
              {DEMO_ARTICLE.metadata.viewCount}
            </Text>
          </Group>

          <Group gap="xs">
            <MessageCircle size={18} className="text-gray-500" />
            <Text size="sm" c="dimmed">
              {DEMO_ARTICLE.metadata.commentCount}
            </Text>
          </Group>

          {DEMO_ARTICLE.metadata.category && (
            <Badge variant="light" color="blue">
              {DEMO_ARTICLE.metadata.category}
            </Badge>
          )}
        </Group>

        <CommentBox
          commentId={DEMO_ARTICLE.commentId}
          content={DEMO_ARTICLE.Comment.content}
        />
      </Card>
    </div>
  );
} 