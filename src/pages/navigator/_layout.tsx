import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Spin, Badge } from '@arco-design/web-react';
import { IconCaretRight, IconCaretLeft } from '@arco-design/web-react/icon';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isMobile } from '@/utils';
import '@/styles/home.css';
import {
  BarChart3,
  Bell,
  BookOpen,
  Coffee,
  Compass,
  House,
  MessageSquareText,
  ShieldCheck,
  SquarePlus,
  BriefcaseBusiness,
  Network,
  GraduationCap,
  Megaphone,
  Settings,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserInfoApi } from '@/service/user';
import { getUnreadCountApi } from '@/service/notification';
import userStore from '@/store/User';
import notificationStore from '@/store/notification';
import { observer } from 'mobx-react-lite';

const Sider = Layout.Sider;
const Content = Layout.Content;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

// 单项菜单配置
interface FlatMenuItemConfig {
  type: 'item';
  key: string;
  icon: ReactNode;
  label: string;
  adminOnly?: boolean;
}

// 分组菜单配置
interface GroupMenuItemConfig {
  type: 'group';
  key: string;
  icon: ReactNode;
  label: string;
  adminOnly?: boolean;
  children: Omit<FlatMenuItemConfig, 'type'>[];
}

type MenuItemConfig = FlatMenuItemConfig | GroupMenuItemConfig;

const DEFAULT_MENU_LIST: MenuItemConfig[] = [
  { type: 'item', key: '/navigator', icon: <Compass size={16} />, label: '首页' },
  { type: 'item', key: '/navigator/publish', icon: <SquarePlus size={16} />, label: '发布' },
  {
    type: 'group',
    key: 'group-discover',
    icon: <House size={16} />,
    label: '发现',
    children: [
      { key: '/navigator/explore', icon: <House size={14} />, label: '发现广场' },
      { key: '/navigator/info', icon: <Coffee size={14} />, label: '爆料' },
    ],
  },
  { type: 'item', key: '/navigator/referrals', icon: <BriefcaseBusiness size={16} />, label: '内推' },
  {
    type: 'group',
    key: 'group-campus',
    icon: <GraduationCap size={16} />,
    label: '校园',
    children: [
      { key: '/navigator/campus', icon: <BookOpen size={14} />, label: '面经题库' },
      { key: '/navigator/alumni-network', icon: <Network size={14} />, label: '校友图谱' },
    ],
  },
  {
    type: 'group',
    key: 'group-interact',
    icon: <Megaphone size={16} />,
    label: '互动',
    children: [
      { key: '/navigator/chat', icon: <MessageSquareText size={14} />, label: '消息' },
      { key: '/navigator/notifications', icon: <Bell size={14} />, label: '通知' },
    ],
  },
  {
    type: 'group',
    key: 'group-admin',
    icon: <Settings size={16} />,
    label: '管理',
    adminOnly: true,
    children: [
      { key: '/navigator/admin', icon: <ShieldCheck size={14} />, label: '管理面板' },
      { key: '/navigator/dashboard', icon: <BarChart3 size={14} />, label: '数据大盘' },
    ],
  },
];

const _Layout = observer(() => {
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

  // 初始化通知 WebSocket 连接
  useEffect(() => {
    notificationStore.connectWebSocket();
    return () => {
      notificationStore.disconnectWebSocket();
    };
  }, []);

  // 获取未读通知数量（定期轮询作为 WebSocket 的补充）
  useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () =>
      getUnreadCountApi().then((res) => {
        notificationStore.setUnreadCount(res.data.data.count);
        return res.data.data;
      }),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });

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

  // 收集所有叶子菜单项用于匹配
  const allLeafItems = menuList.flatMap((item) =>
    item.type === 'group' ? item.children : [item],
  );

  // 计算当前激活菜单
  const selectedKeys = (() => {
    const sorted = [...allLeafItems].sort((a, b) => b.key.length - a.key.length);
    const found = sorted.find((leaf) => location.pathname.startsWith(leaf.key));
    return found ? [found.key] : [];
  })();

  // 计算展开的子菜单
  const openKeys = (() => {
    const keys: string[] = [];
    menuList.forEach((item) => {
      if (item.type === 'group') {
        const hasActive = item.children.some((child) =>
          location.pathname.startsWith(child.key),
        );
        if (hasActive) {
          keys.push(item.key);
        }
      }
    });
    return keys;
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
        <Menu selectedKeys={selectedKeys} defaultOpenKeys={openKeys}>
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

          {menuList.map((item) => {
            if (item.type === 'group') {
              // 检查互动分组是否含有未读通知
              const hasUnread = item.children.some(
                (child) => child.key === '/navigator/notifications',
              );

              return (
                <SubMenu
                  key={item.key}
                  title={
                    <div className="flex items-center gap-3">
                      {hasUnread && notificationStore.unreadCount > 0 ? (
                        <Badge count={notificationStore.unreadCount} dot={collapsed} offset={[4, -2]}>
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                      <span>{item.label}</span>
                    </div>
                  }
                >
                  {item.children.map((child) => (
                    <MenuItem
                      key={child.key}
                      className="text-md flex items-center gap-2"
                      onClick={() => navigate(child.key)}
                    >
                      <div className="flex items-center gap-3">
                        {child.key === '/navigator/notifications' ? (
                          <Badge count={notificationStore.unreadCount} dot offset={[4, -2]}>
                            {child.icon}
                          </Badge>
                        ) : (
                          child.icon
                        )}
                        {child.label}
                      </div>
                    </MenuItem>
                  ))}
                </SubMenu>
              );
            }

            return (
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
            );
          })}
        </Menu>
      </Sider>

      <Layout>
        <Content>
          {isMobile() && !collapsed ? (
            <div className="relative h-full w-full flex items-center justify-center bg-page">
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
});

export default _Layout;
