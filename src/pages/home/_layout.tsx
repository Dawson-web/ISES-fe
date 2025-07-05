import  { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Message } from '@arco-design/web-react';
import { IconHome, IconEdit, IconFindReplace, IconCaretRight, IconCaretLeft, IconMessage } from '@arco-design/web-react/icon';
import { Outlet, useNavigate } from 'react-router-dom';


const Sider = Layout.Sider;
const Content = Layout.Content;
const MenuItem = Menu.Item;

const menuList = [
  {
    key: 'home',
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

  const handleResize = () => {
    if (window.innerWidth < 600) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
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
              <MenuItem key={item.key} className='text-md'>
                {item.icon}
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Layout>
            <Content>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
}

export default _Layout;


