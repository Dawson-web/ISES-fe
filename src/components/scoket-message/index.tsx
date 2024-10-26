import { IWSMessage } from "@/types/websocket";
import clsx from "clsx";
import { MessageSquareMoreIcon, Settings } from "lucide-react";
import { FC, useMemo, useState } from "react";

let time: NodeJS.Timeout | null = null;

function Content(message: IWSMessage | undefined) {
  // TODO: 根据消息类型返回不同的内容
  switch (message?.type) {
    case "message":
      return (
        <div className="flex items-end gap-2 flex-nowrap w-4/5 ml-2">
          <MessageSquareMoreIcon className="w-5 h-5" />
          <div className="truncate">
            {message.username}：{message.content}
          </div>
        </div>
      );
    case "system":
      return (
        <div className="flex items-end gap-2 flex-nowrap w-4/5 ml-2">
          <Settings className="w-5 h-5" />
          <div className="truncate">系统信息：{message.content}</div>
        </div>
      );
  }
}

const ScoketMessage: FC<{
  message: IWSMessage | undefined;
  className?: string;
}> = ({ message, className }) => {
  const [show, setShow] = useState(false);
  const date = new Date();
  const currentTime = `${date.getHours()}:${
    date.getMinutes() > 10 ? date.getMinutes() : "0" + date.getMinutes()
  }`;
  useMemo(() => {
    setShow(true);
    if (!time) {
      time = setTimeout(() => {
        setShow(false);
      }, 3000);
    } else {
      clearTimeout(time);
      time = setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }, [message]);
  return (
    <div
      className={clsx(
        "flex items-center flex-nowrap justify-around gap-2 w-auto max-w-[300px] sm:max-w-[50vw] bg-theme_gray/40 dark:bg-black/40 dark:text-theme_gray rounded-md  z-50 overflow-hidden  backdrop-blur-sm font-medium  shadow-2xl ",
        className,
        {
          "transition-[height] duration-500  h-10 ease-in-out ": show,
          "transition-[height] duration-500  h-0 ease-in-out ": !show,
        }
      )}
    >
      {Content(message)}
      <p className="opacity-80 w-[40px] mr-2">{currentTime}</p>
    </div>
  );
};
export default ScoketMessage;
