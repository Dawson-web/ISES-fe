import { 
  Card, 
  Avatar, 
  Typography, 
  Tag, 
  Badge, 
  Space, 
  Button 
} from "@arco-design/web-react";
import { IUserInfo } from "@/types/user";
import { IconUser, IconMessage } from "@arco-design/web-react/icon";

const { Title, Paragraph, Text } = Typography;

interface UserCardProps {
  userInfo: IUserInfo;
  onFollow?: (userId: string) => void;
  onMessage?: (userId: string) => void;
  compact?: boolean;
}

// 角色映射
const roleMap = {
  0: { text: "普通用户", color: "blue" },
  1: { text: "VIP用户", color: "gold" },
  2: { text: "管理员", color: "red" }
};

export default function UserCard({ userInfo, onFollow, onMessage, compact = false }: UserCardProps) {
  const formatDate = (date?: Date) => {
    if (!date) return "暂无";
    return new Date(date).toLocaleDateString("zh-CN");
  };

  const renderTechTags = (techDirection?: string) => {
    if (!techDirection) return null;
    
    const tags = techDirection.split(',').slice(0, 3); // 只显示前3个技能
    return (
      <Space wrap size="small">
        {tags.map((tag, index) => (
          <Tag key={index} color="arcoblue" size="small">
            {tag.trim()}
          </Tag>
        ))}
      </Space>
    );
  };

  return (
    <Card
      className={`${compact ? "w-70" : "w-80"} m-2`}
      hoverable
    >
      <div className="text-center">
        {/* 头像和在线状态 */}
        <Badge
          count={userInfo.online ? "在线" : ""}
          color={userInfo.online ? "green" : "gray"}
          className={userInfo.online ? "bg-green-500" : "bg-gray-400"}
        >
          <Avatar
            size={compact ? 60 : 80}
            className="bg-blue-500 bg-cover bg-center"
            style={{
              backgroundImage: userInfo.avatar ? `url(${userInfo.avatar})` : undefined,
            }}
          >
            {!userInfo.avatar && userInfo.username?.charAt(0)}
          </Avatar>
        </Badge>
        
        {/* 用户名和角色 */}
        <div className="mt-3 mb-2">
          <Title heading={compact ? 5 : 4} className="m-0 mb-1">
            {userInfo.username}
          </Title>
          <Tag color={roleMap[userInfo.role as keyof typeof roleMap]?.color || "blue"} size="small">
            {roleMap[userInfo.role as keyof typeof roleMap]?.text || "普通用户"}
          </Tag>
        </div>
        
        {/* 用户ID */}
        <Text type="secondary" className="text-xs mb-2 block">
          ID: {userInfo.userId}
        </Text>
        
        {/* 简介 */}
        <Paragraph 
          className={`text-gray-600 text-sm ${compact ? "mb-2 min-h-10" : "mb-3 min-h-15"}`}
          ellipsis={{ rows: compact ? 2 : 3, showTooltip: true }}
        >
          {userInfo.introduce || "这个人很懒，什么都没有留下..."}
        </Paragraph>
        
        {/* 基本信息 */}
        {!compact && (
          <div className="mb-4 text-left">
            <div className="flex justify-between mb-1">
              <Text type="secondary" className="text-xs">学校：</Text>
              <Text className="text-xs">{userInfo.school || "暂无"}</Text>
            </div>
            <div className="flex justify-between mb-1">
              <Text type="secondary" className="text-xs">专业：</Text>
              <Text className="text-xs">{userInfo.major || "暂无"}</Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text type="secondary" className="text-xs">注册：</Text>
              <Text className="text-xs">{formatDate(userInfo.createdAt)}</Text>
            </div>
          </div>
        )}
        
        {/* 技能标签 */}
        {userInfo.techDirection && (
          <div className="mb-4">
            <Text type="secondary" className="text-xs mb-2 block">
              技能方向
            </Text>
            {renderTechTags(userInfo.techDirection)}
          </div>
        )}
        
        {/* 操作按钮 */}
        <Space>
          <Button 
            type="primary" 
            size="small"
            onClick={() => onFollow?.(userInfo.id)}
            icon={<IconUser />}
          >
            {compact ? "关注" : "关注"}
          </Button>
          <Button 
            type="outline" 
            size="small"
            onClick={() => onMessage?.(userInfo.id)}
            icon={<IconMessage />}
          >
            {compact ? "私信" : "发私信"}
          </Button>
        </Space>
      </div>
    </Card>
  );
} 