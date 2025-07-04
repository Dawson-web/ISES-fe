import { Typography, Card, Space, Button } from "@arco-design/web-react";
import { useState } from "react";
import { IUserInfo } from "@/types/user";
import UserCard from "@/components/profile/UserCard";
import { toast } from "sonner";

const { Title, Paragraph } = Typography;

// 示例用户数据
const exampleUser: IUserInfo = {
  id: "demo_user_001",
  userId: "demo_dawson",
  username: "演示用户",
  introduce: "这是一个演示用户，展示如何使用 IUserInfo 接口构建的用户信息组件。包含完整的用户资料信息。",
  role: 1,
  school: "演示大学",
  avatar: "/src/assets/favicon.png",
  online: true,
  grade: "2024届",
  company: {
    name: "演示公司",
    position: "高级工程师",
    department: "技术部"
  },
  circles: "技术圈,产品圈,设计圈",
  major: "计算机科学",
  techDirection: "前端开发,全栈开发,UI设计",
  banner: "/src/assets/home-bg.png",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2024-01-20")
};

export default function DemoPage() {
  const [userData, setUserData] = useState<IUserInfo>(exampleUser);

  const handleFollow = (userId: string) => {
    toast.success(`已关注用户 ${userId}`);
  };

  const handleMessage = (userId: string) => {
    toast.success(`正在跳转到与用户 ${userId} 的聊天页面`);
  };

  const toggleOnlineStatus = () => {
    setUserData(prev => ({
      ...prev,
      online: !prev.online
    }));
  };

  const changeRole = () => {
    setUserData(prev => ({
      ...prev,
      role: prev.role === 0 ? 1 : prev.role === 1 ? 2 : 0
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Title heading={2} className="mb-6 text-center">
          用户信息组件演示
        </Title>
        
        <Card className="mb-6">
          <Title heading={4}>组件特性</Title>
          <Paragraph>
            基于您提供的 <code>IUserInfo</code> 接口，我们创建了以下组件：
          </Paragraph>
          <ul className="pl-5 text-gray-600">
            <li><strong>完整的用户信息页面</strong> - 展示所有用户数据字段</li>
            <li><strong>用户卡片组件</strong> - 支持 compact 模式，适合列表展示</li>
            <li><strong>用户列表页面</strong> - 包含搜索、筛选、分页功能</li>
            <li><strong>响应式设计</strong> - 适配不同屏幕尺寸</li>
            <li><strong>丰富的交互</strong> - 关注、私信、在线状态等</li>
          </ul>
        </Card>

        <Card className="mb-6">
          <Title heading={4}>数据结构</Title>
          <Paragraph>
            <code>IUserInfo</code> 接口包含以下字段：
          </Paragraph>
          <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto">
{`interface IUserInfo {
  id: string;                    // 用户ID
  userId: string;                // 用户标识
  username: string;              // 用户名
  introduce?: string;            // 个人简介
  role: number;                  // 角色 (0:普通用户 1:VIP 2:管理员)
  school?: string;               // 学校
  avatar?: string;               // 头像
  online?: boolean;              // 在线状态
  grade?: string;                // 年级
  company?: any;                 // 公司信息
  circles?: string;              // 兴趣圈子
  major?: string;                // 专业
  techDirection?: string;        // 技术方向
  banner?: string;               // 个人横幅
  createdAt?: Date;              // 创建时间
  updatedAt?: Date;              // 更新时间
}`}
          </pre>
        </Card>

        <Card className="mb-6">
          <Title heading={4}>交互演示</Title>
          <Space className="mb-4">
            <Button onClick={toggleOnlineStatus} type="outline">
              切换在线状态 (当前: {userData.online ? "在线" : "离线"})
            </Button>
            <Button onClick={changeRole} type="outline">
              切换角色 (当前: {["普通用户", "VIP用户", "管理员"][userData.role]})
            </Button>
          </Space>
          
          <div className="flex gap-5 flex-wrap">
            <UserCard 
              userInfo={userData} 
              onFollow={handleFollow}
              onMessage={handleMessage}
              compact={false}
            />
            <UserCard 
              userInfo={userData} 
              onFollow={handleFollow}
              onMessage={handleMessage}
              compact={true}
            />
          </div>
        </Card>

        <Card>
          <Title heading={4}>页面导航</Title>
          <Space>
            <Button type="primary" href="/home/profile">
              完整用户信息页面
            </Button>
            <Button type="outline" href="/home/profile/user-list">
              用户列表页面
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
} 