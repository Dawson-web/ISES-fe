import { Table, Button, Card, Tag, Space, Typography, Divider, Grid } from '@arco-design/web-react';
import { IconCheckCircle, IconCloseCircle, IconCalendar, IconApps, IconUserGroup } from '@arco-design/web-react/icon';
import { getCompanyApproveListApi, updateCompanyStatusApi } from '@/service/company';
import './style.css';


import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ICompany, ICompanyStatus } from '@/types/company';

const { Title, Text, Paragraph } = Typography;
const { Row, Col } = Grid;

const Page = () => {

    const queryClient = useQueryClient();

    const {data, isLoading} = useQuery({
        queryKey: ['getCompanyApproveListApi'],
        queryFn: () => getCompanyApproveListApi().then(res => res.data),
    })

    const {mutate: updateCompanyStatus} = useMutation({
        mutationFn: (data: ICompanyStatus) => updateCompanyStatusApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getCompanyApproveListApi'] });
        }
    })


    const columns = [
        {
            title: '公司信息',
            dataIndex: 'name',
            width: 500,
            render: (_: string, record: ICompany) => (
                <div className="company-info">
                    <div className="company-logo">
                        {record.logo ? (
                            <img src={record.logo} alt={record.name} />
                        ) : (
                            <div className="company-logo-placeholder">
                                {record.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="company-details">
                        <Text className="company-name">{record.name}</Text>
                        <div className="company-meta">
                            <Space>
                                <div className="meta-item">
                                    <IconCalendar className="meta-icon" />
                                    <Text type="secondary">
                                        {record.establishedDate ? new Date(record.establishedDate).toLocaleDateString() : ''}
                                    </Text>
                                </div>
                                <Divider type="vertical" />
                                <div className="meta-item">
                                    <IconUserGroup className="meta-icon" />
                                    <Text type="secondary">{record.employeeCount}</Text>
                                </div>
                            </Space>
                        </div>
                        <Paragraph ellipsis={{ rows: 2 }} className="company-description">
                           简介：{record.description}
                        </Paragraph>
                    </div>
                </div>
            ),
        },
        {
            title: '主营业务',
            dataIndex: 'mainBusiness',
            width: 300,
            render: (mainBusiness: string[]) => {
                const businesses = JSON.parse(mainBusiness as unknown as string);
                return (
                    <div className="business-tags">
                        <IconApps className="business-icon" />
                        <Space wrap size={[8, 8]}>
                            {businesses.map((business: string) => (
                                <Tag
                                    key={business}
                                    className="business-tag"
                                >
                                    {business}
                                </Tag>
                            ))}
                        </Space>
                    </div>
                );
            },
        },
        {
            title: '操作',
            width: 200,
            fixed: 'right',
            render: (_: any, record: ICompany) => (
                <Space size="large" className="action-buttons">
                    <Button
                        type="primary"
                        icon={<IconCheckCircle />}
                        onClick={() => updateCompanyStatus({
                            companyId: record.id || '',
                            status: 'approved',
                            isVerified: true,
                        })}
                        className="approve-button"
                    >
                        通过
                    </Button>
                    <Button
                        type="secondary"
                        icon={<IconCloseCircle />}
                        onClick={() => updateCompanyStatus({
                            companyId: record.id || '',
                            status: 'rejected',
                            isVerified: false,
                        })}
                        className="reject-button"
                    >
                        拒绝
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="approve-page">
            <Card className="approve-card">
                <Row justify="space-between" align="center" className="page-header">
                    <Col>
                        <Title heading={4}>公司审批</Title>
                    </Col>
                    <Col>
                        <div className="total-count">
                            <Text type="secondary">待审批</Text>
                            <Text className="count-number">{data?.total}</Text>
                            <Text type="secondary">条</Text>
                        </div>
                    </Col>
                </Row>
                <Divider />
                <Table
                    loading={isLoading}
                    columns={columns as any}
                    data={data?.companies || [] as any}
                    pagination={{
                        total: data?.total || 0,
                        showTotal: true,
                        sizeCanChange: true,
                        showJumper: true,
                        className: 'pagination'
                    }}
                    className="company-table"
                />
            </Card>
        </div>
    );
};

export default Page;