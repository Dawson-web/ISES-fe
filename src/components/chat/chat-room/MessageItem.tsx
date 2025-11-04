import { getValidUid } from "@/api/token";
import { IMessage } from "@/types/chat";
import clsx from "clsx";
import { FC, useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { apiConfig } from "@/config";

interface Props {
  message: IMessage & { isUploading?: boolean };
  className?: string;
  avatarSrc?: string;
  onContextMenu?: (event: React.MouseEvent) => void;
}

const isImageUrl = (message: IMessage) => {
  if (message.messageType === "image") {
    return true;
  }
  return false;
};

const isAudioUrl = (message: IMessage) => {
  if (message.messageType === "audio") {
    return true;
  }
  if (message.messageType === "text") {
    const content = typeof message.content === 'string' 
      ? message.content 
      : JSON.stringify(message.content);
    if (content.includes("语音消息/")) {
      console.log("audioUrl", message);
      return true;
    }
  }
  return false;
};

const MessageItem: FC<Props> = ({
  message,
  className,
  avatarSrc,
  onContextMenu,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const renderContent = () => {
    if (isImageUrl(message) && !imageError) {
      const imageUrl = typeof message.content === 'string'
        ? JSON.parse(message.content).imageUrl
        : (message.content as any).imageUrl;
      const fullImageUrl = imageUrl.startsWith('http') 
        ? imageUrl 
        : apiConfig.baseUrl + imageUrl;
      
      return (
        <div className="relative group">
          <div className="relative">
            <img
              src={fullImageUrl}
              alt="聊天图片"
              className={clsx(
                "max-w-[200px] max-h-[200px] rounded-lg transition-all duration-300 cursor-pointer",
                !imageLoaded && "opacity-0",
                "hover:scale-105"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              onClick={() => {
                if (!message.isUploading) {
                  window.open(fullImageUrl, "_blank");
                }
              }}
            />
            {(!imageLoaded || message.isUploading) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            )}
          </div>
          {imageLoaded && !message.isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-lg" />
          )}
        </div>
      );
    }
    
    // 文本消息
    if (message.messageType === "text") {
      const content = typeof message.content === 'string' 
        ? JSON.parse(message.content).text || message.content
        : (message.content as any).text || JSON.stringify(message.content);
      return content;
    }
    
    // 其他类型
    return typeof message.content === 'string' 
      ? message.content 
      : JSON.stringify(message.content);
  };

  return (
    <div className={clsx("flex gap-2", className)}>
      <div className={clsx("relative w-[40px] h-[40px]")} onClick={() => {}}>
        {isHover && (
          <div
            className={clsx(
              "absolute mt-[-25px] text-gray-500 dark:text-gray-400 text-nowrap ",
              {
                "ml-[calc(100%-130px)]": getValidUid() === message.fromUserId,
                "ml-[50px]": getValidUid() !== message.fromUserId,
              }
            )}
          >
            {new Date(message.createdAt).toLocaleString()}
          </div>
        )}
        <img
          src={avatarSrc || "https://q.qlogo.cn/g?b=qq&nk=369060891&s=160"}
          alt="avatar"
          className={clsx("relative w-[40px] h-[40px] rounded-full")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onContextMenu={onContextMenu}
          className={clsx(
            "p-2 rounded-lg break-words select-text",
            getValidUid() === message.fromUserId
              ? "bg-theme_blue text-white"
              : "bg-gray-100 text-black dark:bg-gray-600",
            isImageUrl(message) && !imageError && "!bg-transparent !p-0",
            isAudioUrl(message) && "!bg-transparent !p-0"
          )}
        >
          {renderContent()}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
