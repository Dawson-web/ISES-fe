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
import { Layout, Menu, Button, Tabs } from '@arco-design/web-react';
import {  IconCaretRight, IconCaretLeft } from '@arco-design/web-react/icon';
import { Outlet } from 'react-router-dom';

const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;
const TabPane = Tabs.TabPane;


const _Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<'horizontal' | 'vertical'>('horizontal');
  
  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleResize = () => {
    if (window.innerWidth < 1000) {
      setMode('horizontal');
    } else {
      setMode('vertical');
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
       {mode === 'vertical' && <Sider collapsed={collapsed} onCollapse={handleCollapsed} breakpoint='xl'>
          <div className='logo' />
          <Menu style={{ width: '100%' }}>
            <Button shape='round' className='trigger' onClick={handleCollapsed} size='default'>
              {collapsed ? <IconCaretRight /> : <IconCaretLeft />}
            </Button>
          </Menu>
        </Sider>}
        <Layout>
          {mode === 'horizontal' && <Header>
              <Tabs defaultActiveTab='key1' direction='horizontal' style={{ height: 200 }}>
                <TabPane destroyOnHide key='1' title='Home'>
                  <div>Home</div>
                </TabPane>
                <TabPane destroyOnHide key='2' title='Solution'>
                  <div>Solution</div>
                </TabPane>
                <TabPane destroyOnHide key='3' title='Cloud Service'>
                  <div>Cloud Service</div>
                </TabPane>
                <TabPane destroyOnHide key='4' title='Cooperation'>
                  <div>Cooperation</div>
                </TabPane>
                <TabPane destroyOnHide key='5' title='About'>
                  <div>About</div>
                </TabPane>
                <TabPane destroyOnHide key='6' title='Contact'>
                  <div>Contact</div>
                </TabPane>
              </Tabs>
          </Header>}
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


