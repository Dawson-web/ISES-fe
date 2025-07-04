// import clsx from "clsx";
// import { Outlet, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getUserInfo } from "@/service/user";
// import { themeConfig } from "@/config";
// import { createWebSocket, websocketClose } from "@/service/websocket";
// import ScoketMessage from "@/components/scoket-message";
// import { IWSMessage } from "@/types/websocket";
// import { useQuery } from "@tanstack/react-query";
// import NavMenu from "@/components/public/nav_menu";
// import { layoutFunction } from "@/utils/layout";

// export let socket: WebSocket | null = null;

// export default function Layout() {
//   const navigate = useNavigate();
//   const [message, setMessage] = useState<IWSMessage>({
//     type: "tetx",
//     content: "欢迎来到 ISES",
//     username: "",
//   });
//   const { isSuccess, isError, data } = useQuery({
//     queryKey: ["init"],
//     queryFn: () => {
//       socket = createWebSocket(setMessage, "system");
//       return getUserInfo();
//     },
//   });
//   const [vercel, setVercel] = useState(false);
//   // 关闭websocket
//   useEffect(() => {
//     layoutFunction(setVercel);
//     if (socket) websocketClose(socket);
//   }, []);

//   if (isError) {
//     navigate("/login");
//     websocketClose(socket as WebSocket);
//   } else {
//     return (
//       isSuccess && (
//         <div
//           className={clsx("flex w-full flex-col h-full  ", {
//             "sm:flex-row": !vercel,
//             "sm:flex-col": vercel,
//           })}
//         >
//           <NavMenu
//             options={themeConfig.menu.options}
//             darkMode={themeConfig.menu.darkMode}
//             avatar_show={themeConfig.menu.avatar_show}
//             avatar_src={data.data.data.avatar}
//             userName={data.data.data.username}
//             vercel={vercel}
//             setVercel={setVercel}
//             // className={clsx(
//             //   "sm:relative z-50  ",
//             //   {
//             //     "flex justify-start": open,
//             //   },
//             //   {
//             //     "flex-col sm:h-screen w-[200px]": !vercel,
//             //     "flex-row flex-nowrap ": vercel,
//             //   }
//             // )}
//           />
//           <main
//             className={clsx(
//               "flex-1 p-[1rem]  flex flex-col items-center  min-h-screen h-full"
//             )}
//           >
//             <ScoketMessage
//               message={message}
//               className="fixed sm:top-2 top-0 ml-4  "
//             />
//             <Outlet />
//           </main>
//         </div>
//       )
//     );
//   }
// }

import  { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Message } from '@arco-design/web-react';
import { IconHome, IconEdit, IconFindReplace, IconCaretRight, IconCaretLeft, IconMessage } from '@arco-design/web-react/icon';
import { Outlet } from 'react-router-dom';


const Sider = Layout.Sider;
const Footer = Layout.Footer;
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
             <div key='avatar' className='flex justify-center items-center my-4'>
              <Avatar size={collapsed ? 28 : 32}>A</Avatar>
            </div>
            {menuList.map((item) => (
              <MenuItem key={item.key} className='text-lg'>
                {item.icon}
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Layout style={{ padding: '0 24px' }}>
            <Content>
              <Outlet />
            </Content>
            <Footer>Footer</Footer>
          </Layout>
        </Layout>
      </Layout>
    );
}

export default _Layout;


