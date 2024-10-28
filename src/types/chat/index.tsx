export interface IGetChatListResponse {
  id: string;
  user1: string;
  user2: string;
  createdAt: string;
  updatedAt: string;
}
export interface IGetChatListRequest {
  userInfoId: string;
}

export interface IGetChatMessageResponse {
  id: string;
  userInfoId: string;
  createdAt: string;
  updatedAt: string;
  content: string;
}

export interface ISendChatMessageRequest {
  chatListId: string;
  userInfoId: string;
  content: string;
}
