import { $axios } from "../../api";
import { ApiOk } from "../../api/types";
import { IUpdateUserForm, IUserFormData } from "../../types/user";

export const getUserInfo = async () => {
  return await $axios.get<ApiOk<IUserFormData>>("/user/info");
};

export const updateUserInfo = async (data: IUpdateUserForm) => {
  return await $axios.post<ApiOk<IUserFormData>>("/user/info-update", data);
};

export const uploadAvatar = async (formData: FormData) => {
  return await $axios.post<ApiOk<null>>("/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const logOut = async () => {
  return await $axios.post<ApiOk<null>>("/user/logout");
};

export const getOtherUserInfo = async (params: { userInfoId: string }) => {
  return await $axios.get<ApiOk<IUserFormData>>("/user/info-other", {
    params,
  });
};

export const searchUsers = async (data: { searchKey: string }) => {
  return await $axios.post<ApiOk<IUserFormData[]>>("/user/search", {
    ...data,
  });
};
