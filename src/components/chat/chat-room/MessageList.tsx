import { useRef, useEffect, LegacyRef, useState, useCallback } from "react";
import clsx from "clsx";
import { FC } from "react";
import MessageItem from "./MessageItem";
import { IMessage } from "@/types/chat";
import { getValidUid } from "@/api/token";
import { apiConfig } from "@/config";
import { Card } from "@mantine/core";

interface Props {
  messages: (IMessage & { isUploading?: boolean })[];
  className?: string;
}

interface ContextMenuState {
  x: number;
  y: number;
  messageId: string | number;
}

const MessageList: FC<Props> = ({ messages, className }) => {
  const messagesEndRef = useRef<HTMLElement>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent, message: IMessage) => {
      event.preventDefault();
      // 确保菜单不会超出屏幕边界
      const x = Math.min(event.clientX, window.innerWidth - 160);
      const y = Math.min(event.clientY, window.innerHeight - 100);
      setContextMenu({ x, y, messageId: String(message.id)});
    },
    []
  );

  const handleCopy = useCallback((message: IMessage) => {
    if (message.messageType === "text") {
      const content = typeof message.content === 'string' 
        ? JSON.parse(message.content).text || message.content
        : (message.content as any).text || JSON.stringify(message.content);
      navigator.clipboard.writeText(content);
    } else if (message.messageType === "image") {
      const imageUrl = typeof message.content === 'string'
        ? JSON.parse(message.content).imageUrl
        : (message.content as any).imageUrl;
      navigator.clipboard.writeText(apiConfig.baseUrl + imageUrl);
    }
    setContextMenu(null);
  }, []);

  const handleDelete = useCallback((messageId: string | number) => {
    // TODO: 实现删除逻辑
    console.log("Delete message:", messageId);
    setContextMenu(null);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // 处理全局点击事件关闭菜单
  useEffect(() => {
    const handleGlobalClick = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [contextMenu]);

  return (
    <Card
      ref={messagesEndRef as any}
      className={clsx(
        "flex flex-col gap-8 px-4 overflow-y-auto rounded-none border-x-0 border-b-0 shadow-none",
        className,
        contextMenu && "overflow-hidden" // 当右键菜单打开时禁用滚动
      )}
      style={{ maxHeight: "65vh" }}
      onContextMenu={(e) => e.preventDefault()} // 禁用整个列表的默认右键菜单
    >
      {        messages &&
        messages.map((message) => {
          const currentUserId = getValidUid();
          const isOwnMessage = message.fromUserId === currentUserId;
          // 如果是自己的消息，显示自己的头像，否则显示对方的头像
          const avatarInfo = message.sender ;
          
          return (
            <MessageItem
              key={message.id}
              message={message}
              className={clsx(
                isOwnMessage ? "flex-row-reverse" : ""
              )}
              avatarSrc={
                avatarInfo?.avatar 
                  ? `${apiConfig.baseUrl}${avatarInfo.avatar}`
                  : `https://q.qlogo.cn/g?b=qq&nk=369060891&s=160`
              }
              onContextMenu={(e) => handleContextMenu(e, message)}
            />
          );
        })}
      <div ref={messagesEndRef as LegacyRef<HTMLDivElement> | undefined} />

      {contextMenu && (
        <div
          className={clsx(
            "fixed z-50 bg-white dark:bg-gray-800 shadow-xl rounded-lg py-1",
            "min-w-[160px] border border-gray-200 dark:border-gray-700",
            "transform transition-opacity duration-200 ease-in-out",
            "animate-fadeIn"
          )}
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              const message = messages.find(
                (m) => m.id === contextMenu.messageId
              );
              if (message) handleCopy(message);
            }}
            className={clsx(
              "w-full px-4 py-2 text-left text-sm flex items-center gap-2",
              "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200",
              "text-gray-700 dark:text-gray-200"
            )}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            复制
          </button>
          {messages.find((m) => m.id === contextMenu.messageId)?.fromUserId ===
            getValidUid() && (
            <>
              <div className="h-[1px] bg-gray-200 dark:bg-gray-700 mx-2" />
              <button
                onClick={() => handleDelete(contextMenu.messageId)}
                className={clsx(
                  "w-full px-4 py-2 text-left text-sm flex items-center gap-2",
                  "hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200",
                  "text-red-500 dark:text-red-400"
                )}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                删除
              </button>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default MessageList;
