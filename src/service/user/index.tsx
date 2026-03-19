import { $axios } from "../../api";
import { ApiOk } from "../../api/types";
import { IUpdateUserForm, IUserFormData, IUserInfo, IAlumniNetworkData, IAlumniNetworkParams } from "../../types/user";
import { ICertificationApplyResponse } from "../../types/certification";

export const getUserInfoApi = async (id?: string) => {
  return await $axios.get<ApiOk<IUserInfo>>("/user/info", {
    params: { userInfoId: id },
  });
};

export const updateUserInfo = async (data: IUpdateUserForm) => {
  return await $axios.post<ApiOk<IUserFormData>>("/user/info-update", data);
};

export const uploadAvatar = async (formData: FormData) => {
  return await $axios.post<ApiOk<{ avatar: string }>>(
    "/user/upload-avatar",
    formData
  );
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

export const getUserCompanyAlumni = async () => {
  return await $axios.get<ApiOk<IUserInfo[]>>("/user/company-alumni");
};

export const applyCertificationApi = async (formData: FormData) => {
  return await $axios.post<ApiOk<ICertificationApplyResponse>>(
    "/user/certification/apply",
    formData
  );
};

export const getAlumniNetwork = async (params?: IAlumniNetworkParams) => {
  return await $axios.get<ApiOk<IAlumniNetworkData>>("/user/alumni-network", {
    params,
  });
};
