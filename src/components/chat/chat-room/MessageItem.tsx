import { getValidUid } from "@/api/token";
import { IGetChatMessageResponse } from "@/types/chat";
import { formatISODate } from "@/utils/date";
import clsx from "clsx";
import { FC, useState } from "react";
import { Loader2 } from "lucide-react";
import { apiConfig } from "@/config";

interface Props {
  message: IGetChatMessageResponse & { isUploading?: boolean };
  className?: string;
  avatarSrc?: string;
  onContextMenu?: (event: React.MouseEvent) => void;
}

const isImageUrl = (message: IGetChatMessageResponse) => {
  if (message.messageType === "image") {
    return true;
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

  const renderContent = () => {
    if (isImageUrl(message) && !imageError) {
      return (
        <div className="relative group">
          <div className="relative">
            <img
              src={apiConfig.baseUrl + message.imageUrl}
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
                  window.open(message.content, "_blank");
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
    return message.content;
  };

  return (
    <div className={clsx("flex gap-2", className)}>
      <div className={clsx("relative w-[40px] h-[40px]")} onClick={() => {}}>
        <img
          src={avatarSrc || "https://q.qlogo.cn/g?b=qq&nk=369060891&s=160"}
          alt="avatar"
          className={clsx("relative w-[40px] h-[40px] rounded-full")}
        />
      </div>
      <div className="flex flex-col gap-1">
        {isHover && (
          <div className="absolute mt-[-25px] text-gray-500 dark:text-gray-400 text-nowrap w-full">
            {formatISODate(String(message.createdAt))}
          </div>
        )}
        <span
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onContextMenu={onContextMenu}
          className={clsx(
            "p-2 rounded-lg break-words select-text",
            getValidUid() === message.userInfoId
              ? "bg-theme_blue text-white"
              : "bg-theme_gray text-black dark:bg-gray-600",
            isImageUrl(message) && !imageError && "!bg-transparent !p-0"
          )}
        >
          {renderContent()}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
