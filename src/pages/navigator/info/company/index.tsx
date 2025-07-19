import { useEffect, useState } from 'react';
import { Card, Tag, Image, Tabs, Empty, Grid } from '@arco-design/web-react';
import { ICompany, ICompanyEmployee } from '@/types/company';
import { IUserInfo } from '@/types/user';
import { SalaryReportList } from '@/components/salary-report';
import { useQuery } from '@tanstack/react-query';
import { getCompanyEmployeesApi, getCompanyDetailApi } from '@/service/company';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

const TabPane = Tabs.TabPane;
const { Row, Col } = Grid;

// 公司基本信息组件
const CompanyBasicInfo = ({ company }: { company?: ICompany }) => {
    if (!company) return null;

    return (
        <>
            {/* 快速信息卡片 */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 mb-1">公司规模</span>
                        <span className="text-lg font-semibold text-gray-900">{company.employeeCount}人</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 mb-1">成立时间</span>
                        <span className="text-lg font-semibold text-gray-900">
                            {company.establishedDate ? dayjs(company.establishedDate).format('YYYY年MM月') : '未知'}
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 mb-1">总部地址</span>
                        <span className="text-lg font-semibold text-gray-900">{company.address[0]}</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 mb-1">官方网站</span>
                        <a 
                            href={company.metadata?.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                        >
                            访问
                        </a>
                    </div>
                </div>
            </div>

            {/* 主营业务 */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">主营业务</h2>
                <div className="flex flex-wrap gap-2">
                    {company.mainBusiness.map((business, index) => (
                        <span 
                            key={index}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                            {business}
                        </span>
                    ))}
                </div>
            </div>

            {/* 详细地址 */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">详细地址</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{company.address.join(' ')}</p>
                </div>
            </div>
        </>
    );
};

  // 在职员工组件
  const CompanyEmployees = ({ companyId }: { companyId: string }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['getCompanyEmployeesApi', companyId],
        queryFn: () => getCompanyEmployeesApi({ companyId }).then(res => res.data)
    });

    const employees = data?.employees || [];
    console.log(data)
    
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
                            className="hover:shadow-lg transition-shadow"
                            bordered={false}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-medium">
                                    {employee.username?.[0] || '未'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-medium text-gray-900 truncate">
                                            {employee.username}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                        {employee.currentCompany.position || '职位未设置'}
                                    </div>
                                    {employee.currentCompany.department && (
                                        <div className="mt-1 text-sm text-gray-500">
                                            {employee.currentCompany.department}
                                        </div>
                                    )}
                             
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

const CompanyDetailPage = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get('companyId') || '';

    const { data: company, isLoading } = useQuery({
        queryKey: ['getCompanyDetailApi', companyId],
        queryFn: () => getCompanyDetailApi(companyId).then(res => res.data)
    });

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
                <Card className="overflow-hidden bg-white shadow-xl rounded-2xl">
                    {/* 公司头部信息 */}
                    <div className="relative pb-6">
                        <div className="px-6 pt-8">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-white rounded-xl shadow-lg p-2 flex items-center justify-center">
                                    <Image
                                        src={company?.logo || '/default-company-logo.png'}
                                        alt={company?.name}
                                        error="/default-company-logo.png"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold">{company?.name}</h1>
                                        {company?.isVerified && (
                                            <Tag color="blue" className="bg-blue-400/20">已认证</Tag>
                                        )}
                                        <Tag color={company?.status === 'approved' ? 'green' : 'orange'} 
                                             className={company?.status === 'approved' ? 'bg-green-400/20' : 'bg-orange-400/20'}>
                                            {company?.status === 'approved' ? '已批准' : '审核中'}
                                        </Tag>
                                    </div>
                                    <p className="text-sm max-w-2xl text-gray-600">{company?.description}</p>
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
        </div>
    );
};

export default CompanyDetailPage;