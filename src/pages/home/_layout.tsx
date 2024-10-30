import clsx from "clsx";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IUserFormData } from "@/types/user";
import { getUserInfo } from "@/service/user";
import NavMenu from "@/components/nav_menu";
import Loading from "@/components/loading";
import { themeConfig } from "@/config";
import { createWebSocket } from "@/service/websocket";
import ScoketMessage from "@/components/scoket-message";
import { IWSMessage } from "@/types/websocket";

let isInited = false;
export let scoket: WebSocket | null = null;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation(); // 引入 useLocation 钩子
  const [message, setMessage] = useState<IWSMessage>({
    type: "tetx",
    content: "欢迎来到 ISES",
    username: "",
  });

  const [userFormData, setUserFormData] = useState<IUserFormData>(
    null as unknown as IUserFormData
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadings, setIsLoadings] = useState(true);

  useEffect(() => {
    if (!isInited) {
      getUserInfo()
        .then((res) => {
          isInited = true;
          setUserFormData(res.data.data);
          scoket = createWebSocket(setMessage, "system");
        })
        .catch((e) => {
          console.log(e);
          navigate("/login");
        });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    setIsLoadings(true);
    const timer = setTimeout(() => {
      setIsLoadings(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  if (isLoading) return <Loading />;

  return (
    <div className={clsx("flex flex-col  sm:flex-row  w-full sm:h-full ")}>
      <NavMenu
        options={themeConfig.menu.options}
        darkMode={themeConfig.menu.darkMode}
        avatar_show={themeConfig.menu.avatar_show}
        avatar_src={userFormData.avatar}
      />
      <main
        className={clsx(
          "flex-1 p-[1rem]  flex flex-col items-center  bg-gray-200 dark:bg-theme_dark_sm min-h-screen h-screen overflow-y-auto pt-[40px] sm:[pt-0]"
        )}
      >
        <ScoketMessage
          message={message}
          className="fixed sm:top-2 top-0 ml-4  "
        />

        {isLoadings ? <Loading /> : <Outlet />}
      </main>
    </div>
  );
}
