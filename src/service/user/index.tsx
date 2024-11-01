import { $axios } from "../../api";
import { ApiOk } from "../../api/types";
import { IUserFormData } from "../../types/user";

export const getUserInfo = async () => {
  return await $axios.get<ApiOk<IUserFormData>>("/user/info");
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
