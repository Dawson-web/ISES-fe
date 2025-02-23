import { getValidUid } from "@/api/token";
import { IGetChatMessageResponse } from "@/types/chat";
import { formatISODate } from "@/utils/date";
import clsx from "clsx";
import { FC, useState } from "react";

interface Props {
  message: IGetChatMessageResponse;
  className?: string;
  avatarSrc?: string;
}
const MessageItem: FC<Props> = ({ message, className, avatarSrc }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div className={clsx("flex  gap-2", className)}>
      <div className={clsx("relative w-[40px] h-[40px] ")} onClick={() => {}}>
        <img
          src={avatarSrc || "https://q.qlogo.cn/g?b=qq&nk=369060891&s=160"}
          alt="avatar"
          className={clsx("relative w-[40px] h-[40px] rounded-full")}
        />
      </div>
      <div className="flex flex-col gap-1">
        {isHover && (
          <div className="absolute mt-[-25px]  text-gray-500 dark:text-gray-400 text-nowrap w-full">
            {formatISODate(String(message.createdAt))}
          </div>
        )}
        <span
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className={clsx(
            " p-2 rounded-lg   break-words ",
            getValidUid() === message.userInfoId
              ? "bg-theme_blue text-white"
              : "bg-theme_gray text-black dark: dark:bg-gray-600"
          )}
        >
          {message.content}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
