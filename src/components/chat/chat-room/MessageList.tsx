import { useRef, useEffect, LegacyRef } from "react";
import clsx from "clsx";
import { FC } from "react";
import MessageItem from "./MessageItem";
import { IGetChatMessageResponse } from "@/types/chat";
import { getValidUid } from "@/api/token";
import { apiConfig } from "@/config";
import { Card } from "@mantine/core";

interface Props {
  messages: IGetChatMessageResponse[];
  className?: string;
}

const MessageList: FC<Props> = ({ messages, className }) => {
  const messagesEndRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card
      ref={messagesEndRef as LegacyRef<HTMLDivElement> | undefined}
      className={clsx(
        "flex flex-col gap-8 p-4 overflow-y-auto rounded-none border-x-0",
        className
      )}
      style={{ maxHeight: "65vh" }} // 可以根据需要调整最大高度
    >
      {messages &&
        messages.map((message) => (
          <MessageItem
            key={message.id} // 假设 message 对象有一个唯一的 id 属性
            message={message}
            className={clsx(
              getValidUid() === message.userInfoId ? "flex-row-reverse" : ""
            )}
            avatarSrc={`${apiConfig.baseUrl}/uploads/avatars/${message.userInfoId}.png`}
          />
        ))}
      <div ref={messagesEndRef as LegacyRef<HTMLDivElement> | undefined} />
      {/* 这个元素用于滚动到底部 */}
    </Card>
  );
};

export default MessageList;
