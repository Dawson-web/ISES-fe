import { Button, Card } from "@mantine/core";
import clsx from "clsx";
import {
  Image,
  Undo2,
  Loader2,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Clock,
  Video,
} from "lucide-react";
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
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // 在组件顶部添加主题检测
  /*   const isDarkMode = document.documentElement.classList.contains("dark");
   */
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
      createdAt: new Date().toISOString(),
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
          createdAt: new Date().toISOString(),
        };

        // 先发送到websocket和后端
        socket?.send(JSON.stringify(messageData));
        // 确保发送成功后再更新UI
        setMessages((prev) => {
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

  // 添加点击外部关闭emoji picker的处理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  return (
    <Card
      className={clsx("p-0 bg-white dark:bg-gray-900 shadow-xl", className)}
    >
      <Card className="h-[70px] flex-shrink-0 px-6 py-4  rounded-none border-0">
        <div className="flex flex-nowrap justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-800 dark:text-white">
              {chatInfo.userName}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <div
                className={clsx("w-2 h-2 rounded-full animate-pulse", {
                  "bg-green-500": chatInfo.online,
                  "bg-red-500": !chatInfo.online,
                })}
              />
              {chatInfo.online ? "在线" : "离线"}
            </span>
          </div>
          <div className="flex items-center gap-4 ">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all hover:scale-105">
                <Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all hover:scale-105">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all hover:scale-105">
              <Undo2
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
                onClick={() => {
                  setOpen(false);
                  websocketClose(socket as WebSocket);
                }}
              />
            </div>
          </div>
        </div>
      </Card>
      <div className="flex-1 min-h-0 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-900">
        {isSuccess ? (
          messages.length > 0 ? (
            <MessageList
              messages={messages}
              className="h-full overflow-y-auto"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 gap-4">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full blur-xl"></div>
                <Clock className="w-16 h-16 relative" />
              </div>
              <div className="text-center">
                <span className="text-xl font-medium block mb-2">暂无消息</span>
                <span className="text-sm">开始聊天吧</span>
              </div>
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}
      </div>
      <Card className="h-[200px] flex-shrink-0 px-6 py-4  rounded-none border-0 overflow-visible">
        <div className="flex items-center gap-2 p-3 border-b border-gray-100 dark:border-gray-800">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-sm text-gray-500">正在上传图片...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all "
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <Image className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors" />
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all ">
                <Paperclip className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors" />
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all  relative">
                <Smile
                  className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                {showEmojiPicker && (
                  <div
                    className="absolute bottom-full left-0 mb-2 z-50"
                    ref={emojiPickerRef}
                    style={{
                      transformOrigin: "bottom left",
                    }}
                  >
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      autoFocusSearch={false}
                      lazyLoadEmojis={true}
                      searchPlaceHolder="搜索表情"
                      width={350}
                      height={300}
                      previewConfig={{
                        showPreview: false,
                      }}
                      skinTonesDisabled
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
          className="flex-1 w-full px-6 py-3 bg-transparent outline-none resize-none focus-visible:outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
        <div className="flex justify-end items-center px-6 py-3 absolute bottom-0 right-0 ">
          <Button
            className={clsx(
              "w-[120px] h-10 font-bold transition-all flex items-center justify-center gap-2 rounded-full",
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
            )}
            onClick={handleSend}
            disabled={isUploading}
          >
            <Send className="w-4 h-4" />
            发送
          </Button>
        </div>
      </Card>
    </Card>
  );
};

export default ChatRoom;
