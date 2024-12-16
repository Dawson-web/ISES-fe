import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { LogOutIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { DarkMode } from "./DarkMode";
import { NavOpen } from "./NavOpen";
import UserAvatar from "../user_avatar";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Logout } from "./Logout";
import AppLogo from "../app-logo";
import { LayoutModel } from "./LayoutModel";
import { Settings } from "lucide-react";
import { UnstyledButton } from "@mantine/core";
import { Menu } from "@mantine/core";
import darkFunction from "@/utils/dark";
import { useDisclosure } from "@mantine/hooks";

interface OptionData {
  name: string;
  herf: string;
  icon: JSX.Element;
}

interface IProps {
  options: OptionData[];
  darkMode: boolean;
  avatar_show?: boolean;
  className?: string;
  avatar_src?: string;
  userName?: string;
  vercel: boolean;
  setVercel: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavMenu: FC<IProps> = ({
  options,
  darkMode,
  avatar_show,
  className,
  avatar_src,
  userName,
  vercel,
  setVercel,
}) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const location = window.location.pathname;
  let defaultOption = "主页";
  switch (location) {
    case "/home":
      defaultOption = "主页";
      break;
    case "/home/post":
      defaultOption = "发布";
      break;
    case "/home/components":
      defaultOption = "组件";
      break;
    case "/home/chat":
      defaultOption = "友链";
      break;
    case "/home/profile":
      defaultOption = "个人";
      break;
  }
  const [option, setOption] = useState<string>(defaultOption);
  const [opened, { toggle, close }] = useDisclosure(false);

  function menuOption(options: string) {
    setOption(options);
    setTimeout(() => setMobileOpen(false), 1000);
  }
  useEffect(() => {
    const theme = localStorage.getItem("theme") == "dark";
    darkFunction(theme);
  }, []);
  // useEffect(() => {
  //   const pathname = location.pathname;
  //   switch (pathname) {
  //     case "/home":
  //       setOption("主页");
  //       break;
  //     case "/home/post":
  //       setOption("发布");
  //       break;
  //     case "/home/components":
  //       setOption("组件");
  //       break;
  //     case "/home/chat":
  //       setOption("友链");
  //       break;
  //     case "/home/profile":
  //       setOption("个人");
  //       break;
  //   }
  // }, [location]);

  return (
    <div className={clsx(className)}>
      {/* 移动端控制菜单打开按钮 */}
      <NavOpen open={mobileOpen} setOpen={setMobileOpen} />
      <aside
        className={clsx("bg-white dark:bg-theme_dark w-full", {
          "fixed z-40 mt-[40px] h-full ": mobileOpen,
          "sm:block hidden ": !mobileOpen,
        })}
      >
        <NavigationMenu className="w-full">
          <NavigationMenuList
            className={clsx({
              "sm:flex w-full justify-center ": vercel,
              "h-full sm:flex flex-col justify-start overflow-hidden pt-[20px] sm:pt-[30px]  bg-white dark:bg-theme_dark":
                !vercel,
            })}
          >
            <AppLogo
              className={clsx(
                "ml-[40px]  text-[35px] dark:text-gray-600 font-bold  mb-1 ",
                { "absolute left-0 h-full": vercel && !mobileOpen }
              )}
            />
            {(!vercel || mobileOpen) && (
              <div className="mx-auto px-10 mt-[40px] flex flex- items-end gap-2">
                {avatar_show && <UserAvatar src={avatar_src} size="medium" />}
                <div className="bg-theme_blue dark:bg-theme_blue text-white text-sm px-2 py-1 rounded-md font-bold truncate w-[80px] text-center">
                  {userName}
                </div>
              </div>
            )}
            {options.map((item: OptionData) => {
              return (
                <Link
                  to={item.herf}
                  onClick={() => menuOption(item.name)}
                  key={item.herf}
                >
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={clsx(
                        " group sm:my-4 my-6  flex items-en dark:bg-theme_dark dark:text-gray-600 text-md font-semibold 	 ",
                        {
                          "px-4 gap-4": vercel && !mobileOpen,
                          "px-10 gap-8 ": !vercel || mobileOpen,
                        },
                        {
                          "transition-[transform] duration-300 translate-x-6  border-l-4 border-l-theme_blue dark:text-theme_gray":
                            option == item.name && !vercel,
                          "transition-[transform] translate-x-0":
                            option !== item.name && !vercel,
                        },
                        {
                          "transition-[color] duration-300   text-theme_blue dark:text-theme_gray":
                            option == item.name && vercel,
                          "transition-[color] translate-x-0":
                            option !== item.name && vercel,
                        }
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </Link>
              );
            })}
            <NavigationMenuItem onClick={toggle}>
              <NavigationMenuLink
                className={clsx(
                  " group sm:my-4 my-6 flex flex-co dark:bg-theme_dark dark:text-gray-600 text-md font-semibold cursor-pointer",
                  {
                    "px-4 gap-4": vercel && !mobileOpen,
                    "px-10 gap-8 ": !vercel || mobileOpen,
                  }
                )}
              >
                <LogOutIcon />
                登出
              </NavigationMenuLink>
            </NavigationMenuItem>
            <div
              className={clsx(
                "   flex flex-co dark:bg-theme_dark dark:text-gray-600 text-md font-semibold cursor-pointer",
                {
                  "px-4 gap-4": vercel && !mobileOpen,
                  "px-10 gap-8 ": !vercel || mobileOpen,
                }
              )}
            >
              <Menu width={200} shadow="md">
                <Menu.Target>
                  <UnstyledButton
                    className={clsx(
                      " group sm:my-4  flex dark:bg-theme_dark dark:text-gray-600 text-md font-semibold cursor-pointer",
                      {
                        " gap-4": vercel && !mobileOpen,
                        " gap-8 ": !vercel || mobileOpen,
                      }
                    )}
                  >
                    <Settings className="hover:rotate-180" />
                    设置
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown className="dark:bg-theme_dark_sm border-0 ">
                  <Menu.Item>
                    <AppLogo className="dark:text-gray-600" />
                    <div className="w-full h-full flex flex-col gap-4 mt-4"></div>
                  </Menu.Item>
                  <Menu.Item>
                    {!mobileOpen && (
                      <LayoutModel
                        vercel={vercel}
                        setVercel={setVercel}
                        className="dark:text-gray-600"
                      />
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {darkMode && <DarkMode className="dark:text-gray-600" />}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </aside>
      <Logout opened={opened} close={close} />
    </div>
  );
};

export default NavMenu;
