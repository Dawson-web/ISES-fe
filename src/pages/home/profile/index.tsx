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
import { IconUser, IconBook, IconCode, IconEdit } from "@arco-design/web-react/icon";
import EditProfileDrawer from "@/components/profile/EditProfileDrawer";

const { Title, Paragraph, Text } = Typography;
const { Row, Col } = Grid;

// 模拟用户数据 - 您可以从 API 获取真实数据
const mockUserData: IUserInfo = {
  id: "user_123456",
  userId: "dawson_2024",
  username: "Dawson Chen",
  introduce: "全栈开发工程师，专注于 React 和 Node.js 开发。热爱技术分享，致力于构建优雅的用户体验。全栈开发工程师，专注于 React 和 Node.js 开发。热爱技术分享，致力于构建优雅的用户体验。",
  role: 1,
  school: "",
  avatar: "/src/assets/favicon.png",
  online: true,
  grade: "",
    company: [
    {
      id: "1",
      name: "字节跳动",
      position: "高级前端工程师",
      department: "抖音前端团队",
      startDate: "2023-06-01",
      endDate: "2024-01-20",
      location: "北京",
    },
    {
      id: "2",
      name: "腾讯科技",
      position: "前端开发实习生",
      department: "微信事业群",
      startDate: "2022-07-01",
      endDate: "2023-05-31",
      location: "深圳",
    }
  ],
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
  const [userData, setUserData] = useState<IUserInfo>(mockUserData);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);

  const handleSaveProfile = (updatedUserInfo: IUserInfo) => {
    setUserData(updatedUserInfo);
    setEditDrawerVisible(false);
  };


  const renderTags = (tagsString?: string) => {
    if (!tagsString) return <Text type="secondary">-</Text>;

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
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mx-auto">
        {/* 用户头部卡片 */}
        <Card
          className="rounded-lg mb-6"
          cover={
            userData.banner && (
              <div className="max-h-48 overflow-hidden">
                <Image
                  src={userData.banner}
                  alt="用户封面"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            )
          }
        >
          <div className="relative">
            <div className="flex flex-col items-start gap-5 flex-wrap">
              <div className="relative -mt-16">
                <Avatar
                  size={80}
                  className="border-4 border-white shadow-lg bg-cover bg-center "
                  style={{
                    backgroundImage: userData.avatar ? `url(${userData.avatar})` : undefined,
                  }}
                >
                  {!userData.avatar && userData.username?.charAt(0)}
                </Avatar>
              </div>

              <div className="flex-1 pt-2 w-full flex-wrap">
                <div className="flex items-center gap-3 mb-4">
                  <Title  heading={2} style={{ margin:0 }}>
                    {userData.username}
                  </Title>
                  <Tag color={roleMap[userData.role as keyof typeof roleMap]?.color || "blue"}>
                    {roleMap[userData.role as keyof typeof roleMap]?.text || "普通用户"}
                  </Tag>
                </div>


                <Paragraph className="text-gray-600 mb-4">
                  {userData.introduce || "这个人很懒，什么都没有留下..."}
                </Paragraph>

                <div className="flex gap-2 flex-wrap">
                  <Button type="primary" size="small">
                    <IconUser /> 关注
                  </Button>
                  <Button type="outline" size="small">
                    发送私信
                  </Button>
                  <Button type="outline" size="small" onClick={() => setEditDrawerVisible(true)}>
                    <IconEdit /> 编辑资料
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Row gutter={24}>
        <Col span={24}>
            <Card title="实习经历" className="mb-6 rounded-lg">
              <div className="flex flex-col gap-4">
              {userData.company?.map((item) => (
                <div className="space-y-4">
                  {/* 公司基本信息 */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900 mb-1 text-wrap">
                          {item.name} - {item.location}
                        </h4>
                        <p className="text-gray-600 text-wrap">{item.department}-{item.position}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {item.startDate} - {item.endDate}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
              {userData.company?.length === 0 && <Text type="secondary" className='text-center'>暂无实习经历</Text>}
              </div>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="基本信息" className="mb-6 rounded-lg">
              <Descriptions
                column={1}
                colon={":"}
                data={[
                  {
                    label: "学校",
                    value: userData.school || "-"
                  },
                  {
                    label: "专业",
                    value: userData.major || "-"
                  },
                  {
                    label: "年级",
                    value: userData.grade || "-"
                  },

                ]}
                layout='inline-horizontal'
                labelStyle={{ color: "#4e5969", fontWeight: "500" }}
                valueStyle={{ color: "#1d2129" }}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card title="技能与兴趣" className="mb-6 rounded-lg">
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

      <EditProfileDrawer
        visible={editDrawerVisible}
        onClose={() => setEditDrawerVisible(false)}
        userInfo={userData}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
