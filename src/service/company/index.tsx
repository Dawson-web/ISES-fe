import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import { ICompany, ICompanyEmployeeList, ICompanyList, ICompanyStatus } from "@/types/company";
import { ISalaryReportForm, ISalaryReportList } from "@/types/salary";


export const getCompanyListApi = async () => {
    const res = await $axios.get<ApiOk<ICompanyList>>('/companies');
    return res.data;
};


// 获取待审批的公司列表
export const getCompanyApproveListApi = async () => {
    const res = await $axios.get<ApiOk<ICompanyList>>('/companies/admin/pending');
    return res.data;
};

// 更新公司状态
export const updateCompanyStatusApi = async (data: ICompanyStatus) => {
    const res = await $axios.post<ApiOk<any>>(`/companies/admin/status`, data);
    return res.data;
};

// 注册公司
export const registerCompanyApi = async (data: any) => {
    const res = await $axios.post('/companies/register', data);
    return res.data;
};

// 获取公司详情
export const getCompanyDetailApi = async (companyId: string) => {
    const res = await $axios.get<ApiOk<ICompany>>(`/companies/detail`, {
        params: {
            companyId
        }
    });
    return res.data;
};

// 获取公司薪资爆料
export const getCompanySalaryReportApi = async (data: any) => {
    const res = await $axios.post<ApiOk<ISalaryReportList>>(`/companies/salary-reports`, data);
    return res.data;
};


// 发布薪资爆料
export const publishSalaryReportApi = async (data: ISalaryReportForm) => {
    const res = await $axios.post<ApiOk<any>>(`/companies/salary-reports/add`, data);
    return res.data;
};

// 在职用户列表
export const getCompanyEmployeesApi = async (data: { companyId: string }) => {
    const res = await $axios.post<ApiOk<ICompanyEmployeeList>>(`/companies/employees`, data);
    return res.data;
};

// 更新公司信息
export const updateCompanyApi = async (data: ICompany) => {
    const res = await $axios.post<ApiOk<any>>(`/companies/update`, data);
    return res.data;
};

// 上传公司logo
export const uploadCompanyLogoApi = async (formData: FormData,companyId:string) => {
    const res = await $axios.post<ApiOk<{ logo: string }>>(`/companies/upload-logo`, formData,{
        params: {
            companyId
        }
    });
    return res.data;
};