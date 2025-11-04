import { Button } from "@mantine/core";
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
import {
  getChatMessages,
  sendChatMessage,
  uploadChatImage,
  markMessagesAsRead,
} from "@/service/chat";
import { IMessage } from "@/types/chat";
import { createChatsocket, websocketClose } from "@/service/websocket";
import { useQuery } from "@tanstack/react-query";
import { IChatInfo } from "@/pages/navigator/chat";
import { toastMessage } from "@/components/toast";
import chatStore from "@/store/chat";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import RecorderButton from "../recorder";

interface IProps {
  className?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatInfo: IChatInfo;
}

let socket: WebSocket | null = null;

const ChatRoom: FC<IProps> = ({ className, setOpen, chatInfo }) => {
  const [content, setContent] = useState<string>("");
  const [messages, setMessages] = useState<
    (IMessage & { isUploading?: boolean })[]
  >([]);
  const [isFirstMessage, setIsFirstMessage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // 检查是否是临时聊天项
  useEffect(() => {
    const chatItem = chatStore.chatlist.find(
      (chat) => chat.userId === chatInfo.chatUser
    );
    // @ts-ignore
    setIsFirstMessage(chatItem && "isTemp" in chatItem && chatItem.isTemp);
  }, [chatInfo.chatUser]);

  // 获取聊天记录
  const { isSuccess, data, isFetching } = useQuery({
    queryKey: ["chatMessages", chatInfo.chatUser],
    queryFn: () =>
      getChatMessages({
        otherUserId: chatInfo.chatUser,
        page: 1,
        pageSize: 50,
      }),
    enabled: !isFirstMessage, // 临时聊天项不获取历史消息
  });

  // 初始化消息列表
  useEffect(() => {
    if (isSuccess && !isFetching && data?.data?.data) {
      // 反转消息顺序（后端返回的是最新的在前）
      setMessages([...data.data.data.messages].reverse());
      
      // 标记消息为已读
      markMessagesAsRead({ otherUserId: chatInfo.chatUser }).catch(
        (error) => {
          console.error("标记已读失败:", error);
        }
      );
    } else if (isFirstMessage) {
      // 临时聊天项，初始化空消息列表
      setMessages([]);
    }
  }, [isSuccess, isFetching, data, isFirstMessage, chatInfo.chatUser]);

  // 创建websocket连接
  // useEffect(() => {
  //   if (!isFirstMessage && isSuccess && !isFetching) {
  //     socket = createChatsocket(setMessages, "chat");
  //   }
  //   return () => {
  //     if (socket) {
  //       websocketClose(socket);
  //       socket = null;
  //     }
  //   };
  // }, [isSuccess, isFetching, isFirstMessage]);

  // 发送消息
  const handleSend = async () => {
    if (content === "" || content === "\n") {
      setContent("");
      toastMessage.error("内容不能为空");
      return;
    }

    const messageContent = JSON.stringify({ text: content });

    try {
      // 如果是第一条消息（临时聊天项），需要先发送到后端
      if (isFirstMessage) {
        const response = await sendChatMessage({
          toUserId: chatInfo.chatUser,
          messageType: "text",
          content: messageContent,
        });

        if (response.data.status) {
          // 将临时项转换为正式项
          const newMessage = response.data.data;
          chatStore.convertTempToFormal(chatInfo.chatUser, newMessage);
          chatStore.updateLastMessage(chatInfo.chatUser, newMessage);
          
          // 更新消息列表
          setMessages([newMessage]);
          setIsFirstMessage(false);
          
          // 创建 websocket 连接
          socket = createChatsocket(setMessages, "chat");
        }
      } else {
        // 发送消息到后端
        const response = await sendChatMessage({
          toUserId: chatInfo.chatUser,
          messageType: "text",
          content: messageContent,
        });

        if (response.data.status) {
          const newMessage = response.data.data;
          // 更新本地消息列表
          setMessages((prev) => [...prev, newMessage]);
          // 更新聊天列表的最后一条消息
          chatStore.updateLastMessage(chatInfo.chatUser, newMessage);
          
          // 通过 websocket 发送（如果需要）
          if (socket) {
            socket.send(
              JSON.stringify({
                type: "chat",
                content: content,
                toUserId: chatInfo.chatUser,
              })
            );
          }
        }
      }
      
      setContent("");
    } catch (error: any) {
      toastMessage.error(error.message || "发送失败");
      console.error("Send message error:", error);
    }
  };

  // 上传图片
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toastMessage.error("图片大小不能超过5MB");
      return;
    }

    try {
      setIsUploading(true);

      // 如果是第一条消息（临时聊天项），先发送图片消息会创建对话
      const response = await uploadChatImage(file, {
        toUserId: chatInfo.chatUser,
      });

      if (response.data.status) {
        const newMessage = response.data.data;
        
        // 如果是临时项，转换为正式项
        if (isFirstMessage) {
          chatStore.convertTempToFormal(chatInfo.chatUser, newMessage);
          setIsFirstMessage(false);
          // 创建 websocket 连接
          socket = createChatsocket(setMessages, "chat");
        }
        
        // 更新消息列表
        setMessages((prev) => [...prev, newMessage]);
        // 更新聊天列表的最后一条消息
        chatStore.updateLastMessage(chatInfo.chatUser, newMessage);
        
        toastMessage.success("图片发送成功");
      }
    } catch (error: any) {
      console.error("Image upload error:", error);
      toastMessage.error(error.message || "图片上传失败，请重试");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 点击表情
  const handleOnEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  // 是否禁用发送消息
  function isDisabledSend() {
    return content === "" || content === "\n" || isUploading || isRecording;
  }

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

  // 处理接收到的消息
  // const handleReceivedMessage = (message: IMessage) => {
  //   // 只处理当前聊天的消息
  //   if (
  //     (message.fromUserId === chatInfo.chatUser &&
  //       message.toUserId === getValidUid()) ||
  //     (message.toUserId === chatInfo.chatUser &&
  //       message.fromUserId === getValidUid())
  //   ) {
  //     setMessages((prev) => {
  //       // 检查是否已存在（避免重复）
  //       if (prev.find((m) => m.id === message.id)) {
  //         return prev;
  //       }
  //       return [...prev, message];
  //     });
  //     // 更新聊天列表的最后一条消息
  //     chatStore.updateLastMessage(chatInfo.chatUser, message);
  //   }
  // };

  // 更新 websocket 消息处理
  // useEffect(() => {
  //   if (socket) {
  //     const originalOnMessage = socket.onmessage;
  //     socket.onmessage = function (event) {
  //       try {
  //         const message = JSON.parse(event.data);
  //         if (originalOnMessage) {
  //           originalOnMessage.call(this, event);
  //         }
  //         handleReceivedMessage(message as IMessage);
  //       } catch (e) {
  //         console.error("Parse message error:", e);
  //       }
  //     };
  //   }
  // }, [socket, chatInfo.chatUser]);

  return (
    <div
      className={clsx("h-full flex flex-col", className)}
    >
      <div className="h-[70px] flex-shrink-0 px-6 py-4 rounded-none border-0">
        <div className="flex flex-nowrap justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1">
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
          <div className="flex items-center gap-4">
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
                  if (socket) {
                    websocketClose(socket);
                    socket = null;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-900">
        {isFirstMessage ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 gap-4">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full blur-xl"></div>
              <Clock className="w-16 h-16 relative" />
            </div>
            <div className="text-center">
              <span className="text-xl font-medium block mb-2">新对话</span>
              <span className="text-sm">发送第一条消息开始聊天</span>
            </div>
          </div>
        ) : isSuccess && !isFetching ? (
          messages.length > 0 ? (
            <MessageList messages={messages} className="h-full overflow-y-auto" />
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
      <div className="py-0 rounded-none border-0 h-[160px] border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
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
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all"
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <Image className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors" />
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all">
                <Paperclip className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors" />
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all relative">
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
                      onEmojiClick={handleOnEmojiClick}
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
              <RecorderButton
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                chatInfo={chatInfo}
                socket={socket}
                setMessages={setMessages}
              />
            </div>
          )}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey && !isDisabledSend()) {
              e.preventDefault();
              await handleSend();
            }
          }}
          placeholder="按 Enter 发送消息"
          className="flex-1 w-full px-2 py-3 bg-transparent outline-none resize-none focus-visible:outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
        <div className="flex justify-end items-center px-6 py-3 absolute bottom-0 right-0">
          <Button
            className={clsx(
              "w-[120px] h-10 font-bold transition-all flex items-center justify-center gap-2 rounded-full text-white bg-theme_blue",
              isDisabledSend() && "bg-theme_blue/80"
            )}
            onClick={handleSend}
            disabled={isDisabledSend()}
          >
            <Send className="w-4 h-4" />
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;