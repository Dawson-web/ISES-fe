import { IGetChatMessageResponse } from "@/types/chat";
import { IWSMessage } from "@/types/websocket";

let lockReconnect = false;

function contectWebSocket(type: string) {
  const url = new URL("ws://localhost:4000/ws");
  url.searchParams.append("type", type);
  url.searchParams.append("token", localStorage.getItem("token") || "");
  console.log("url", url.toString());
  const socket = new WebSocket(url);
  return { socket, url };
}

export function websocketClose(socket: WebSocket) {
  socket.close();
  console.log("websocketClose", socket);
}

function onMessage(
  socket: WebSocket,
  setMessage: React.Dispatch<React.SetStateAction<IWSMessage>>
) {
  socket.onmessage = function (event) {
    try {
      const message = JSON.parse(event.data);
      setMessage(message);
      console.log("Received message:", message);
    } catch (e) {
      console.log("Received non-JSON data:", e);
    }
  };
}

export function createWebSocket(
  setMessage: React.Dispatch<
    React.SetStateAction<IWSMessage | IGetChatMessageResponse[]>
  >,
  type: string
) {
  let timer: null | NodeJS.Timer = null;
  let { socket, url } = contectWebSocket(type);
  socket.onopen = () => {
    setInterval(() => {
      socket.send(
        JSON.stringify({
          type: "chat",
          content: "ping 通讯测试",
          id: "16312840702276485000",
        })
      );
    }, 8000);
  };
  // onMessage(socket, setMessage);
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
    console.log("WebSocket connection closed:");
    // websocketReconnect();
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
        console.log("1.尝试重连...", url);
        socket = new WebSocket(url);
        onMessage(socket, setMessage);

        socket.onopen = function () {
          console.log("连接成功");
          lockReconnect = true;
          clearInterval(timer as unknown as number);
          timer = null;
          socket.send(JSON.stringify({ type: "subscribe", topic: "news" }));
          setMessage({
            username: "",
            type: "message",
            content: "连接成功",
          });
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

export function createChatsocket(
  setMessage: React.Dispatch<React.SetStateAction<IGetChatMessageResponse[]>>,
  type: string
) {
  let timer: null | NodeJS.Timer = null;
  let { socket, url } = contectWebSocket(type);
  // socket.onopen = () => {
  //   setInterval(() => {
  //     socket.send(
  //       JSON.stringify({
  //         type: "chat",
  //         content: "ping 通讯测试",
  //         id: "16312840702276485000",
  //       })
  //     );
  //   }, 8000);
  // };
  // onMessage(socket, setMessage);
  socket.onmessage = function (event) {
    try {
      const message = JSON.parse(event.data);
      console.log("收到聊天信息", message);
      setMessage((prve) => [...prve, message]);
      console.log("Received message:", message);
    } catch (e) {
      console.log("Received non-JSON data:", e);
    }
  };

  // 监听关闭事件
  socket.onclose = () => {
    console.log("WebSocket connection closed:");
    // websocketReconnect();
  };

  // 监听错误事件
  socket.onerror = (error) => {
    console.error("WebSocket error observed:", error);
    // websocketReconnect();
  };

  // function websocketReconnect() {
  //   if (lockReconnect) {
  //     // 是否已经执行重连
  //     return;
  //   }
  //   console.log("尝试重连...");
  //   // 没连接上会一直重连，设置延迟避免请求过多
  //   if (!timer) {
  //     timer = setInterval(function () {
  //       console.log("1.尝试重连...", url);
  //       socket = new WebSocket(url);
  //       onMessage(socket, setMessage);

  //       socket.onopen = function () {
  //         console.log("连接成功");
  //         lockReconnect = true;
  //         clearInterval(timer as unknown as number);
  //         timer = null;
  //         socket.send(JSON.stringify({ type: "subscribe", topic: "news" }));
  //         setMessage({
  //           username: "",
  //           type: "message",
  //           content: "连接成功",
  //         });
  //       };

  //       socket.onclose = function () {
  //         console.log("连接关闭，准备重连");
  //         lockReconnect = false;
  //         websocketReconnect();
  //       };

  //       socket.onerror = function (error) {
  //         console.error("连接出错:", error);
  //         lockReconnect = false;
  //       };
  //     }, 3000);
  //   }
  // }

  return socket;
}
