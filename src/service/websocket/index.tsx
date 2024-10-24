import { IWSMessage } from "@/types/websocket";

let lockReconnect = false;

export function contectWebSocket() {
  const url = new URL("ws://localhost:4000/ws");
  url.searchParams.append("token", localStorage.getItem("token") || "");
  const socket = new WebSocket(url);
  return { socket, url };
}

export async function createWebSocket(
  setMessage: React.Dispatch<React.SetStateAction<IWSMessage>>
) {
  let timer: null | NodeJS.Timer = null;
  let { socket, url } = contectWebSocket();
  socket.onopen = () => {
    setInterval(() => {
      socket.send(
        JSON.stringify({
          type: "message",
          token: localStorage.getItem("token") || "",
        })
      );
    }, 2000);
  };

  socket.onmessage = function (event) {
    try {
      const message = JSON.parse(event.data);
      setMessage(message);
      console.log("Received message:", message);
    } catch (e) {
      console.log("Received non-JSON data:", e);
    }
  };

  // 监听关闭事件
  socket.onclose = () => {
    console.log("WebSocket connection closed");
    websocketReconnect();
  };

  // 监听错误事件
  socket.onerror = (error) => {
    console.error("WebSocket error observed:", error);
    websocketReconnect();
  };

  function websocketReconnect() {
    if (lockReconnect) {
      // 是否已经执行重连
      return;
    }
    console.log("尝试重连...");
    // 没连接上会一直重连，设置延迟避免请求过多
    if (!timer) {
      timer = setInterval(function () {
        console.log("1.尝试重连...");
        socket = new WebSocket(url);

        socket.onopen = function () {
          console.log("连接成功");
          lockReconnect = true;
          clearInterval(timer as unknown as number);
          timer = null;
          socket.send(JSON.stringify({ type: "subscribe", topic: "news" }));
        };

        socket.onclose = function () {
          console.log("连接关闭，准备重连");
          lockReconnect = false;
          websocketReconnect();
        };

        socket.onerror = function (error) {
          console.error("连接出错:", error);
          lockReconnect = false;
        };
      }, 3000);
    }
  }

  return socket;
}
