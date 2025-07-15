import { $axios } from "@/api";
import { ApiOk } from "@/api/types";
import { ICompanyList, ICompanyStatus } from "@/types/company";


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