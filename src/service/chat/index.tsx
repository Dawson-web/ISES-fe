import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import {
  IGetChatListRequest,
  IGetChatListResponse,
  IGetChatMessageResponse,
  ISendChatMessageRequest,
} from "@/types/chat";

// export const addArticle = async (data: IGetChatListRequest) => {
//   return await $axios.post<ApiOk<IGetChatListResponse[]>>("/user/articles", {
//     title: data.title,
//     content: data.content,
//     type: data.type,
//   });
// };

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
