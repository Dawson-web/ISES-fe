// 通知类型
export type NotificationType = 'like' | 'comment' | 'referral' | 'system';

// 通知目标类型
export type NotificationTargetType = 'content' | 'comment' | 'interview' | 'referral';

// 通知发送者信息
export interface INotificationSender {
  id: string;
  username: string;
  avatar: string;
}

// 通知数据
export interface INotification {
  id: string;
  recipientId: string;
  senderId: string;
  type: NotificationType;
  targetType: NotificationTargetType;
  targetId: string;
  title: string;
  content: string;
  isRead: boolean;
  sender?: INotificationSender;
  createdAt: string;
  updatedAt: string;
}

// 通知列表响应
export interface INotificationListResponse {
  notifications: INotification[];
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

// 未读数量响应
export interface IUnreadCountResponse {
  count: number;
}

// WebSocket 通知消息
export interface IWSNotificationMessage {
  type: 'notification' | 'unreadCount';
  data: INotification | IUnreadCountResponse;
}
