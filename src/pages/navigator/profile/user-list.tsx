import { 
  Grid, 
  Input, 
  Space, 
  Button, 
  Typography, 
  Select, 
  Empty,
  Pagination
} from "@arco-design/web-react";
import { useState, useMemo } from "react";
import { IUserInfo } from "@/types/user";
import UserCard from "@/components/profile/UserCard";
import { IconSearch } from "@arco-design/web-react/icon";
import { toast } from "sonner";

const { Title } = Typography;
const { Row, Col } = Grid;

// 模拟用户数据列表
const mockUserList: IUserInfo[] = [
  {
    id: "user_001",
    userId: "dawson_2024",
    username: "Dawson Chen",
    introduce: "全栈开发工程师，专注于 React 和 Node.js 开发。热爱技术分享，致力于构建优雅的用户体验。",
    role: 1,
    school: "清华大学",
    avatar: "/src/assets/favicon.png",
    online: true,
    grade: "2024届",
    major: "计算机科学与技术",
    techDirection: "前端开发,全栈开发,DevOps",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "user_002",
    userId: "alice_dev",
    username: "Alice Wang",
    introduce: "资深UI/UX设计师，擅长产品设计和用户体验优化。",
    role: 0,
    school: "北京大学",
    online: false,
    grade: "2023届",
    major: "视觉传达设计",
    techDirection: "UI设计,产品设计,用户体验",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2024-01-18")
  },
  {
    id: "user_003",
    userId: "bob_backend",
    username: "Bob Li",
    introduce: "后端开发专家，专注于微服务架构和云原生技术。",
    role: 2,
    school: "复旦大学",
    online: true,
    grade: "2022届",
    major: "软件工程",
    techDirection: "后端开发,微服务,云原生",
    createdAt: new Date("2022-09-01"),
    updatedAt: new Date("2024-01-21")
  },
  {
    id: "user_004",
    userId: "charlie_ai",
    username: "Charlie Zhang",
    introduce: "AI研究员，专注于机器学习和深度学习算法研究。",
    role: 1,
    school: "中科院",
    online: true,
    grade: "博士在读",
    major: "人工智能",
    techDirection: "机器学习,深度学习,NLP",
    createdAt: new Date("2023-06-20"),
    updatedAt: new Date("2024-01-19")
  },
  {
    id: "user_005",
    userId: "diana_pm",
    username: "Diana Liu",
    introduce: "产品经理，专注于教育科技产品的规划和设计。",
    role: 0,
    school: "上海交通大学",
    online: false,
    grade: "2023届",
    major: "工商管理",
    techDirection: "产品管理,数据分析,用户研究",
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2024-01-17")
  },
  {
    id: "user_006",
    userId: "evan_mobile",
    username: "Evan Chen",
    introduce: "移动端开发工程师，专注于跨平台应用开发。",
    role: 0,
    school: "浙江大学",
    online: true,
    grade: "2024届",
    major: "移动互联网",
    techDirection: "移动开发,跨平台,React Native",
    createdAt: new Date("2023-08-10"),
    updatedAt: new Date("2024-01-22")
  }
];

const roleOptions = [
  { label: "全部角色", value: "" },
  { label: "普通用户", value: 0 },
  { label: "VIP用户", value: 1 },
  { label: "管理员", value: 2 }
];

const statusOptions = [
  { label: "全部状态", value: "" },
  { label: "在线", value: "online" },
  { label: "离线", value: "offline" }
];

export default function UserListPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | number>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  // 过滤用户数据
  const filteredUsers = useMemo(() => {
    return mockUserList.filter(user => {
      const matchesKeyword = !searchKeyword || 
        user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        user.introduce?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        user.school?.toLowerCase().includes(searchKeyword.toLowerCase());
      
      const matchesRole = selectedRole === "" || user.role === selectedRole;
      const matchesStatus = selectedStatus === "" || 
        (selectedStatus === "online" && user.online === true) ||
        (selectedStatus === "offline" && user.online === false);
      
      return matchesKeyword && matchesRole && matchesStatus;
    });
  }, [searchKeyword, selectedRole, selectedStatus]);

  // 分页数据
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, pageSize]);

  const handleFollow = (userId: string) => {
    toast.success(`已关注用户 ${userId}`);
  };

  const handleMessage = (userId: string) => {
    toast.success(`正在跳转到与用户 ${userId} 的聊天页面`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchKeyword("");
    setSelectedRole("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Title heading={2} className="mb-6 text-center">
          用户列表
        </Title>
        
        {/* 搜索和筛选区域 */}
        <div className="bg-white p-5 rounded-lg mb-6 shadow-lg">
          <Space wrap>
            <Input
              placeholder="搜索用户名、简介、学校"
              value={searchKeyword}
              onChange={setSearchKeyword}
              className="w-60"
              prefix={<IconSearch />}
              allowClear
            />
            
            <Select
              placeholder="选择角色"
              value={selectedRole}
              onChange={setSelectedRole}
              className="w-30"
              options={roleOptions}
            />
            
            <Select
              placeholder="选择状态"
              value={selectedStatus}
              onChange={setSelectedStatus}
              className="w-30"
              options={statusOptions}
            />
            
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
            
            <Button onClick={handleReset}>
              重置
            </Button>
          </Space>
          
          <div className="mt-3 text-gray-600">
            找到 {filteredUsers.length} 个用户
          </div>
        </div>
        
        {/* 用户卡片网格 */}
        {paginatedUsers.length > 0 ? (
          <>
            <Row gutter={[16, 16]} justify="start">
              {paginatedUsers.map((user) => (
                <Col key={user.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                  <UserCard
                    userInfo={user}
                    onFollow={handleFollow}
                    onMessage={handleMessage}
                    compact={true}
                  />
                </Col>
              ))}
            </Row>
            
            {/* 分页 */}
            {filteredUsers.length > pageSize && (
              <div className="text-center mt-8">
                <Pagination
                  current={currentPage}
                  total={filteredUsers.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showTotal={true}
                />
              </div>
            )}
          </>
        ) : (
          <Empty
            description="暂无用户数据"
            className="bg-white p-15 rounded-lg shadow-lg"
          />
        )}
      </div>
    </div>
  );
} 