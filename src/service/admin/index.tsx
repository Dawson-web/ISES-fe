import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import {
  ICertificationApproveResponse,
  ICertificationListResponse,
  ICertificationRejectResponse,
  IGetCertificationsParams,
} from "@/types/certification";

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
