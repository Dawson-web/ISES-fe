import { ReactNode, useEffect, useState } from 'react';
import { Layout, Menu, Avatar } from '@arco-design/web-react';
import { IconCaretRight, IconCaretLeft } from '@arco-design/web-react/icon';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isMobile } from '@/utils';
import '@/styles/home.css';
import { BarChart3, CheckCircle, Coffee, Compass, House, MessageSquareText, SquarePlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserInfoApi } from '@/service/user';
import userStore from '@/store/User';


const Sider = Layout.Sider;
const Content = Layout.Content;
const MenuItem = Menu.Item;

type MenuItemConfig = { key: string; icon: ReactNode; label: string; adminOnly?: boolean };

const DEFAULT_MENU_LIST: MenuItemConfig[] = [
  {
    key: '/navigator',
    icon: <Compass size={16} />,
    label: '首页',
  },
  {
    key: '/navigator/publish',
    icon: <SquarePlus size={16} />,
    label: '发布',
  },
  {
    key: '/navigator/explore',
    icon: <House size={16} />,
    label: '发现',
  },
  {
    key: '/navigator/info',
    icon: <Coffee size={16} />,
    label: '爆料',
  },
  {
    key: '/navigator/chat',
    icon: <MessageSquareText size={16} />,
    label: '消息',
  },
  {
    key: '/navigator/approve',
    icon: <CheckCircle size={16} />,
    label: '审批',
    adminOnly: true,
  },
  {
    key: '/navigator/dashboard',
    icon: <BarChart3 size={16} />,
    label: '数据大盘',
    adminOnly: true,
  },
];

const _Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  let menuList = DEFAULT_MENU_LIST;

  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const monitorResizeChange = () => {
    if (window.innerWidth < 600) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }

  useEffect(() => {
    window.addEventListener('resize', monitorResizeChange);
    return () => {
      window.removeEventListener('resize', monitorResizeChange);
    };
  }, []);

  if (userStore.role !== 2) {
    menuList = menuList.filter((item) => !item.adminOnly);
  }


  //获取信息
  useQuery({
    queryKey: ["initUserStore"],
    queryFn: () => getUserInfoApi().then((res) => {
      userStore.setUserInfo(res.data.data);
      return res.data.data
    })
      .catch(() => {
        navigate('/login');
      })
  });


  return (
    <Layout className='h-screen w-full'>
      <Sider
        collapsed={collapsed}
        onCollapse={handleCollapsed}
        collapsible
        trigger={collapsed ? <IconCaretRight fontSize={20} /> : <IconCaretLeft fontSize={20} />}
        breakpoint='xl'
      >
        <div className='logo' />
        <Menu
          selectedKeys={(() => {
            // 按路径长度降序排序，确保更具体的路径优先匹配
            const sortedMenuList = [...menuList].sort((a, b) => b.key.length - a.key.length);
            const foundItem = sortedMenuList.find((item) => location.pathname.startsWith(item.key));
            return foundItem ? [foundItem.key] : [];
          })()}
        >
          <div key='avatar' className='flex justify-center items-center my-4 cursor-pointer' onClick={() => {
            navigate('/navigator/profile');
          }}>
            <Avatar size={collapsed ? 28 : 32}>
              <img src={userStore.avatar} alt="avatar" />
            </Avatar>
          </div>
          {menuList.map((item) => (
            <MenuItem
              key={item.key}
              className='text-md flex items-center justify-between gap-2 h-10'
              onClick={() => {
                navigate(`${item.key}`);
              }}>
              <div className='flex items-center gap-4'>
                {item.icon}
                {item.label}
              </div>
            </MenuItem>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Layout>
          <Content>
            {isMobile() && !collapsed ? (
              <div className='relative h-full w-full overflow-hidden '>
                {/* 主要内容 */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">

                  {/* 装饰性图片 */}
                  <div className="absolute bottom-0 right-0 w-4/5 ">
                    <img
                      src="https://s1.aigei.com/prevfiles/e9376421f6f741c095c88c03a7bb4138.gif?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:FYxLbRF0IxOn_oHJMnz2o0UWwsw="
                      className='w-full h-auto object-contain'
                      alt="ISES动画"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default _Layout;

