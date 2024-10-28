import { Card } from "@mantine/core";
import clsx from "clsx";
import { Undo2 } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import MessageList from "./MessageList";
import { getChatMessage, sendChatMessage } from "@/service/chat";
import { getValidUid } from "@/api/token";
import { IGetChatMessageResponse } from "@/types/chat";

interface Props {
  className?: string;
  chatId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

let initial = false;

const ChatRoom: FC<Props> = ({ className, chatId, setOpen }) => {
  const [messages, setMessages] = useState<IGetChatMessageResponse[]>([]);
  const [content, setContent] = useState<string>("");
  const handleSend = async () => {
    const data = {
      content,
      userInfoId: getValidUid() as string,
      chatListId: "242108044931321300",
    };
    await sendChatMessage(data);
  };
  useEffect(() => {
    if (!initial) {
      getChatMessage(chatId || "242108044931321300").then((res) => {
        setMessages(res.data.data);
      });
      initial = true;
    }
  }, []);
  return (
    <Card
      className={clsx(
        "flex-grow flex flex-col  justify-start dark:bg-theme_dark dark:text-white p-0",
        className
      )}
    >
      <div className="border-b-2 border-gray-200 dark:border-gray-600  flex items-center justify-end p-2 h-[10%]">
        <Undo2
          className="text-gray-600 dark:text-white "
          onClick={() => {
            setOpen(false);
            initial = false; // 重置初始状态
          }}
        />
      </div>
      <MessageList
        messages={messages}
        className="border-b-2 border-gray-200 dark:border-gray-600 h-[65%] overflow-y-scroll "
      />
      <div className="flex flex-col h-[25%]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              await handleSend();
              setMessages((prev) => [
                ...prev,
                { content, userInfoId: getValidUid() as string },
              ]);
            }
          }}
          className="w-full h-full p-3 bg-transparent outline-none resize-none bg-h-full focus-visible:outline-none border-box-border"
        />
        <p className="p-3 text-sm text-right text-default-500">
          按 Enter 发送消息
        </p>
      </div>
    </Card>
  );
};

export default ChatRoom;
