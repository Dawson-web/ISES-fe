import clsx from "clsx";
import { FC } from "react";
import MessageItem from "./MessageItem";
import { IGetChatMessageResponse } from "@/types/chat";
import { getValidUid } from "@/api/token";
import { apiConfig } from "@/config";

interface Props {
  messages: IGetChatMessageResponse[];
  className?: string;
}
const MessageList: FC<Props> = ({ messages, className }) => {
  return (
    <div className={clsx("flex flex-col gap-2 p-4", className)}>
      {messages.map((message) => {
        return (
          <MessageItem
            message={message}
            className={clsx(
              getValidUid() == message.userInfoId ? "flex-row-reverse" : ""
            )}
            avatarSrc={
              apiConfig.baseUrl +
              "/uploads/avatars/" +
              message.userInfoId +
              ".png"
            }
          />
        );
      })}

      {/* <MessageItem /> */}
    </div>
  );
};

export default MessageList;
