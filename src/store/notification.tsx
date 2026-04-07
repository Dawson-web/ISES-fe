import { makeAutoObservable } from 'mobx';
import { IWSNotificationMessage, IUnreadCountResponse } from '../types/notification';
import { apiConfig } from '@/config';

const createWsUrl = (): URL => {
  const apiUrl = new URL(apiConfig.baseUrl);
  const protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  return new URL(`${protocol}//${apiUrl.host}/ws`);
};

class NotificationStore {
  unreadCount: number = 0;
  socket: WebSocket | null = null;
  isConnected: boolean = false;
  heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setUnreadCount = (count: number) => {
    this.unreadCount = count;
  };

  incrementUnreadCount = () => {
    this.unreadCount += 1;
  };

  decrementUnreadCount = () => {
    if (this.unreadCount > 0) {
      this.unreadCount -= 1;
    }
  };

  clearUnreadCount = () => {
    this.unreadCount = 0;
  };

  // 建立通知 WebSocket 连接
  connectWebSocket = () => {
    if (this.socket && this.isConnected) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const wsUrl = createWsUrl();
    wsUrl.searchParams.append('type', 'notification');
    wsUrl.searchParams.append('token', token);

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      this.isConnected = true;
      console.log('通知 WebSocket 已连接');

      // 心跳保活
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
      }
      this.heartbeatTimer = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'ping', content: 'ping 通讯测试' }));
        }
      }, 30000);
    };

    this.socket.onmessage = (event) => {
      try {
        const message: IWSNotificationMessage = JSON.parse(event.data);

        if (message.type === 'notification') {
          // 收到新通知，增加未读数量
          this.incrementUnreadCount();
        } else if (message.type === 'unreadCount') {
          // 收到未读数量同步
          const data = message.data as IUnreadCountResponse;
          this.setUnreadCount(data.count);
        }
      } catch (error) {
        console.error('解析通知消息失败:', error);
      }
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      console.log('通知 WebSocket 已断开');
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }

      // 5 秒后尝试重连
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          this.connectWebSocket();
        }
      }, 5000);
    };

    this.socket.onerror = (error) => {
      console.error('通知 WebSocket 错误:', error);
      this.isConnected = false;
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
    };
  };

  // 断开 WebSocket 连接
  disconnectWebSocket = () => {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  };
}

const notificationStore = new NotificationStore();
export default notificationStore;
