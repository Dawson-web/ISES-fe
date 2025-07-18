import { useEffect, useState } from 'react';
import { Card, Tag, Image, Tabs } from '@arco-design/web-react';
import { ICompany } from '@/types/company';
import { SalaryReportList } from '@/components/salary-report';
import dayjs from 'dayjs';

const TabPane = Tabs.TabPane;

const CompanyDetailPage = () => {
    const [company, setCompany] = useState<ICompany | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('1');

    useEffect(() => {
        // TODO: 这里需要调用API获取公司详情数据
        // 暂时使用模拟数据
        const mockCompany: ICompany = {
            name: "示例科技有限公司",
            address: ["上海市", "浦东新区", "张江高科技园区"],
            logo: "https://example.com/logo.png",
            description: "这是一家专注于人工智能和大数据的科技公司，致力于为企业提供智能化解决方案。我们拥有一支优秀的研发团队，具备强大的技术创新能力和丰富的行业经验。",
            establishedDate: new Date("2020-01-01"),
            mainBusiness: ["人工智能", "大数据分析", "云计算服务", "企业数字化转型", "IoT解决方案"],
            employeeCount: "500-1000",
            scaleRating: 4,
            isVerified: true,
            status: 'approved',
            metadata: {
                website: "https://example.com",
                internalCode: "TECH001"
            }
        };

        setCompany(mockCompany);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">加载公司信息中...</p>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-600">
                <h3 className="text-xl font-medium mb-2">未找到公司信息</h3>
                <p>请检查公司ID是否正确</p>
            </div>
        );
    }

    // 公司基本信息组件
    const CompanyBasicInfo = () => (
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

    // 在职员工组件（待实现）
    const CompanyEmployees = () => (
        <div className="py-8">
            <div className="text-center text-gray-500">
                <p>员工信息模块开发中...</p>
            </div>
        </div>
    );

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
                                        src={company.logo || '/default-company-logo.png'}
                                        alt={company.name}
                                        error="/default-company-logo.png"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold">{company.name}</h1>
                                        {company.isVerified && (
                                            <Tag color="blue" className="bg-blue-400/20">已认证</Tag>
                                        )}
                                        <Tag color={company.status === 'approved' ? 'green' : 'orange'} 
                                             className={company.status === 'approved' ? 'bg-green-400/20' : 'bg-orange-400/20'}>
                                            {company.status === 'approved' ? '已批准' : '审核中'}
                                        </Tag>
                                    </div>
                                    <p className="text-sm max-w-2xl text-gray-600">{company.description}</p>
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
                            <CompanyBasicInfo />
                        </TabPane>
                        <TabPane key="2" title="薪资爆料">
                            <SalaryReportList 
                                companyId={company?.id} 
                                companyName={company?.name}
                            />
                        </TabPane>
                        <TabPane key="3" title="在职员工">
                            <CompanyEmployees />
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
};

export default CompanyDetailPage;