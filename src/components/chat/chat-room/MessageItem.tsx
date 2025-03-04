import { getValidUid } from "@/api/token";
import { IGetChatMessageResponse } from "@/types/chat";
import { formatISODate } from "@/utils/date";
import clsx from "clsx";
import { FC, useRef, useState, useEffect } from "react";
import { Loader2, Play, Pause, Volume2 } from "lucide-react";
import { apiConfig } from "@/config";
import { getAudioFromDB } from "@/utils/audioIndexDB";
import { toastMessage } from "@/components/toast";

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

const isAudioUrl = (message: IGetChatMessageResponse) => {
  if (message.messageType === "text" && message.content.includes("语音消息/")) {
    console.log("audioUrl", message);
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(message.duration || 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // 播放/暂停切换
  const togglePlay = async () => {
    if (!isAudioUrl(message)) return;

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      try {
        // 从 IndexedDB 获取音频数据
        const audioData = await getAudioFromDB(message.content.split("/")[1]);
        if (!audioData) {
          toastMessage.error("音频数据不存在");
          return;
        }

        // 创建音频 URL
        const audioUrl = URL.createObjectURL(audioData.blob);
        console.log("audioUrl", audioUrl);
        // 创建或更新音频元素
        if (!audioRef.current) {
          audioRef.current = new Audio(audioUrl);
          audioRef.current.addEventListener("timeupdate", () => {
            setCurrentTime(audioRef.current?.currentTime || 0);
          });
          audioRef.current.addEventListener("ended", () => {
            setIsPlaying(false);
            setCurrentTime(0);
          });
        } else {
          audioRef.current.src = audioUrl;
        }

        // 播放音频
        await audioRef.current.play();
      } catch (error) {
        console.error("播放失败:", error);
        toastMessage.error("音频播放失败");
      }
    }
  };

  // 点击进度条改变播放位置
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = audioDuration * clickPosition;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 格式化时间为 mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // 计算进度百分比
  const progressPercentage =
    audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

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
    } else if (isAudioUrl(message)) {
      return (
        <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 hover:bg-blue-600 transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between mb-1">
              <Volume2 size={16} className="text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(currentTime)} / {formatTime(audioDuration)}
              </span>
            </div>

            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer"
            >
              <div
                className="h-full bg-blue-500 transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      );
    }
    return message.content;
  };

  return (
    <div className={clsx("flex gap-2", className)}>
      <div className={clsx("relative w-[40px] h-[40px]")} onClick={() => {}}>
        {isHover && (
          <div
            className={clsx(
              "absolute mt-[-25px] text-gray-500 dark:text-gray-400 text-nowrap ",
              {
                "ml-[calc(100%-130px)]": getValidUid() === message.userInfoId,
                "ml-[50px]": getValidUid() !== message.userInfoId,
              }
            )}
          >
            {formatISODate(String(message.createdAt))}
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
            getValidUid() === message.userInfoId
              ? "bg-theme_blue text-white"
              : "bg-theme_gray text-black dark:bg-gray-600",
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
