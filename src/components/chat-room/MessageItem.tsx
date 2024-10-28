import { IGetChatMessageResponse } from "@/types/chat";
import clsx from "clsx";
import { FC } from "react";

interface Props {
  message: IGetChatMessageResponse;
  className?: string;
  avatarSrc?: string;
}
const MessageItem: FC<Props> = ({ message, className, avatarSrc }) => {
  console.log(avatarSrc);
  return (
    <div className={clsx("flex  gap-2", className)}>
      <div className={clsx("relative w-[40px] h-[40px] ")} onClick={() => {}}>
        <img
          src={
            // apiConfig.baseUrl + src ||
            avatarSrc || "https://q.qlogo.cn/g?b=qq&nk=369060891&s=160"
          }
          alt="avatar"
          className={clsx("relative w-[40px] h-[40px] rounded-full")}
        />
      </div>
      <span className="bg-gray-200 p-2 rounded-lg  max-w-[50%] break-words ">
        {message.content}
      </span>
    </div>
  );
};

export default MessageItem;
