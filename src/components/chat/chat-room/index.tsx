import { Button, Card, CardSection } from "@mantine/core";
import clsx from "clsx";
import { Image, Undo2, Loader2 } from "lucide-react";
import React, { FC, useEffect, useState, useRef } from "react";
import MessageList from "./MessageList";
import { getChatMessage, sendChatMessage } from "@/service/chat";
import { getValidUid } from "@/api/token";
import { IGetChatMessageResponse } from "@/types/chat";
import { createChatsocket, websocketClose } from "@/service/websocket";
import { useQuery } from "@tanstack/react-query";
import { IChatInfo } from "@/pages/home/chat";
import { toastMessage } from "@/components/toast";
import axios from "axios";
import { apiConfig } from "@/config";

interface IProps {
  className?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatInfo: IChatInfo;
}

let socket: WebSocket | null = null;

const ChatRoom: FC<IProps> = ({ className, setOpen, chatInfo }) => {
  const [messages, setMessages] = useState<
    (IGetChatMessageResponse & { isUploading?: boolean })[]
  >([]);
  const [content, setContent] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (content === "" || content === "\n") {
      setContent("");
      toastMessage.error("内容不能为空");
      return;
    }

    const data = {
      content,
      userInfoId: getValidUid() as string,
      chatListId: chatInfo.chatId,
      chatUser: chatInfo.chatUser,
      messageType: "text" as const,
    };

    try {
      socket?.send(JSON.stringify(data));
      await sendChatMessage(data);
      setMessages((prev) => [...prev, { ...data }]);
      setContent("");
    } catch (error) {
      toastMessage.error("发送失败");
      console.error("Send message error:", error);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastMessage.error("图片大小不能超过5MB");
        return;
      }

      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("userInfoId", getValidUid() as string);
        formData.append("chatListId", chatInfo.chatId);
        formData.append("chatUser", chatInfo.chatUser);

        const response = await axios.post(
          `${apiConfig.baseUrl}/user/chat/upload-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (!response.data.status) {
          throw new Error("上传失败");
        }

        const imageUrl = response.data.data.imageUrl;
        // 发送图片消息
        const messageData = {
          content: "图片消息",
          userInfoId: getValidUid() as string,
          chatListId: chatInfo.chatId,
          chatUser: chatInfo.chatUser,
          messageType: "image" as const,
          imageUrl: imageUrl,
        };

        // 先发送到websocket和后端
        socket?.send(JSON.stringify(messageData));
        // 确保发送成功后再更新UI
        setMessages((prev) => {
          console.log([...prev, messageData]);
          return [...prev, messageData];
        });
        toastMessage.success("图片发送成功");
      } catch (error) {
        console.error("Image upload error:", error);
        toastMessage.error("图片上传失败，请重试");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const { isSuccess, data, isFetching } = useQuery({
    queryKey: ["chatList", chatInfo.chatId],
    queryFn: () => getChatMessage(chatInfo.chatId),
  });

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
    <Card className={clsx("p-0", className)}>
      <div className="flex items-center justify-between h-[60px] flex-shrink-0 p-2 border-b border-gray-200 dark:border-gray-700">
        <span className="font-bold">{chatInfo.userName}</span>
        <Undo2
          className="text-gray-600 dark: hover:text-gray-800 dark:hover:text-gray-400 cursor-pointer transition-colors"
          onClick={() => {
            setOpen(false);
            websocketClose(socket as WebSocket);
          }}
        />
      </div>
      <div className="flex-1 min-h-0">
        {isSuccess ? (
          messages.length > 0 ? (
            <MessageList
              messages={messages}
              className="h-full overflow-y-auto"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              暂无消息
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-shrink-0 h-[160px] border-t border-gray-200 dark:border-gray-700">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-sm text-gray-500">正在上传图片...</span>
          </div>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
            <Image
              className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors"
              onClick={() => !isUploading && fileInputRef.current?.click()}
            />
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              await handleSend();
            }
          }}
          placeholder="按 Enter 发送消息"
          className="flex-1 w-full px-4 py-2 bg-transparent outline-none resize-none focus-visible:outline-none"
        />
        <div className="flex justify-end px-4 py-2">
          <Button
            className={clsx(
              "w-[100px] h-9 font-bold transition-colors",
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            )}
            onClick={handleSend}
            disabled={isUploading}
          >
            发送
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatRoom;
