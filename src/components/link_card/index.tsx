import clsx from "clsx";
import React from "react";

export default function LinkCard(props: any) {
  const { url, descr, name, onClick, online } = props;
  const [isHovered, setIsHovered] = React.useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="mx-auto w-[90%] sm:w-[45%] min-w-[320px]  p-4 rounded-lg shadow-md bg-white dark:bg-theme_dark border-transparent hover:border-theme_blue border-2 hover:shadow-sm "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div
        // href={link}
        // target="_blank"
        // rel="noopener noreferrer"
        className="flex  items-center justify-around"
      >
        <aside
          className={clsx("w-[90px] h-[90px]  relative ", {
            "animate-bounce 	": isHovered,
          })}
        >
          <img
            src={url || "https://www.betula.space/images/avatar.png"}
            alt="avatar"
            className="rounded-full w-full h-full object-cover"
          />
          <div
            className={clsx(
              " border-white border-4 rounded-full w-[20px] h-[20px] absolute bottom-[0px] right-[0px]",
              online ? "bg-green-500" : "bg-red-500"
            )}
          ></div>
        </aside>
        <main className="w-[70%] text-center text-gray-600 font-medium p-2 flex flex-col items-start">
          <div className="text-lg font-bold">{name || "这个人很懒未留名"}</div>
          <div className="text-sm">{descr || "这个人很懒未留简介"}</div>
        </main>
      </div>
    </div>
  );
}
