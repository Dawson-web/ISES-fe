import clsx from "clsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/service/user";
import NavMenu from "@/components/nav_menu";
import { themeConfig } from "@/config";
import { createWebSocket, websocketClose } from "@/service/websocket";
import ScoketMessage from "@/components/scoket-message";
import { IWSMessage } from "@/types/websocket";
import { useQuery } from "@tanstack/react-query";

export let socket: WebSocket | null = null;

export default function Layout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<IWSMessage>({
    type: "tetx",
    content: "欢迎来到 ISES",
    username: "",
  });
  const { isSuccess, isError, data } = useQuery({
    queryKey: ["init"],
    queryFn: () => {
      socket = createWebSocket(setMessage, "system");
      return getUserInfo();
    },
  });
  // 关闭websocket
  useEffect(() => {
    if (socket) websocketClose(socket);
  }, []);
  if (isError) {
    navigate("/login");
    websocketClose(socket as WebSocket);
  } else {
    return (
      isSuccess && (
        <div className={clsx("flex flex-col  sm:flex-row  w-full  ")}>
          <NavMenu
            options={themeConfig.menu.options}
            darkMode={themeConfig.menu.darkMode}
            avatar_show={themeConfig.menu.avatar_show}
            avatar_src={data.data.data.avatar}
            userName={data.data.data.username}
            className="sm:w-[200px] sm:h-screen  sm:relative  z-50 w-full dark:bg-theme_dark h-full "
          />

          <main
            className={clsx(
              "flex-1 p-[1rem]  flex flex-col items-center  bg-gray-200 dark:bg-theme_dark_sm min-h-screen"
            )}
          >
            <ScoketMessage
              message={message}
              className="fixed sm:top-2 top-0 ml-4  "
            />
            <Outlet />
          </main>
        </div>
      )
    );
  }
}
