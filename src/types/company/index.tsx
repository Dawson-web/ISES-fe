import { ICurrentCompany } from "../user";

export interface ICompanyListRequest {
    page: number;
    pageSize: number;
    keyword?: string;
    status?: string;
    mainBusiness?: string[];
    employeeCount?: string[];
    address?: string[];
    companyName?: string[];
}

export interface ICompany {
    id?: string;
    name: string;
    address: string[];
    logo?: string | null;
    description?: string;
    establishedDate?: Date;
    mainBusiness: string[];
    employeeCount?: string;
    scaleRating?: number;
    isVerified?: boolean;
    status?: 'pending' | 'approved' | 'rejected';
    metadata?: {
        internalCode?: string;
        website?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface ICompanyStatus {
    companyId: string;
    status: 'approved' | 'rejected';
    isVerified: boolean;
}

export interface ICompanyList {
    companies: ICompany[];
    total: number;
}

export interface ICompanyEmployee {
    avatar: string;
    currentCompany:ICurrentCompany;
    id:string;
    username:string;
}

export interface ICompanyEmployeeList {
    employees:ICompanyEmployee[];
    total: number;
}

// 岗位内推（referral）
export interface IReferralCreatePayload {
    title?: string;
    position?: string;
    location?: string;
    reward?: string;
    expireAt?: string;
    contact?: string;
    description?: string;
}

export interface IReferralContent {
    id: string;
    title: string;
    contentType: string;
    content: {
        companyId: string;
        companyName: string;
        position?: string;
        location?: string;
        reward?: string;
        expireAt?: string;
        contact?: string;
        description?: string;
    };
    metadata: {
        viewCount: number;
        likeCount: number;
        commentCount: number;
        status: string;
    };
    creatorId: string;
    creator?: {
        id: string;
        username: string;
        avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface IReferralListRequest {
    page?: number;
    pageSize?: number;
    companyId?: string;
    keyword?: string;
}

export interface IReferralListResponse {
    items: IReferralContent[];
    pagination: {
        currentPage: number;
        pageSize: number;
        total: number;
    };
}
