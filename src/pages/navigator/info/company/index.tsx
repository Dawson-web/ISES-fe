import { useState } from 'react';
import { Card, Tag, Image, Tabs, Empty, Grid, Button, Avatar } from '@arco-design/web-react';
import { ICompany, ICompanyEmployee } from '@/types/company';
import { SalaryReportList } from '@/components/salary-report';
import { useQuery } from '@tanstack/react-query';
import { getCompanyEmployeesApi, getCompanyDetailApi, updateCompanyApi, uploadCompanyLogoApi } from '@/service/company';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import CompanyFormModal from '@/components/company-form-modal';
import { observer } from 'mobx-react-lite';
import userStore from '@/store/User';
import { toast } from 'sonner';
import { apiConfig } from '@/config';

const TabPane = Tabs.TabPane;
const { Row, Col } = Grid;


const basicInfo = (company: ICompany) => {
    return [
        {
            label: '公司规模',
            value: company?.employeeCount
        },
        {
            label: '成立时间',
            value: company?.establishedDate ? dayjs(company.establishedDate).format('YYYY年MM月') : '未知'
        },
        {
            label: '总部地址',
            value: company?.address[0]
        },
        {
            label: '投递链接',
            value: company?.metadata?.website || '暂无'
        },
        {
            label: '内推码',
            value: company?.metadata?.internalCode || '暂无'
        }

    ]
}

// 公司基本信息组件
const CompanyBasicInfo = ({ company }: { company?: ICompany }) => {


    if (!company) return null;

    return (
        <>
            {/* 快速信息卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex justify-between gap-4 mt-6">
                {basicInfo(company).map((item) => (
                    <div className="w-full">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 mb-1">{item.label}</span>
                            <span className={`font-semibold text-gray-900 line-clamp-1 ${item.label === '投递链接' ? '!text-blue-600 cursor-pointer' : ''}`} onClick={() => {
                                if (item.label === '投递链接') {
                                    window.open(item.value, '_blank');
                                }
                            }}>{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 主营业务 */}
            <div className="mt-8 flex gap-2 flex-col">
                <h2 className=" font-bold text-gray-900 text-nowrap ">主营业务</h2>
                <div className="flex flex-wrap gap-2">
                    {company.mainBusiness.map((business, index) => (
                        <Tag
                            key={index}
                            color="blue"
                            className="text-gray-700"
                        >
                            {business}
                        </Tag>
                    ))}
                </div>
            </div>

            {/* 详细地址 */}
            <div className="mt-8 flex gap-2 flex-col">
                <h2 className="font-bold text-gray-900 text-nowrap ">办公地点</h2>
                <div className="flex flex-wrap gap-2">
                {
                    company.address.map((address, index) => (
                        <Tag key={index} color="blue" className="text-gray-700">{address}</Tag>
                    ))
                }
                 </div>
            </div>
        </>
    );
};

// 在职员工组件
const CompanyEmployees = ({ companyId }: { companyId: string }) => {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ['getCompanyEmployeesApi', companyId],
        queryFn: () => getCompanyEmployeesApi({ companyId }).then(res => res.data)
    });

    const employees = data?.employees || [];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <Card key={i} className="w-full">
                        <div className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!employees?.length) {
        return (
            <div className="py-8">
                <Empty description="暂无在职员工信息" />
            </div>
        );
    }

    return (
        <div className="py-8">
            <Row gutter={[16, 16]}>
                {employees.map((employee: ICompanyEmployee) => (
                    <Col xs={24} sm={12} lg={8} key={employee.id}>
                        <Card
                            className="cursor-pointer shadow-lg rounded-md"
                            bordered={false}
                            onClick={() => {
                                navigate(`/navigator/profile?id=${employee.id}`);
                            }}
                        >
                            <div className="flex items-start space-x-4">
                                <Avatar>
                                    <img
                                        alt='avatar'
                                        src={apiConfig.baseUrl + employee.avatar} />
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-medium text-gray-900 truncate">
                                            {employee.username}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                    {employee.currentCompany.department} - {employee.currentCompany.position || '职位未设置'}
                                    </div>
                                    {employee.currentCompany.joinDate && (
                                        <div className="mt-2 text-xs text-gray-400">
                                            加入时间：{dayjs(employee.currentCompany.joinDate).format('YYYY-MM-DD')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

const CompanyDetailPage = observer(() => {
    const [activeTab, setActiveTab] = useState('1');
    const [searchParams] = useSearchParams();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const companyId = searchParams.get('companyId') || '';
    const isAdmin = userStore.role === 1;

    const { data: company, isLoading, refetch } = useQuery({
        queryKey: ['getCompanyDetailApi', companyId],
        queryFn: () => getCompanyDetailApi(companyId).then(res => res.data)
    });


    const uploadLogo = async (file: File) => {
        const formData = new FormData();
        formData.append('logo', file);
        await uploadCompanyLogoApi(formData, companyId)
    }

    const handleEditSubmit = async (values: any, file: File | null) => {
        try {
            // 更新公司信息
            await updateCompanyApi({
                ...values,
                id: companyId,
            }).then(async res => {
                if (file) {
                    console.log(res)
                    await uploadLogo(file)
                }
                toast.success('更新成功');
            })
            refetch(); // 刷新公司信息
            setIsEditModalVisible(false);
        } catch (error) {
            toast.error('更新失败');
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <Card className="overflow-hidden bg-white shadow-xl rounded-2xl">
                        <div className="relative pb-6">
                            <div className="px-6 pt-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 bg-white rounded-xl shadow-lg p-2 flex items-center justify-center">
                                        <Image
                                            src="/default-company-logo.png"
                                            alt="Loading"
                                            error="/default-company-logo.png"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-2xl font-bold">加载中...</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Card className="overflow-hidden bg-white shadow-xl rounded-2xl min-h-[calc(100vh-64px)]">
                    {/* 公司头部信息 */}
                    <div className="relative pb-6">
                        <div className="px-6 pt-8">
                            <div className="flex items-center justify-between flex-wrap">
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="w-16 h-16 rounded-md">
                                        <Image
                                            src={apiConfig.baseUrl + company?.logo || '/default-company-logo.png'}
                                            alt={company?.name}
                                            error="/default-company-logo.png"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h1 className="text-2xl font-bold text-nowrap">{company?.name}</h1>
                                            {company?.isVerified && (
                                                <Tag color="blue" className="bg-blue-400/20">已认证</Tag>
                                            )}
                                            <Tag color={company?.status === 'approved' ? 'green' : 'orange'}
                                                className={company?.status === 'approved' ? 'bg-green-400/20' : 'bg-orange-400/20'}>
                                                {company?.status === 'approved' ? '已批准' : '审核中'}
                                            </Tag>
                                            {isAdmin && (
                                                <Button type="primary" size="mini" onClick={() => setIsEditModalVisible(true)}>
                                                    更新信息
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-sm max-w-2xl text-gray-600">{company?.description}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 选项卡 */}
                    <Tabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        className="px-6"
                    >
                        <TabPane key="1" title="公司介绍">
                            <CompanyBasicInfo company={company} />
                        </TabPane>
                        <TabPane key="2" title="薪资爆料">
                            <SalaryReportList
                                companyId={company?.id}
                                companyName={company?.name}
                            />
                        </TabPane>
                        <TabPane key="3" title="在职员工">
                            {company?.id && <CompanyEmployees companyId={company.id} />}
                        </TabPane>
                    </Tabs>
                </Card>
            </div>

            {/* 编辑公司信息弹窗 */}
            <CompanyFormModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                onSubmit={handleEditSubmit}
                initialValues={company}
            />
        </div>
    );
});

export default CompanyDetailPage;