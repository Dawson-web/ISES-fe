import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import {
  ICreateChatRoomRequest,
  ICreateChatRoomResponse,
  IGetChatListRequest,
  IGetChatListResponse,
  IGetChatMessageResponse,
  ISendChatMessageRequest,
} from "@/types/chat";

export const getChatList = async (data: IGetChatListRequest) => {
  return await $axios.post<ApiOk<IGetChatListResponse[]>>(
    "/user/chat/list",
    data
  );
};

export const getChatMessage = async (chatListId: string) => {
  return await $axios.get<ApiOk<IGetChatMessageResponse[]>>(
    `/user/chat/message?chatListId=${chatListId}`
  );
};

export const sendChatMessage = async (data: ISendChatMessageRequest) => {
  return await $axios.post<ApiOk<null>>(`/user/chat/message`, data);
};

export const createChatRoom = async (data: ICreateChatRoomRequest) => {
  return await $axios.post<ApiOk<ICreateChatRoomResponse>>(
    "/user/chat/create",
    data
  );
};

export const agreeChatRoom = async (data: { chatListId: string }) => {
  return await $axios.post<ApiOk<unknown>>("/user/chat/agree", data);
};
