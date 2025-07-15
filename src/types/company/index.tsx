export interface ICompany {
    id?: string;
    name: string;
    address: string[];
    logo?: string;
    description?: string;
    establishedDate?: Date;
    mainBusiness: string[];
    employeeCount?: string;
    scaleRating?: number;
    status?: 'pending' | 'approved' | 'rejected';
    isVerified?: boolean;
    metadata?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICompanyList {
    companies: ICompany[]
    total: number;
}

export interface ICompanyStatus {
    companyId: string;
    status: 'pending' | 'approved' | 'rejected';
    isVerified: boolean;
}