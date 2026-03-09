import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Spin } from '@arco-design/web-react';
import { IconCaretRight, IconCaretLeft } from '@arco-design/web-react/icon';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isMobile } from '@/utils';
import '@/styles/home.css';
import { BarChart3, Coffee, Compass, House, MessageSquareText, ShieldCheck, SquarePlus, BriefcaseBusiness } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserInfoApi } from '@/service/user';
import userStore from '@/store/User';

const Sider = Layout.Sider;
const Content = Layout.Content;
const MenuItem = Menu.Item;

interface MenuItemConfig {
  key: string;
  icon: ReactNode;
  label: string;
  adminOnly?: boolean;
}

const DEFAULT_MENU_LIST: MenuItemConfig[] = [
  { key: '/navigator', icon: <Compass size={16} />, label: '首页' },
  { key: '/navigator/publish', icon: <SquarePlus size={16} />, label: '发布' },
  { key: '/navigator/explore', icon: <House size={16} />, label: '发现' },
  { key: '/navigator/referrals', icon: <BriefcaseBusiness size={16} />, label: '岗位内推' },
  { key: '/navigator/info', icon: <Coffee size={16} />, label: '爆料' },
  { key: '/navigator/chat', icon: <MessageSquareText size={16} />, label: '消息' },
  { key: '/navigator/admin', icon: <ShieldCheck size={16} />, label: '管理员', adminOnly: true },
  { key: '/navigator/dashboard', icon: <BarChart3 size={16} />, label: '数据大盘', adminOnly: true },
];

const _Layout = () => {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 600);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  // 带防抖的 resize 监听
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setCollapsed(window.innerWidth < 600);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 根据角色过滤菜单
  const menuList = userStore.role === 2
    ? DEFAULT_MENU_LIST
    : DEFAULT_MENU_LIST.filter((item) => !item.adminOnly);

  // 获取用户信息
  const { isLoading } = useQuery({
    queryKey: ['initUserStore'],
    queryFn: () =>
      getUserInfoApi().then((res) => {
        userStore.setUserInfo(res.data.data);
        return res.data.data;
      }),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  // 计算当前激活菜单
  const selectedKeys = (() => {
    const sorted = [...menuList].sort((a, b) => b.key.length - a.key.length);
    const found = sorted.find((item) => location.pathname.startsWith(item.key));
    return found ? [found.key] : [];
  })();

  return (
    <Layout className="h-screen w-full">
      <Sider
        collapsed={collapsed}
        onCollapse={handleCollapsed}
        collapsible
        trigger={collapsed ? <IconCaretRight fontSize={20} /> : <IconCaretLeft fontSize={20} />}
        breakpoint="xl"
      >
        <div className="logo" />
        <Menu selectedKeys={selectedKeys}>
          {/* 头像区域 */}
          <div
            key="avatar"
            className="flex justify-center items-center my-4 cursor-pointer"
            onClick={() => navigate('/navigator/profile')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate('/navigator/profile');
            }}
            tabIndex={0}
            role="button"
            aria-label="查看个人资料"
          >
            {isLoading ? (
              <Spin size={20} />
            ) : (
              <Avatar size={collapsed ? 28 : 32}>
                {userStore.avatar ? (
                  <img src={userStore.avatar} alt="头像" />
                ) : (
                  userStore.username?.charAt(0) || 'U'
                )}
              </Avatar>
            )}
          </div>

          {menuList.map((item) => (
            <MenuItem
              key={item.key}
              className="text-md flex items-center justify-between gap-2 h-10"
              onClick={() => navigate(item.key)}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                {item.label}
              </div>
            </MenuItem>
          ))}
        </Menu>
      </Sider>

      <Layout>
        <Content>
          {isMobile() && !collapsed ? (
            <div className="relative h-full w-full flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-400 px-8">
                <p className="text-lg font-medium mb-2">请收起侧边栏</p>
                <p className="text-sm">点击左侧箭头收起菜单后查看内容</p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default _Layout;
