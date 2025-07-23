import { Table, Button, Card, Tag, Space, Typography, Divider, Grid, Input, Modal, Form } from '@arco-design/web-react';
import { IconCheckCircle, IconCloseCircle, IconCalendar, IconUserGroup, IconEdit } from '@arco-design/web-react/icon';
import { getCompanyApproveListApi, updateCompanyStatusApi } from '@/service/company';
import './style.css';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ICompany, ICompanyStatus } from '@/types/company';
import { useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { Row, Col } = Grid;
const FormItem = Form.Item;

const Page = () => {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

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
        </div>
    );
};

export default Page;