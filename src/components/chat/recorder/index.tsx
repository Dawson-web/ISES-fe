import clsx from "clsx";
import { Mic, MicOff } from "lucide-react";
import Recorder from "js-audio-recorder";
import { useRef, useEffect, FC } from "react";
import { toastMessage } from "@/components/toast";
import { getValidUid } from "@/api/token";
import { IGetChatMessageResponse } from "@/types/chat";
import { saveAudioToDB } from "@/utils/audioIndexDB";
import { sendChatMessage } from "@/service/chat";

interface IProps {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  chatInfo: {
    chatId: string;
    chatUser: string;
  };
  socket: WebSocket | null;
  setMessages: React.Dispatch<
    React.SetStateAction<
      (IGetChatMessageResponse & { isUploading?: boolean })[]
    >
  >;
}

const RecorderButton: FC<IProps> = ({
  isRecording,
  setIsRecording,
  chatInfo,
  socket,
  setMessages,
}) => {
  const recorderRef = useRef<Recorder | null>(null);
  const handleSend = async (audioId: string) => {
    const data = {
      content: "语音消息/" + audioId,
      userInfoId: getValidUid() as string,
      chatListId: chatInfo.chatId,
      chatUser: chatInfo.chatUser,
      messageType: "text" as const,
      createdAt: new Date().toISOString(),
    };

    try {
      await sendChatMessage(data);
    } catch (error) {
      toastMessage.error("发送失败");
      console.error("Send message error:", error);
    }
  };
  // 录音
  const handleRecord = async () => {
    if (!recorderRef.current) return;

    if (isRecording) {
      try {
        // 先设置状态，防止多次点击
        setIsRecording(false);
        console.log("结束录音");

        // 获取录音时长
        const duration = recorderRef.current.duration;
        console.log("录音时长:", duration);

        if (duration < 0.5) {
          toastMessage.warning("录音时间太短");
          return;
        }

        // 停止录音
        recorderRef.current.stop();

        // 获取音频 blob
        const wavBlob = recorderRef.current.getWAVBlob();
        console.log("录音 Blob:", wavBlob);

        if (wavBlob) {
          // 保存到 IndexedDB
          const audioId = await saveAudioToDB({
            blob: wavBlob,
            duration: Math.round(duration),
            chatId: chatInfo.chatId,
            createdAt: new Date().toISOString(),
          });

          // 创建消息对象
          const audioMessage = {
            content: "语音消息/" + audioId,
            userInfoId: getValidUid() as string,
            chatListId: chatInfo.chatId,
            chatUser: chatInfo.chatUser,
            messageType: "text" as const,
            duration: Math.round(duration),
            createdAt: new Date().toISOString(),
          };
          await handleSend(audioId);
          socket?.send(JSON.stringify(audioMessage));
          setMessages((prev) => [...prev, { ...audioMessage }]);
          toastMessage.success("语音消息发送成功");
        } else {
          toastMessage.error("录音失败，未获取到音频数据");
        }
      } catch (error) {
        console.error("Recording error:", error);
        toastMessage.error("录音出错");
      } finally {
        // 重置录音器以备下次使用
        recorderRef.current.destroy();
        recorderRef.current = new Recorder({
          sampleBits: 16,
          sampleRate: 48000,
          numChannels: 1,
        });
      }
    } else {
      try {
        // 请求麦克风权限并开始录音
        await recorderRef.current.start();
        setIsRecording(true);

        // 添加录音提示
        toastMessage.info("正在录音中...");
      } catch (error) {
        console.error("开始录音失败:", error);
        toastMessage.error("无法访问麦克风，请检查浏览器权限");
        setIsRecording(false);
      }
    }
  };

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
