// 消息发送者/接收者信息
export interface IUserInfo {
  id: string;
  username: string;
  avatar: string | null;
  introduce: string | null;
  school: string | null;
  online: boolean;
}

// 消息的 metadata
export interface IMessageMetadata {
  isRead: boolean;
  isDeleted: boolean;
}

// 消息接口
export interface IMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  messageType: "text" | "image" | "audio";
  content: string | Record<string, any>; // JSON 格式的内容
  metadata: IMessageMetadata;
  replyToId: string | null;
  createdAt: string;
  updatedAt: string;
  sender?: IUserInfo;
  receiver?: IUserInfo;
}

// 聊天列表项接口
export interface IChatListItem {
  userId: string;
  username: string;
  avatar: string | null;
  introduce: string | null;
  school: string | null;
  online: boolean;
  lastMessage: IMessage | null;
  unreadCount: number;
}

// 本地临时聊天项（未发送消息的）
export interface ITempChatItem {
  userId: string;
  username: string;
  avatar: string | null;
  introduce: string | null;
  school: string | null;
  online: boolean;
  lastMessage: null;
  unreadCount: 0;
  isTemp: true; // 标记为临时项
}

// 聊天列表响应
export type IChatListResponse = IChatListItem[];

// 获取聊天记录响应
export interface IGetChatMessagesResponse {
  messages: IMessage[];
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

// 发送消息请求
export interface ISendChatMessageRequest {
  toUserId: string;
  messageType: "text" | "image" | "audio";
  content: string | Record<string, any>;
}

// 获取聊天记录请求参数
export interface IGetChatMessagesParams {
  otherUserId: string;
  page?: number;
  pageSize?: number;
}

// 上传聊天图片请求
export interface IChatImageRequest {
  toUserId: string;
}

// 标记消息已读请求
export interface IMarkReadRequest {
  otherUserId: string;
}
