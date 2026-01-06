import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import {
  ICertificationApproveResponse,
  ICertificationListResponse,
  ICertificationRejectResponse,
  IGetCertificationsParams,
} from "@/types/certification";
import { IAdminStats } from "@/types/admin/stats";
import {
  IAdminArticleListResponse,
  IAdminCompanyListResponse,
  IAdminUserListResponse,
} from "@/types/admin/management";
import { ICompany } from "@/types/company";

export const sendAnnouncements = async () => {
  return await $axios.post<ApiOk<null>>("/admin/email");
};

export const getCertificationsApi = async (params?: IGetCertificationsParams) => {
  return await $axios.get<ApiOk<ICertificationListResponse>>(
    "/admin/certifications",
    { params }
  );
};

export const approveCertificationApi = async (data: {
  userInfoId: string;
  remark?: string;
}) => {
  const { userInfoId, remark } = data;
  return await $axios.post<ApiOk<ICertificationApproveResponse>>(
    `/admin/certifications/${userInfoId}/approve`,
    { remark }
  );
};

export const rejectCertificationApi = async (data: {
  userInfoId: string;
  remark?: string;
}) => {
  const { userInfoId, remark } = data;
  return await $axios.post<ApiOk<ICertificationRejectResponse>>(
    `/admin/certifications/${userInfoId}/reject`,
    { remark }
  );
};

export const getAdminStatsApi = async (days?: number) => {
  return await $axios.get<ApiOk<IAdminStats>>("/admin/stats", {
    params: { days },
  });
};

export const getAdminUsersApi = async (params?: { page?: number; pageSize?: number }) => {
  return await $axios.get<ApiOk<IAdminUserListResponse>>("/admin/users", {
    params,
  });
};

export const deleteAdminUserApi = async (userInfoId: string) => {
  return await $axios.delete<ApiOk<null>>(`/admin/users/${userInfoId}`);
};

export const getAdminArticlesApi = async (params?: {
  page?: number;
  pageSize?: number;
  type?: string;
}) => {
  return await $axios.get<ApiOk<IAdminArticleListResponse>>("/admin/articles", {
    params,
  });
};

export const deleteAdminArticleApi = async (articleId: string) => {
  return await $axios.delete<ApiOk<null>>(`/admin/articles/${articleId}`);
};

export const getAdminCompaniesApi = async (params?: {
  page?: number;
  pageSize?: number;
  status?: "pending" | "approved" | "rejected";
  keyword?: string;
}) => {
  return await $axios.get<ApiOk<IAdminCompanyListResponse>>("/admin/companies", {
    params,
  });
};

export const getAdminCompanyDetailApi = async (companyId: string) => {
  return await $axios.get<ApiOk<ICompany>>(`/admin/companies/${companyId}`);
};

export const updateAdminCompanyApi = async (
  companyId: string,
  payload: Partial<ICompany>
) => {
  return await $axios.post<ApiOk<ICompany>>(`/admin/companies/${companyId}`, payload);
};

export const deleteAdminCompanyApi = async (companyId: string) => {
  return await $axios.delete<ApiOk<null>>(`/admin/companies/${companyId}`);
};
