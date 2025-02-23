import { Button, Card } from "@mantine/core";
import clsx from "clsx";
import { Video } from "lucide-react";
import React, { FC, useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    // 初始化HLS
    if (Hls.isSupported()) {
      hlsRef.current = new Hls({
        autoStartLoad: false,
        enableLowLatency: true,
      });

      hlsRef.current.loadSource("/hls/stream.m3u8");
      hlsRef.current.attachMedia(videoRef.current);

      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });
    }
  }, []);

  return (
    <Card
      className="w-4/5 mx-auto p-4"
      style={{ borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
    >
      <video ref={videoRef} controls className="w-full  object-cover" />
      <div className="mt-4 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (hlsRef.current) {
              hlsRef.current.reloadSource();
            }
          }}
        >
          <Video size={16} className="mr-2" /> 刷新流
        </Button>
      </div>
    </Card>
  );
};

export default VideoPlayer;
