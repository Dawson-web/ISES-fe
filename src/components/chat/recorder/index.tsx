import clsx from "clsx";
import { Mic, MicOff } from "lucide-react";
import Recorder from "js-audio-recorder";
import { useRef, useEffect, FC } from "react";
import { IMessage } from "@/types/chat";

interface IProps {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  chatInfo: {
    chatId: string;
    chatUser: string;
  };
  socket: WebSocket | null;
  setMessages: React.Dispatch<
    React.SetStateAction<(IMessage & { isUploading?: boolean })[]>
  >;
}

const RecorderButton: FC<IProps> = ({
  isRecording,
  setIsRecording,
}) => {
  const recorderRef = useRef<Recorder | null>(null);
  // const handleSend = async (audioId: string) => {
  //   const data = {
  //     content: "语音消息/" + audioId,
  //     userInfoId: getValidUid() as string,
  //     chatListId: chatInfo.chatId,
  //     chatUser: chatInfo.chatUser,
  //     messageType: "text" as const,
  //     createdAt: new Date().toISOString(),
  //   };

  //   try {
  //     await sendChatMessage(data);
  //   } catch (error) {
  //     toastMessage.error("发送失败");
  //     console.error("Send message error:", error);
  //   }
  // };

  useEffect(() => {
    // 只创建一次 recorder 实例
    recorderRef.current = new Recorder({
      sampleBits: 16,
      sampleRate: 48000,
      numChannels: 1,
    });

    return () => {
      // 组件卸载时停止录音
      if (recorderRef.current && isRecording) {
        recorderRef.current.stop();
        setIsRecording(false);
      }
    };
  }, []);

  return (
    <div
      className={clsx(
        "w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all",
        {
          "bg-red-500 text-white hover:bg-red-600": isRecording,
          "bg-transparent text-gray-600 hover:bg-gray-100": !isRecording,
        }
      )}
      // 暂时关闭录音功能
      //   onClick={handleRecord}
    >
      {isRecording ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </div>
  );
};

export default RecorderButton;
