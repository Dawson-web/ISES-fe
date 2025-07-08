import { FC, useEffect, useRef, useState } from "react";
import { Card } from "@mantine/core";
import {
  PhoneOff,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneIncoming,
  Timer,
} from "lucide-react";
import clsx from "clsx";

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  caller: {
    id: string;
    name: string;
    avatar: string;
  };
  isIncoming?: boolean;
}

export const VideoCall: FC<VideoCallProps> = ({
  isOpen,
  onClose,
  caller,
  isIncoming = false,
}) => {
  const [callStatus, setCallStatus] = useState<
    "incoming" | "outgoing" | "connected" | "ended"
  >(isIncoming ? "incoming" : "outgoing");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCallStatus("ended");
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === "connected") {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAcceptCall = () => {
    setCallStatus("connected");
    // TODO: 实现接受通话逻辑
  };

  const handleRejectCall = () => {
    setCallStatus("ended");
    onClose();
    // TODO: 实现拒绝通话逻辑
  };

  const handleEndCall = () => {
    setCallStatus("ended");
    onClose();
    // TODO: 实现结束通话逻辑
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: 实现静音逻辑
  };

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
    // TODO: 实现关闭摄像头逻辑
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 backdrop-blur-md">
      <Card className="w-full max-w-4xl bg-white text-gray-800 shadow-2xl rounded-2xl border border-gray-100">
        {/* 视频区域 */}
        <div className="relative h-[600px] rounded-t-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          {/* 远程视频 */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />

          {/* 本地视频（小窗口） */}
          <div className="absolute bottom-4 right-4 w-48 h-36 rounded-xl overflow-hidden shadow-2xl border border-white backdrop-blur-sm">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {isCameraOff && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                <CameraOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* 通话状态显示 */}
          {callStatus !== "connected" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-sm">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <img
                  src={caller.avatar}
                  alt={caller.name}
                  className="relative w-24 h-24 rounded-full ring-2 ring-white shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mt-6 mb-2 text-gray-800">
                {caller.name}
              </h3>
              <p className="text-blue-500 mb-8 flex items-center gap-2">
                <Timer className="w-4 h-4 animate-pulse" />
                {callStatus === "incoming"
                  ? "来电..."
                  : callStatus === "outgoing"
                  ? "正在呼叫..."
                  : "通话结束"}
              </p>

              {/* 来电控制按钮 */}
              {callStatus === "incoming" && (
                <div className="flex gap-8">
                  <button
                    onClick={handleAcceptCall}
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-200 text-white"
                  >
                    <PhoneIncoming className="w-8 h-8" />
                  </button>
                  <button
                    onClick={handleRejectCall}
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-rose-200 text-white"
                  >
                    <PhoneOff className="w-8 h-8" />
                  </button>
                </div>
              )}

              {/* 拨出电话显示 */}
              {callStatus === "outgoing" && (
                <button
                  onClick={handleEndCall}
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-rose-200 text-white"
                >
                  <PhoneOff className="w-8 h-8" />
                </button>
              )}
            </div>
          )}

          {/* 通话时长显示 */}
          {callStatus === "connected" && (
            <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md text-gray-700 flex items-center gap-2 shadow-lg">
              <Timer className="w-4 h-4" />
              {formatDuration(callDuration)}
            </div>
          )}
        </div>

        {/* 控制栏 */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-b from-gray-50 to-white rounded-b-xl border-t border-gray-100">
          <div className="flex gap-4">
            <button
              onClick={toggleMute}
              className={clsx(
                "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg",
                isMuted
                  ? "bg-gradient-to-r from-rose-400 to-rose-500 hover:shadow-rose-200 text-white"
                  : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 hover:shadow-gray-200 text-gray-700"
              )}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={toggleCamera}
              className={clsx(
                "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg",
                isCameraOff
                  ? "bg-gradient-to-r from-rose-400 to-rose-500 hover:shadow-rose-200 text-white"
                  : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 hover:shadow-gray-200 text-gray-700"
              )}
            >
              {isCameraOff ? (
                <CameraOff className="w-6 h-6" />
              ) : (
                <Camera className="w-6 h-6" />
              )}
            </button>
          </div>

          <button
            onClick={handleEndCall}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-rose-200 text-white"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default VideoCall;
