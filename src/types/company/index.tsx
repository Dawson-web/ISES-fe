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