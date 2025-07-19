export interface ISalaryReport {
    id?: string;
    education: string;
    graduationDate: string;
    recruitmentType: 'campus' | 'social' | 'internship';
    companyName: string;
    position: string;
    salary: string;
    city: string;
    remark?: string;
    userInfoId: string;
    companyId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    user?: {
        id: string;
        nickname: string;
        avatar?: string;
    };
}

export interface ISalaryReportList {
    reports: ISalaryReport[];
    total: number;
}

export interface ISalaryReportForm {
    companyId: string;
    education: string;
    graduationDate: string;
    recruitmentType: string;
    companyName: string;
    position: string;
    salary: string;
    city: string;
    remark?: string;
}

export const RECRUITMENT_TYPE_MAP = {
    campus: '校招',
    social: '社招',
    internship: '实习'
} as const; 