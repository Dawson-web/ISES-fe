export interface IGetChatListResponse {
  id: string;
  user1: string;
  user2: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  userInfoId: string;
  introduce: string | null;
  school: string | null;
  avatar: string | null;
  online?: number;
  connect: boolean;
}

export interface ICreateChatRoomResponse {
  id: string;
  user1: string;
  user2: string;
  createdAt: string;
  username: string;
  connect: boolean;
}
export interface IGetChatListRequest {
  userInfoId: string;
}

export interface IGetChatMessageResponse {
  id?: string;
  userInfoId: string;
  createdAt?: string;
  updatedAt?: string;
  content: string;
}

export interface ISendChatMessageRequest {
  chatListId: string;
  userInfoId: string;
  content: string;
}

export interface ICreateChatRoomRequest {
  user1: string;
  user2: string;
}
export interface IAgreeChatRoomRequest {
  user1: string;
  user2: string;
}
