// "use client";

// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
// } from "@radix-ui/react-navigation-menu";
// import { FC, useState } from "react";
// import { DarkMode } from "./DarkMode";
// import { NavOpen } from "./NavOpen";
// import UserAvatar from "../user_avatar";
// import clsx from "clsx";
// import { Link } from "react-router-dom";
// import { Logout } from "./Logout";

// interface OptionData {
//   name: string;
//   herf: string;
//   icon: JSX.Element;
// }

// interface Props {
//   options: OptionData[];
//   darkMode: boolean;
//   avatar_show?: boolean;
//   className?: string;
//   avatar_src?: string;
// }

// const NavMenu: FC<Props> = ({
//   options,
//   darkMode,
//   avatar_show,
//   className,
//   avatar_src,
// }) => {
//   const [open, setOpen] = useState<boolean>(false);
//   const [option, setOption] = useState<string>("主页");

//   function menuOption(options: string) {
//     setOption(options);
//     setTimeout(() => setOpen(false), 1000);
//   }
//   return (
//     <div
//       className={clsx(
//         "sm:w-[200px] sm:h-screen h-auto relative ",
//         {
//           "flex flex-col justify-start h-screen": open,
//         },
//         className
//       )}
//     >
//       {/* 移动端控制菜单打开按钮 */}
//       <NavOpen open={open} setOpen={setOpen} className={clsx("z-50")} />
//       <aside
//         className={clsx("bg-white dark:bg-dark ", {
//           "absolute w-screen z-40 mt-[40px] h-screen ": open,
//           "sm:block hidden": !open,
//         })}
//       >
//         <NavigationMenu>
//           <NavigationMenuList
//             className={clsx(
//               " sm:flex flex-col justify-start   overflow-hidden pt-[20px] sm:pt-[30px]  bg-white dark:bg-dark"
//             )}
//           >
//             {avatar_show && (
//               <UserAvatar
//                 src={avatar_src}
//                 size="medium"
//                 className="mx-auto px-10"
//               />
//             )}
//             {options.map((item: OptionData) => {
//               return (
//                 <NavigationMenuItem
//                   onClick={() => menuOption(item.name)}
//                   key={item.herf}
//                 >
//                   <Link to={item.herf}>
//                     <NavigationMenuLink
//                       className={clsx(
//                         " px-10 gap-8  group  h-14  flex items-end  bg-background dark:bg-dark dark:text-gray-600 text-md font-semibold 	 ",
//                         {
//                           "transition-[transform] duration-300 translate-x-6  border-l-4 border-l-blue-600":
//                             option == item.name,
//                           "transition-[transform] translate-x-0":
//                             option !== item.name,
//                         }
//                       )}
//                     >
//                       {item.icon}
//                       {item.name}
//                     </NavigationMenuLink>
//                   </Link>
//                 </NavigationMenuItem>
//               );
//             })}
//             {darkMode && <DarkMode />}
//             <Logout />
//           </NavigationMenuList>
//         </NavigationMenu>
//       </aside>
//     </div>
//   );
// };

// export default NavMenu;

"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { FC, useState } from "react";
import { DarkMode } from "./DarkMode";
import { NavOpen } from "./NavOpen";
import UserAvatar from "../user_avatar";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Logout } from "./Logout";

interface OptionData {
  name: string;
  herf: string;
  icon: JSX.Element;
}

interface Props {
  options: OptionData[];
  darkMode: boolean;
  avatar_show?: boolean;
  className?: string;
  avatar_src?: string;
}

const NavMenu: FC<Props> = ({
  options,
  darkMode,
  avatar_show,
  className,
  avatar_src,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [option, setOption] = useState<string>("主页");

  function menuOption(options: string) {
    setOption(options);
    setTimeout(() => setOpen(false), 1000);
  }
  return (
    <div
      className={clsx(
        "sm:w-[200px] sm:h-screen h-auto sm:relative fixed z-50 w-full shadow-md dark:bg-dark",
        {
          "flex flex-col justify-start h-screen ": open,
        },
        className
      )}
    >
      {/* 移动端控制菜单打开按钮 */}
      <NavOpen open={open} setOpen={setOpen} />
      <aside
        className={clsx("bg-white dark:bg-dark ", {
          "fixed  z-40 mt-[40px] h-screen w-full": open,
          "sm:block hidden": !open,
        })}
      >
        <NavigationMenu>
          <NavigationMenuList
            className={clsx(
              " sm:flex flex-col justify-start   overflow-hidden pt-[20px] sm:pt-[30px]  bg-white dark:bg-dark"
            )}
          >
            {avatar_show && (
              <UserAvatar
                src={avatar_src}
                size="medium"
                className="mx-auto px-10"
              />
            )}
            {options.map((item: OptionData) => {
              return (
                <NavigationMenuItem
                  onClick={() => menuOption(item.name)}
                  key={item.herf}
                >
                  <Link to={item.herf}>
                    <NavigationMenuLink
                      className={clsx(
                        " px-10 gap-8  group  h-14  flex items-end  bg-background dark:bg-dark dark:text-gray-600 text-md font-semibold 	 ",
                        {
                          "transition-[transform] duration-300 translate-x-6  border-l-4 border-l-blue-600":
                            option == item.name,
                          "transition-[transform] translate-x-0":
                            option !== item.name,
                        }
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
            {darkMode && <DarkMode />}
            <Logout />
          </NavigationMenuList>
        </NavigationMenu>
      </aside>
    </div>
  );
};

export default NavMenu;
