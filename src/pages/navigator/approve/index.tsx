import { Table, Button, Card, Tag, Space, Typography, Divider, Input, Modal, Form, Tabs, Select } from '@arco-design/web-react';
import { IconCheckCircle, IconCloseCircle, IconCalendar, IconUserGroup, IconEdit } from '@arco-design/web-react/icon';
import { getCompanyApproveListApi, updateCompanyStatusApi } from '@/service/company';
import { approveCertificationApi, getCertificationsApi, rejectCertificationApi } from '@/service/admin';
import './style.css';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ICompany, ICompanyStatus } from '@/types/company';
import { useState } from 'react';
import { apiConfig } from '@/config';
import type { CertificationStatus, ICertificationApplication, ICertificationCurrentCompany } from '@/types/certification';

const { Title, Text, Paragraph } = Typography;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const Page = () => {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('company');
    const [certPagination, setCertPagination] = useState({ current: 1, pageSize: 10 });
    const [certStatus, setCertStatus] = useState<CertificationStatus>('pending');
    const [certActionVisible, setCertActionVisible] = useState(false);
    const [certActionType, setCertActionType] = useState<'approve' | 'reject'>('approve');
    const [certRemark, setCertRemark] = useState('');
    const [currentCertification, setCurrentCertification] = useState<ICertificationApplication | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['getCompanyApproveListApi'],
        queryFn: () => getCompanyApproveListApi().then(res => res.data),
    })

    const { mutate: updateCompanyStatus } = useMutation({
        mutationFn: (data: ICompanyStatus) => updateCompanyStatusApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getCompanyApproveListApi'] });
        }
    })

    const { data: certificationsData, isLoading: certificationsLoading } = useQuery({
        queryKey: ['getCertificationsApi', certPagination.current, certPagination.pageSize, certStatus],
        queryFn: () => getCertificationsApi({
            page: certPagination.current,
            pageSize: certPagination.pageSize,
            status: certStatus,
        }).then(res => res.data.data),
    })

    const { mutate: approveCertification, isPending: approvingCertification } = useMutation({
        mutationFn: (data: { userInfoId: string; remark?: string }) => approveCertificationApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getCertificationsApi', certPagination.current, certPagination.pageSize, certStatus]
            });
            setCertActionVisible(false);
            setCertRemark('');
            setCurrentCertification(null);
        }
    })

    const { mutate: rejectCertification, isPending: rejectingCertification } = useMutation({
        mutationFn: (data: { userInfoId: string; remark?: string }) => rejectCertificationApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getCertificationsApi', certPagination.current, certPagination.pageSize, certStatus]
            });
            setCertActionVisible(false);
            setCertRemark('');
            setCurrentCertification(null);
        }
    })

    // const {mutate: updateMetadata} = useMutation({
    //     mutationFn: (data: { companyId: string; metadata: { internalCode?: string; website?: string } }) => 
    //         updateCompanyMetadataApi(data),
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ['getCompanyApproveListApi'] });
    //         setVisible(false);
    //         form.resetFields();
    //     }
    // })

    // const handleEditMetadata = (record: ICompany) => {
    //     setCurrentCompany(record);
    //     form.setFieldsValue({
    //         internalCode: record.metadata?.internalCode || '',
    //         website: record.metadata?.website || ''
    //     });
    //     setVisible(true);
    // };

    // const handleUpdateMetadata = async () => {
    //     try {
    //         const values = await form.validate();
    //         if (currentCompany?.id) {
    //             updateMetadata({
    //                 companyId: currentCompany.id,
    //                 metadata: values
    //             });
    //         }
    //     } catch (error) {
    //         // 表单验证失败
    //     }
    // };

    const columns = [
        {
            title: '公司信息',
            dataIndex: 'name',
            width: 400,
            render: (_: string, record: ICompany) => (
                <div className="company-info">
                    <div className="company-logo">
                        {record.logo ? (
                            <img src={apiConfig.baseUrl + record.logo} alt={record.name} />
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
                        <Paragraph ellipsis={{ rows: 2 }} className="company-description line-clamp-2">
                            简介：{record.description}
                        </Paragraph>
                    </div>
                </div>
            ),
        },
        {
            title: '主营业务',
            dataIndex: 'mainBusiness',
            width: 200,
            render: (mainBusiness: string[]) => {
                return (
                    <div className="business-tags">
                        <Space wrap size={[8, 8]}>
                            {mainBusiness.map((business: string) => (
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
            title: '办公地点',
            dataIndex: 'address',
            width: 200,
            render: (address: string[]) => {
                return address.length > 0 && Array.isArray(address) ? <span className='flex flex-wrap gap-2 line-clamp-1'>
                    {address.join(',')}
                </span> : '暂无'
            }
        },
        {
            title: '投递链接',
            dataIndex: 'metadata',
            width: 200,
            render: (metadata: any) => {
                return metadata?.website ? <a href={metadata?.website} target="_blank" rel="noopener noreferrer" className='text-blue-500  line-clamp-1'>
                    {metadata?.website}
                </a> : <>暂无</>
            }
        },
        {
            title: '内推码',
            dataIndex: 'metadata',
            width: 100,
            render: (metadata: any) => {
                return metadata?.internalCode ? <Tag color="green">
                    {metadata?.internalCode}
                </Tag> : <>暂无</>
            }
        },
        {
            title: '操作',
            fixed: 'right' as const,
            render: (_: any, record: ICompany) => (
                <Space size="large" className="action-buttons">
                    <Button
                        type="primary"
                        size='small'
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
                        size='small'
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
                    <Button
                        type="outline"
                        size='small'
                        icon={<IconEdit />}
                    // onClick={() => handleEditMetadata(record)}
                    >
                        修改
                    </Button>
                </Space>
            ),
        },
    ];

    const certificationStatusColorMap: Record<CertificationStatus, string> = {
        none: 'gray',
        pending: 'orange',
        approved: 'green',
        rejected: 'red',
    };

    const certificationStatusTextMap: Record<CertificationStatus, string> = {
        none: '未认证',
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝',
    };

    const normalizeCurrentCompany = (value: unknown): ICertificationCurrentCompany | null => {
        if (!value) return null;
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value) as unknown;
                if (
                    parsed &&
                    typeof parsed === 'object' &&
                    'name' in parsed &&
                    typeof (parsed as { name?: unknown }).name === 'string'
                ) {
                    return parsed as ICertificationCurrentCompany;
                }
                return null;
            } catch {
                return null;
            }
        }
        if (typeof value === 'object' && 'name' in value && typeof (value as { name?: unknown }).name === 'string') {
            return value as ICertificationCurrentCompany;
        }
        return null;
    };

    const certificationColumns = [
        {
            title: '用户',
            dataIndex: 'username',
            width: 200,
            render: (_: string, record: ICertificationApplication) => (
                <Space direction="vertical" size={2}>
                    <Text>{record.username}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.user?.email || '-'}</Text>
                </Space>
            ),
        },
        {
            title: '在职公司',
            dataIndex: 'currentCompany',
            width: 220,
            render: (currentCompanyValue: unknown, record: ICertificationApplication) => {
                const currentCompany = normalizeCurrentCompany(currentCompanyValue) || normalizeCurrentCompany(record.currentCompany);
                return (
                    <Space direction="vertical" size={2}>
                        <Text>{currentCompany?.name || '-'}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {currentCompany?.department || '-'}{currentCompany?.position ? `-${currentCompany.position}` : ''}
                        </Text>
                    </Space>
                );
            },
        },
        {
            title: '角色',
            dataIndex: 'role',
            width: 120,
            render: (role: number) => {
                const roleTextMap: Record<number, string> = {
                    0: '普通用户',
                    1: '管理员',
                    2: '招聘者',
                };
                return <Tag color={role === 1 ? 'red' : role === 2 ? 'gold' : 'blue'}>
                    {roleTextMap[role] || role}
                </Tag>
            }
        },
        {
            title: '状态',
            dataIndex: 'certificationStatus',
            width: 120,
            render: (status: CertificationStatus) => (
                <Tag color={certificationStatusColorMap[status]}>
                    {certificationStatusTextMap[status]}
                </Tag>
            )
        },
        {
            title: '材料',
            dataIndex: 'certificationFile',
            width: 220,
            render: (file: string) => (
                file ? <a
                    href={apiConfig.baseUrl + file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='text-blue-500 line-clamp-1'
                >
                    查看
                </a> : <>暂无</>
            )
        },
        {
            title: '备注',
            dataIndex: 'certificationRemark',
            width: 260,
            render: (remark: string | null) => (
                <span className='line-clamp-2'>{remark || '-'}</span>
            )
        },
        {
            title: '提交时间',
            dataIndex: 'createdAt',
            width: 180,
            render: (createdAt: string) => (
                <span>{createdAt ? new Date(createdAt).toLocaleString() : '-'}</span>
            )
        },
        {
            title: '操作',
            fixed: 'right' as const,
            width: 220,
            render: (_: any, record: ICertificationApplication) => (
                <Space size="large" className="action-buttons">
                    <Button
                        type="primary"
                        size='small'
                        icon={<IconCheckCircle />}
                        disabled={record.certificationStatus !== 'pending'}
                        onClick={() => {
                            setCurrentCertification(record);
                            setCertActionType('approve');
                            setCertRemark('');
                            setCertActionVisible(true);
                        }}
                    >
                        通过
                    </Button>
                    <Button
                        type="secondary"
                        size='small'
                        icon={<IconCloseCircle />}
                        disabled={record.certificationStatus !== 'pending'}
                        onClick={() => {
                            setCurrentCertification(record);
                            setCertActionType('reject');
                            setCertRemark('');
                            setCertActionVisible(true);
                        }}
                    >
                        拒绝
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="approve-page px-6 py-4">
            <Card className="">
                <Tabs activeTab={activeTab} onChange={setActiveTab}>
                    <TabPane key="company" title="公司审批">
                        <div className="page-header">
                            <Title>公司审批</Title>
                            <div className="total-count">
                                <Text type="secondary">待审批</Text>
                                <Text className="count-number">{data?.total}</Text>
                                <Text type="secondary">条</Text>
                            </div>
                        </div>
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
                    </TabPane>
                    <TabPane key="certification" title="企业身份认证">
                        <div className="page-header">
                            <Title>企业身份认证</Title>
                            <div className="total-count">
                                <Text type="secondary">共</Text>
                                <Text className="count-number">{certificationsData?.pagination?.total || 0}</Text>
                                <Text type="secondary">条</Text>
                            </div>
                        </div>
                        <Space style={{ marginTop: 8 }}>
                            <Text type="secondary">状态筛选：</Text>
                            <Select
                                style={{ width: 180 }}
                                value={certStatus}
                                onChange={(value) => {
                                    setCertStatus(value as CertificationStatus);
                                    setCertPagination((prev) => ({ ...prev, current: 1 }));
                                }}
                                options={[
                                    { label: '待审核', value: 'pending' },
                                    { label: '已通过', value: 'approved' },
                                    { label: '已拒绝', value: 'rejected' },
                                    { label: '未认证', value: 'none' },
                                ]}
                            />
                        </Space>
                        <Divider />
                        <Table
                            loading={certificationsLoading}
                            columns={certificationColumns as any}
                            data={certificationsData?.items || [] as any}
                            pagination={{
                                current: certPagination.current,
                                pageSize: certPagination.pageSize,
                                total: certificationsData?.pagination?.total || 0,
                                showTotal: true,
                                sizeCanChange: true,
                                showJumper: true,
                                className: 'pagination',
                                onChange: (current: number) => {
                                    setCertPagination((prev) => ({ ...prev, current }));
                                },
                                onPageSizeChange: (pageSize: number) => {
                                    setCertPagination({ current: 1, pageSize });
                                },
                            }}
                            className="company-table"
                        />
                    </TabPane>
                </Tabs>
            </Card>

            <Modal
                title="编辑公司信息"
                visible={visible}
                // onOk={handleUpdateMetadata}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                }}
                autoFocus={false}
                maskClosable={false}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <FormItem
                        label="内推码"
                        field="internalCode"
                    >
                        <Input placeholder="请输入内推码" />
                    </FormItem>
                    <FormItem
                        label="官网链接"
                        field="website"
                        rules={[
                            {
                                type: 'url',
                                message: '请输入有效的URL'
                            }
                        ]}
                    >
                        <Input placeholder="请输入官网链接" />
                    </FormItem>
                </Form>
            </Modal>

            <Modal
                title={certActionType === 'approve' ? '通过认证' : '拒绝认证'}
                visible={certActionVisible}
                confirmLoading={approvingCertification || rejectingCertification}
                onOk={() => {
                    if (!currentCertification?.id) return;
                    if (certActionType === 'approve') {
                        approveCertification({
                            userInfoId: currentCertification.id,
                            remark: certRemark.trim() ? certRemark.trim() : undefined,
                        });
                        return;
                    }
                    rejectCertification({
                        userInfoId: currentCertification.id,
                        remark: certRemark.trim() ? certRemark.trim() : '认证未通过',
                    });
                }}
                onCancel={() => {
                    setCertActionVisible(false);
                    setCertRemark('');
                    setCurrentCertification(null);
                }}
                autoFocus={false}
                maskClosable={false}
            >
                <Form layout="vertical">
                    <FormItem label="备注（可选）">
                        <Input.TextArea
                            value={certRemark}
                            onChange={(value) => setCertRemark(value)}
                            placeholder={certActionType === 'approve' ? '通过原因（可选）' : '拒绝原因（默认：认证未通过）'}
                            autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
};

export default Page;
