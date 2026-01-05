export type CertificationStatus = "none" | "pending" | "approved" | "rejected";

export interface ICertificationCurrentCompany {
  id?: string;
  name: string;
  position?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
}

export interface ICertificationApplyResponse {
  certificationStatus: CertificationStatus;
  certificationFile: string;
}

export interface ICertificationUserRef {
  email: string;
}

export interface ICertificationApplication {
  id: string; // userInfoId
  username: string;
  role: number;
  certificationStatus: CertificationStatus;
  certificationFile: string;
  certificationRemark: string | null;
  currentCompany?: ICertificationCurrentCompany | string | null;
  user?: ICertificationUserRef;
  createdAt: string;
  updatedAt: string;
}

export interface ICertificationPagination {
  currentPage: number;
  pageSize: number;
  total: number;
}

export interface ICertificationListResponse {
  items: ICertificationApplication[];
  pagination: ICertificationPagination;
}

export interface IGetCertificationsParams {
  page?: number;
  pageSize?: number;
  status?: CertificationStatus;
}

export interface ICertificationApproveResponse {
  userInfoId: string;
  role: number;
  certificationStatus: "approved";
}

export interface ICertificationRejectResponse {
  userInfoId: string;
  certificationStatus: "rejected";
  certificationRemark: string;
}
