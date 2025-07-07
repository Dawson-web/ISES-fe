import { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Message } from '@arco-design/web-react';
import { IconHome, IconEdit, IconFindReplace, IconCaretRight, IconCaretLeft, IconMessage, IconCommon, IconEye } from '@arco-design/web-react/icon';
import { Outlet, useNavigate } from 'react-router-dom';
import { isMobile } from '@/utils';
import '@/styles/home.css';


const Sider = Layout.Sider;
const Content = Layout.Content;
const MenuItem = Menu.Item;

const menuList = [
  {
    key: '/home',
    icon: <IconHome />,
    label: '首页',
  },
  {
    key: 'edit',
    icon: <IconEdit />,
    label: '创作中心',
  },
  {
    key: '/article/list',
    icon: <IconEye />,
    label: '文章',
  },
  {
    key: 'info',
    icon: <IconFindReplace />,
    label: '爆料',
  },
  {
    key: 'message',
    icon: <IconMessage />,
    label: '消息',
  },
];

const _Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

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
          defaultOpenKeys={['1']}
          defaultSelectedKeys={['0_3']}
          onClickMenuItem={(key) =>
            Message.info({
              content: `You select ${key}`,
              showIcon: true,
            })
          }
        >
          <div key='avatar' className='flex justify-center items-center my-4 cursor-pointer' onClick={() => {
            navigate('/home/profile');
          }}>
            <Avatar size={collapsed ? 28 : 32}>A</Avatar>
          </div>
          {menuList.map((item) => (
            <MenuItem key={item.key} className='text-md' onClick={() => {
              navigate(`${item.key}`);
            }}>
              {item.icon}
              {item.label}
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


