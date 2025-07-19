import React, { useState } from 'react';
import { Button, Modal, Form, Select, Input, Message, Card, Empty, Skeleton } from '@arco-design/web-react';
import { ISalaryReport, RECRUITMENT_TYPE_MAP } from '@/types/salary';
import dayjs from 'dayjs';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

interface SalaryReportListProps {
    companyId?: string;
    companyName?: string;
}

const EDUCATION_OPTIONS = [
    { label: '大专', value: '大专' },
    { label: '本科', value: '本科' },
    { label: '硕士', value: '硕士' },
    { label: '博士', value: '博士' },
    { label: '其他', value: '其他' }
];

const RECRUITMENT_TYPE_OPTIONS = Object.entries(RECRUITMENT_TYPE_MAP).map(([key, label]) => ({
    label,
    value: key
}));

export const SalaryReportList: React.FC<SalaryReportListProps> = ({ companyId, companyName }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [reports, setReports] = useState<ISalaryReport[]>([
        {
            id: '1',
            education: '本科',
            graduationDate: '2023',
            recruitmentType: 'campus',
            companyName: '示例科技有限公司',
            position: '前端开发工程师',
            salary: '25k*14+期权',
            city: '上海',
            remark: '🎉 福利待遇：\n- 五险一金全额缴纳\n- 每年14薪\n- 期权激励\n- 免费三餐\n- 无限量零食饮料\n\n💪 晋升空间：\n- 完善的职级体系\n- 导师制培养\n- 定期技术分享\n\n🏢 办公环境：\n- 人体工学椅\n- 4K显示器\n- MacBook Pro',
            userInfoId: 'user1',
            createdAt: new Date('2024-01-15'),
            user: {
                id: 'user1',
                nickname: '前端小王',
                avatar: 'https://example.com/avatar1.jpg'
            }
        },
        {
            id: '2',
            education: '硕士',
            graduationDate: '2024',
            recruitmentType: 'campus',
            companyName: '示例科技有限公司',
            position: '算法工程师',
            salary: '35k*15',
            city: '上海',
            remark: '部门氛围很好，技术栈新颖，主要做大模型相关研发。有完善的培训体系，入职后会有专门的导师带，晋升通道清晰。',
            userInfoId: 'user2',
            createdAt: new Date('2024-01-20'),
            user: {
                id: 'user2',
                nickname: '算法小李',
                avatar: 'https://example.com/avatar2.jpg'
            }
        },
        {
            id: '3',
            education: '本科',
            graduationDate: '2022',
            recruitmentType: 'social',
            companyName: '示例科技有限公司',
            position: '产品经理',
            salary: '30k*13',
            city: '上海',
            remark: '工作强度适中，周末双休，很少加班。产品线比较有趣，主要面向To B市场。公司有健身房，每月有团建经费。',
            userInfoId: 'user3',
            createdAt: new Date('2024-01-25'),
            user: {
                id: 'user3',
                nickname: '产品小张',
                avatar: 'https://example.com/avatar3.jpg'
            }
        }
    ]);

    const handleSubmit = async () => {
        try {
            const values = await form.validate();
            setLoading(true);
            
            // TODO: 调用API提交数据
            const newReport = {
                ...values,
                companyId,
                companyName: companyName || values.companyName
            };
            
            Message.success('发布成功');
            setVisible(false);
            form.resetFields();
            // 重新加载数据
            // loadReports();
            
        } catch (error) {
            console.error('提交失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderSalaryCard = (report: ISalaryReport) => (
        <Card
            key={report.id}
            className="hover:shadow-lg transition-shadow"
            bordered={false}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                                {report.user?.nickname?.[0] || '匿'}
                            </div>
                            <span className="font-medium">{report.user?.nickname || '匿名用户'}</span>
                        </div>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-500 text-sm">
                            {dayjs(report.createdAt).format('YYYY-MM-DD')}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <div className="text-gray-500 text-sm mb-1">岗位</div>
                            <div className="font-medium">{report.position}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">薪资</div>
                            <div className="font-bold text-red-500">{report.salary}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">招聘类型</div>
                            <div>{RECRUITMENT_TYPE_MAP[report.recruitmentType]}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">工作城市</div>
                            <div>{report.city}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">学历要求</div>
                            <div>{report.education}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">毕业时间</div>
                            <div>{report.graduationDate}</div>
                        </div>
                    </div>

                    {report.remark && (
                        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                            <div className="text-gray-500 text-sm mb-1">补充说明</div>
                            <div className="text-gray-700 text-sm whitespace-pre-wrap">{report.remark}</div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">薪资爆料</h2>
                <Button type="primary" onClick={() => setVisible(true)}>
                    发布薪资
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="w-full">
                            <Skeleton animation loading={true}>
                                <div className="h-40" />
                            </Skeleton>
                        </Card>
                    ))}
                </div>
            ) : reports.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {reports.map(report => renderSalaryCard(report))}
                </div>
            ) : (
                <Empty description="暂无薪资数据" />
            )}

            <Modal
                title="发布薪资信息"
                visible={visible}
                onOk={handleSubmit}
                onCancel={() => setVisible(false)}
                confirmLoading={loading}
                maskClosable={false}
                className="w-[600px]"
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="px-4"
                >
                    <FormItem
                        label="招聘类型"
                        field="recruitmentType"
                        rules={[{ required: true, message: '请选择招聘类型' }]}
                    >
                        <Select
                            placeholder="请选择招聘类型"
                            options={RECRUITMENT_TYPE_OPTIONS}
                        />
                    </FormItem>

                    <FormItem
                        label="学历"
                        field="education"
                        rules={[{ required: true, message: '请选择学历' }]}
                    >
                        <Select
                            placeholder="请选择学历"
                            options={EDUCATION_OPTIONS}
                        />
                    </FormItem>

                    <FormItem
                        label="毕业时间"
                        field="graduationDate"
                        rules={[{ required: true, message: '请输入毕业时间' }]}
                    >
                        <Input placeholder="例如: 2024" />
                    </FormItem>

                    {!companyName && (
                        <FormItem
                            label="公司名称"
                            field="companyName"
                            rules={[{ required: true, message: '请输入公司名称' }]}
                        >
                            <Input placeholder="请输入公司名称" />
                        </FormItem>
                    )}

                    <FormItem
                        label="岗位名称"
                        field="position"
                        rules={[{ required: true, message: '请输入岗位名称' }]}
                    >
                        <Input placeholder="请输入岗位名称" />
                    </FormItem>

                    <FormItem
                        label="薪资情况"
                        field="salary"
                        rules={[{ required: true, message: '请输入薪资情况' }]}
                    >
                        <Input placeholder="例如: 25k*14" />
                    </FormItem>

                    <FormItem
                        label="工作城市"
                        field="city"
                        rules={[{ required: true, message: '请输入工作城市' }]}
                    >
                        <Input placeholder="请输入工作城市" />
                    </FormItem>

                    <FormItem
                        label="备注说明"
                        field="remark"
                    >
                        <TextArea
                            placeholder="可以补充说明福利待遇、晋升空间等信息"
                            maxLength={500}
                            showWordLimit
                        />
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
}; 