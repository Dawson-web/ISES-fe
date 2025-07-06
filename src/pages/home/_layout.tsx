import { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Message } from '@arco-design/web-react';
import { IconHome, IconEdit, IconFindReplace, IconCaretRight, IconCaretLeft, IconMessage, IconCommon } from '@arco-design/web-react/icon';
import { Outlet, useNavigate } from 'react-router-dom';
import { isMobile } from '@/utils';
import '@/styles/home.css';


const Sider = Layout.Sider;
const Content = Layout.Content;
const MenuItem = Menu.Item;

const menuList = [
  {
    key: '',
    icon: <IconHome />,
    label: '首页',
  },
  {
    key: 'edit',
    icon: <IconEdit />,
    label: '创作中心',
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
              navigate(`/home/${item.key}`);
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
              <div className='relative h-full w-full overflow-hidden bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-700/90'>
                {/* 背景装饰 */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                
                {/* 主要内容 */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
                  <div className="text-center mb-8">
                    <div className="text-6xl font-bold mb-4 text-white">
                      ISES
                    </div>
                    <div className="text-lg opacity-90 font-medium tracking-wide mb-6">
                      智能教育分享社区
                    </div>
                    <div className="text-sm opacity-75 max-w-xs mx-auto leading-relaxed">
                      发现优质内容，分享技术洞察，与同行交流成长
                    </div>
                  </div>
                  
                  {/* 装饰性图片 */}
                  <div className="absolute bottom-0 right-0 w-4/5 opacity-30">
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


