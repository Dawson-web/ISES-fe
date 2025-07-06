import { useState, useEffect } from 'react';
import { Input, Select, Button, Typography, Space, Avatar, Divider } from '@arco-design/web-react';
import { IconSearch, IconEdit, IconDown } from '@arco-design/web-react/icon';
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

  // 模拟数据
  const colorPalette = [
    { color: '#3370FF', name: '主色', size: 'large' },
    { color: '#3370FF', name: '主色', size: 'medium' },
    { color: '#86E8FF', name: '浅蓝', size: 'small' },
    { color: '#86E8FF', name: '浅蓝', size: 'medium' },
    { color: '#86E8FF', name: '浅蓝', size: 'small' },
    { color: '#FF7D00', name: '橙色', size: 'small' },
    { color: '#00B42A', name: '绿色', size: 'small' },
    { color: '#F53F3F', name: '红色', size: 'small' },
    { color: '#3370FF', name: '蓝色', size: 'small' },
  ];

  const listItems = [
    {
      id: 1,
      avatar: '👤',
      name: 'By Arco Smart Allen',
      description: 'Byteelance Technology',
      color: '#3370FF'
    },
    {
      id: 2,
      avatar: '⚪',
      name: 'By Arco Little Bob',
      description: 'Byteelance Technology',
      color: '#86909C'
    },
    {
      id: 3,
      avatar: '🔵',
      name: 'By Arco Uncle Tony',
      description: 'Byteelance Technology',
      color: '#3370FF'
    }
  ];

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    openUserProfile();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <Title heading={5} className="text-gray-900 mb-0">ArcoDesign</Title>
              <Text className="text-gray-500 text-sm">A description</Text>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button type="primary" size="small">Large</Button>
            <Button type="secondary" size="small">Medium</Button>
            <Button type="secondary" size="small">Small</Button>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-6">
        <div className="flex gap-8">
          {/* 左侧调色板 */}
          <div className="w-64">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              {/* 主色块 */}
              <div className="mb-4">
                <div className="w-full h-20 bg-blue-500 rounded-lg mb-2"></div>
                <div className="flex gap-2 mb-2">
                  <div className="w-12 h-12 bg-blue-500 rounded"></div>
                  <div className="w-12 h-12 bg-blue-400 rounded"></div>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="w-12 h-12 bg-blue-200 rounded"></div>
                  <div className="w-12 h-12 bg-blue-300 rounded"></div>
                  <div className="w-12 h-12 bg-blue-100 rounded"></div>
                </div>
              </div>

              {/* 其他色块 */}
              <div className="flex gap-2 mb-4">
                <div className="w-12 h-6 bg-orange-500 rounded"></div>
                <div className="w-12 h-6 bg-green-500 rounded"></div>
                <div className="w-12 h-6 bg-red-500 rounded"></div>
                <div className="w-12 h-6 bg-blue-600 rounded"></div>
              </div>

              {/* 文字示例 */}
              <div className="text-center py-4">
                <Text className="text-2xl font-bold text-gray-900">Aa</Text>
              </div>

              {/* 按钮示例 */}
              <div className="space-y-2">
                <Button type="primary" long>
                  Primary
                </Button>
                <Button type="secondary" long>
                  Default
                </Button>
              </div>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* 搜索框 */}
              <div className="mb-6">
                <Input
                  placeholder="Search"
                  prefix={<IconSearch />}
                  value={searchValue}
                  onChange={setSearchValue}
                  className="mb-4"
                  style={{ maxWidth: '300px' }}
                />
              </div>

              {/* 选择器 */}
              <div className="mb-6">
                <Select
                  placeholder="Select"
                  value={selectValue}
                  onChange={setSelectValue}
                  style={{ width: '300px' }}
                  suffixIcon={<IconDown />}
                >
                  <Select.Option value="option1">Option 1</Select.Option>
                  <Select.Option value="option2">Option 2</Select.Option>
                  <Select.Option value="option3">Option 3</Select.Option>
                </Select>
              </div>

              {/* 列表项 */}
              <div className="space-y-3">
                {listItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.avatar}
                      </div>
                      <div>
                        <Text className="font-medium text-gray-900">{item.name}</Text>
                        <Text className="text-sm text-gray-500">{item.description}</Text>
                      </div>
                    </div>
                    <Button 
                      type="text" 
                      size="small"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>

              {/* 底部操作区 */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button type="secondary" icon={<IconDown />}>
                      <span className="ml-2">Options</span>
                    </Button>
                    <Button type="secondary" icon={<IconDown />}>
                      <span className="ml-2">More</span>
                    </Button>
                  </div>
                  <div className="text-2xl">
                    😊
                  </div>
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