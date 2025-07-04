import {
  Card,
  Avatar,
  Typography,
  Tag,
  Descriptions,
  Space,
  Button,
  Grid,
  Image
} from "@arco-design/web-react";
import { useState } from "react";
import { IUserInfo } from "@/types/user";
import { IconUser, IconBook, IconCode } from "@arco-design/web-react/icon";

const { Title, Paragraph, Text } = Typography;
const { Row, Col } = Grid;

// 模拟用户数据 - 您可以从 API 获取真实数据
const mockUserData: IUserInfo = {
  id: "user_123456",
  userId: "dawson_2024",
  username: "Dawson Chen",
  introduce: "全栈开发工程师，专注于 React 和 Node.js 开发。热爱技术分享，致力于构建优雅的用户体验。全栈开发工程师，专注于 React 和 Node.js 开发。热爱技术分享，致力于构建优雅的用户体验。",
  role: 1,
  school: "清华大学",
  avatar: "/src/assets/favicon.png",
  online: true,
  grade: "2024届",
  company: {
    name: "字节跳动",
    position: "高级前端工程师",
    department: "抖音前端团队",
    startDate: "2023-06-01",
    endDate: "2024-01-20",
    location: "北京",
  },
  circles: "技术圈,产品圈,设计圈",
  major: "计算机科学与技术",
  techDirection: "前端开发,全栈开发,DevOps",
  banner: "/src/assets/home-bg.png",
  createdAt: new Date("2023-01-15"),
  updatedAt: new Date("2024-01-20")
};

// 角色映射
const roleMap = {
  0: { text: "普通用户", color: "blue" },
  1: { text: "VIP用户", color: "gold" },
  2: { text: "管理员", color: "red" }
};

export default function Page() {
  const [userData] = useState<IUserInfo>(mockUserData);


  const renderTags = (tagsString?: string) => {
    if (!tagsString) return <Text type="secondary">暂无</Text>;

    return (
      <Space wrap>
        {tagsString.split(',').map((tag, index) => (
          <Tag key={index} color="arcoblue" size="small">
            {tag.trim()}
          </Tag>
        ))}
      </Space>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* 用户头部卡片 */}
        <Card
          className="mb-6 rounded-md"
          cover={
            userData.banner && (
              <div className="h-48 overflow-hidden">
                <Image
                  src={userData.banner}
                  alt="用户封面"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )
          }
        >
          <div className="relative">
            <div className="flex items-start gap-5">
              <div className="relative">
                <Avatar
                  size={80}
                  className="border-4 border-white shadow-lg bg-cover bg-center -mt-10"
                  style={{
                    backgroundImage: userData.avatar ? `url(${userData.avatar})` : undefined,
                  }}
                >
                  {!userData.avatar && userData.username?.charAt(0)}
                </Avatar>
                {/* 在线状态指示器 */}
                <div className={`absolute top-4 right-0 w-5 h-5 rounded-full border-2 border-white ${userData.online ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                  <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-green-400"
                    style={{ display: userData.online ? 'block' : 'none' }}></div>
                </div>
              </div>

              <div className="flex-1 pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <Title heading={3} className="m-0">
                    {userData.username}
                  </Title>
                  <Tag color={roleMap[userData.role as keyof typeof roleMap]?.color || "blue"}>
                    {roleMap[userData.role as keyof typeof roleMap]?.text || "普通用户"}
                  </Tag>
                </div>

                <Text type="secondary" className="mb-2 block">
                  用户ID: {userData.userId}
                </Text>

                <Paragraph className="text-gray-600 mb-4">
                  {userData.introduce || "这个人很懒，什么都没有留下..."}
                </Paragraph>

                <Space>
                  <Button type="primary" size="small">
                    <IconUser /> 关注
                  </Button>
                  <Button type="outline" size="small">
                    发送私信
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        </Card>

        <Row gutter={24}>
        <Col span={24}>
            <Card title="实习经历" className="mb-6 rounded-md">
              {userData.company ? (
                <div className="space-y-4">
                  {/* 公司基本信息 */}
                  <div className="border-l-4 border-blue-500 pl-4 mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900 mb-1 text-wrap">
                          {userData.company.name}
                        </h4>
                        <p className="text-gray-600 text-wrap">{userData.company.department}-{userData.company.position}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {userData.company.startDate} - {userData.company.endDate}
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-8">
                  <Text type="secondary">暂无实习经历信息</Text>
                </div>
              )}
            </Card>
          </Col>

          <Col span={12}>
            <Card title="基本信息" className="mb-6 rounded-md">
              <Descriptions
                column={1}
                colon={":"}
                data={[
                  {
                    label: "学校",
                    value: userData.school || "暂无"
                  },
                  {
                    label: "专业",
                    value: userData.major || "暂无"
                  },
                  {
                    label: "年级",
                    value: userData.grade || "暂无"
                  },

                ]}
                layout='inline-horizontal'
                labelStyle={{ color: "#4e5969", fontWeight: "500" }}
                valueStyle={{ color: "#1d2129" }}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card title="技能与兴趣" className="mb-6 rounded-md">
              <div className="mb-4">
                <Text className="font-medium text-gray-600 mb-2 block">
                  <IconCode /> 技术方向
                </Text>
                {renderTags(userData.techDirection)}
              </div>
              <div>
                <Text className="font-medium text-gray-600 mb-2 block">
                  <IconBook /> 兴趣圈子
                </Text>
                {renderTags(userData.circles)}
              </div>
            </Card>
          </Col>
       
        </Row>
      </div>
    </div>
  );
}
