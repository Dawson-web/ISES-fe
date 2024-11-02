import { Button, Card } from "@mantine/core";
import clsx from "clsx";
import { Undo2 } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import MessageList from "./MessageList";
import { getChatMessage, sendChatMessage } from "@/service/chat";
import { getValidUid } from "@/api/token";
import { IGetChatMessageResponse } from "@/types/chat";
import { createChatsocket, websocketClose } from "@/service/websocket";
import { useQuery } from "@tanstack/react-query";
import { IChatInfo } from "@/pages/home/link";
interface Props {
  className?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatInfo: IChatInfo;
}

let socket: WebSocket | null = null;

const ChatRoom: FC<Props> = ({ className, setOpen, chatInfo }) => {
  const [messages, setMessages] = useState<IGetChatMessageResponse[]>([]);
  const [content, setContent] = useState<string>("");
  const handleSend = async () => {
    const data = {
      content,
      userInfoId: getValidUid() as string,
      chatListId: chatInfo.chatId,
      chatUser: chatInfo.chatUser,
    };
    socket?.send(JSON.stringify(data));
    await sendChatMessage(data);
  };
  const { isSuccess, data, isFetching } = useQuery({
    queryKey: ["chatList", chatInfo.chatId], // 将 chatInfo.chatId 包括在 queryKey 中，以便当 chatInfo.chatId 改变时，查询会被重新执行
    queryFn: () => getChatMessage(chatInfo.chatId),
  });
  // 在 useEffect 中监听 isSuccess 和 isFetching 的变化
  useEffect(() => {
    if (isSuccess && !isFetching) {
      setMessages(data.data.data);
      socket = createChatsocket(setMessages, "chat");
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (socket) {
      websocketClose(socket as WebSocket);
    }
  }, []);

  return (
    <Card
      className={clsx(
        "flex-grow flex flex-col justify-start dark:bg-theme_dark dark:text-white p-0 rounded-xl ",
        className
      )}
    >
      <div className="border-b-2 border-gray-200 dark:border-gray-600 flex items-center justify-between p-2 h-[10%] ">
        <span className="font-bold">{chatInfo.userName}</span>
        <Undo2
          className="text-gray-600 dark:text-white"
          onClick={() => {
            setOpen(false);
            websocketClose(socket as WebSocket);
          }}
        />
      </div>
      {isSuccess ? (
        <MessageList
          messages={messages}
          className="border-b-2 border-gray-200 dark:border-gray-600 h-[65%] overflow-y-scroll"
        />
      ) : (
        <div>Loading...</div> // 显示加载中的提示
      )}
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
              setContent("");
            }
          }}
          placeholder=" 按 Enter 发送消息"
          className="w-full h-full p-3 bg-transparent outline-none resize-none bg-h-full focus-visible:outline-none border-box-border"
        />
        <Button
          className="w-[100px] h-10 bg-blue-500 text-white font-bold self-end m-2 "
          onClick={async () => {
            await handleSend();
            setMessages((prev) => [
              ...prev,
              { content, userInfoId: getValidUid() as string },
            ]);
            setContent("");
          }}
        >
          发送
        </Button>
      </div>
    </Card>
  );
};

export default ChatRoom;
