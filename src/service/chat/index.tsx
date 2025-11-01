import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import {
  IChatListResponse,
  IGetChatMessagesResponse,
  ISendChatMessageRequest,
  IGetChatMessagesParams,
  IChatImageRequest,
  IMarkReadRequest,
  IMessage,
} from "@/types/chat";

// 获取聊天列表（最近联系人）
export const getChatList = async () => {
  return await $axios.get<ApiOk<IChatListResponse>>("/user/chat/list");
};

// 获取聊天记录
export const getChatMessages = async (params: IGetChatMessagesParams) => {
  return await $axios.get<ApiOk<IGetChatMessagesResponse>>(
    "/user/chat/messages",
    { params }
  );
};

// 发送消息
export const sendChatMessage = async (data: ISendChatMessageRequest) => {
  return await $axios.post<ApiOk<IMessage>>("/user/chat/message", data);
};

// 上传聊天图片
export const uploadChatImage = async (
  file: File,
  data: IChatImageRequest
) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("toUserId", data.toUserId);
  return await $axios.post<ApiOk<IMessage>>(
    "/user/chat/upload-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// 标记消息为已读
export const markMessagesAsRead = async (data: IMarkReadRequest) => {
  return await $axios.post<ApiOk<null>>("/user/chat/mark-read", data);
};

// 删除消息（软删除）
export const deleteMessage = async (messageId: string) => {
  return await $axios.delete<ApiOk<null>>(`/user/chat/message/${messageId}`);
};
