import { makeAutoObservable } from 'mobx';
import { INotification, IWSNotificationMessage, IUnreadCountResponse } from '../types/notification';

class NotificationStore {
  unreadCount: number = 0;
  socket: WebSocket | null = null;
  isConnected: boolean = false;

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

    const wsUrl = new URL('ws://localhost:3000/ws');
    wsUrl.searchParams.append('type', 'notification');
    wsUrl.searchParams.append('token', token);

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      this.isConnected = true;
      console.log('通知 WebSocket 已连接');

      // 心跳保活
      const heartbeat = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'ping', content: 'ping 通讯测试' }));
        } else {
          clearInterval(heartbeat);
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
    };
  };

  // 断开 WebSocket 连接
  disconnectWebSocket = () => {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  };
}

const notificationStore = new NotificationStore();
export default notificationStore;
