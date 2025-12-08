import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Form, Select, Input, Message, Card, Empty, Skeleton, Typography } from '@arco-design/web-react';
import { ISalaryReport, ISalaryReportForm, RECRUITMENT_TYPE_MAP } from '@/types/salary';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCompanySalaryReportApi, publishSalaryReportApi } from '@/service/company';
import { createChatCompletion } from '@/api/ai';
import { Globe2, Sparkles } from 'lucide-react';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const { Paragraph } = Typography;

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

const config = (report: ISalaryReport) => {
    return [
        {
            label: '岗位',
            value: report.position
        },
        {
            label: '薪资',
            value: report.salary
        },
        {
            label: '招聘类型',
            value: RECRUITMENT_TYPE_MAP[report.recruitmentType]
        },
        {
            label: '工作城市',
            value: report.city
        },
        {
            label: '学历',
            value: report.education
        }

    ]
}

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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:flex justify-between gap-4 mb-4">
                    {config(report).map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="">{item.label}: </div>
                            <div className="text-black">{item.value}</div>
                        </div>
                    ))}
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

export const SalaryReportList: React.FC<SalaryReportListProps> = ({ companyId, companyName }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aiSummary, setAiSummary] = useState('');
    const queryClient = useQueryClient();
    const [form] = Form.useForm();

    const { data } = useQuery({
        queryKey: ['getCompanySalaryReportApi', companyId],
        queryFn: () => getCompanySalaryReportApi({ companyId }).then(res => res.data)
    });

    const { mutate: publishSalaryReport } = useMutation({
        mutationFn: (data: ISalaryReportForm) => publishSalaryReportApi(data),
        onSuccess: () => {
            Message.success('发布成功');
            setVisible(false);
            form.resetFields();
            queryClient.invalidateQueries({ queryKey: ['getCompanySalaryReportApi', companyId] });
        }
    });

    const reports = data?.reports || [];
    const total = data?.total || 0;
    const topPositions = useMemo(
        () => Array.from(new Set(reports.map(report => report.position).filter(Boolean))).slice(0, 4),
        [reports]
    );
    const topCities = useMemo(
        () => Array.from(new Set(reports.map(report => report.city).filter(Boolean))).slice(0, 4),
        [reports]
    );

    useEffect(() => {
        setAiSummary('');
    }, [companyId]);

    const { mutateAsync: generateSummary, isPending: isSummarizing } = useMutation({
        mutationFn: async (payload: { reports: ISalaryReport[]; total: number; companyName?: string }) => {
            const { reports, total, companyName } = payload;

            if (!reports.length) {
                throw new Error('暂无薪资数据可总结');
            }

            const limited = reports.slice(0, 25);
            const lines = limited.map((report) => {
                const recruitment = RECRUITMENT_TYPE_MAP[report.recruitmentType] || report.recruitmentType;
                return [
                    `岗位:${report.position}`,
                    `城市:${report.city}`,
                    `类型:${recruitment}`,
                    `学历:${report.education}`,
                    `薪资:${report.salary}`
                ].join(' | ');
            }).join('\n');

            const positionsForWeb = Array.from(new Set(limited.map(report => report.position).filter(Boolean))).slice(0, 5);
            const citiesForWeb = Array.from(new Set(limited.map(report => report.city).filter(Boolean))).slice(0, 5);

            const fetchMarketSnapshot = async () => {
                if (!positionsForWeb.length && !citiesForWeb.length) return '';

                try {
                    const result = await createChatCompletion({
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: '你是薪酬市场调研助手，需要快速梳理最近半年公开招聘/薪资行情，帮我得到岗位在城市的市场区间。'
                            },
                            {
                                role: 'user',
                                content: `请结合联网搜索到的公开信息，概括以下岗位在这些城市的主流薪资区间与趋势，控制在60字内。\n岗位：${positionsForWeb.join('、') || '未提供'}\n城市：${citiesForWeb.join('、') || '未提供'}`
                            }
                        ],
                        temperature: 0.35
                    });

                    return result?.choices?.[0]?.message?.content?.trim() || '';
                } catch (error) {
                    console.error('获取网络薪资行情失败', error);
                    return '';
                }
            };

            const webInsight = await fetchMarketSnapshot();

            const res = await createChatCompletion({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: '你是一名薪酬分析师，会综合用户爆料数据和网络公开薪酬行情，给出精简中文总结，突出各岗位在不同城市的大致薪资区间，并说明样本来源，控制在120字内。'
                    },
                    {
                        role: 'user',
                        content: `公司：${companyName || '未知公司'}\n样本数量：${limited.length}/${total}\n本地数据：\n${lines}\n\n网络行情参考：${webInsight || '未能获取到网络行情，请依据公开市场常识补充'}`
                    }
                ],
                temperature: 0.45
            });

            const text = res?.choices?.[0]?.message?.content?.trim();
            if (!text) {
                throw new Error('AI 未返回总结');
            }
            return text;
        },
        onSuccess: (text) => setAiSummary(text),
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : '生成摘要失败，请稍后重试';
            Message.error(message);
        }
    });

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

            publishSalaryReport(newReport);

        } catch (error) {
            console.error('提交失败:', error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">薪资爆料</h2>
                <Button type="primary" size="small" onClick={() => setVisible(true)}>
                    发布薪资
                </Button>
            </div>

            <Card className="mb-6 overflow-hidden border border-[#e9ecf1] dark:border-[#2a2c33] rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5f8ff] via-white to-[#eef2ff] dark:from-[#0d0f17] dark:via-[#0b0c13] dark:to-[#11121b]">
                    <div className="pointer-events-none absolute inset-0 opacity-70">
                        <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#4c79ff]/15 blur-3xl" />
                        <div className="absolute right-0 top-10 h-32 w-32 rounded-full bg-[#22d3ee]/12 blur-3xl" />
                    </div>
                    <div className="relative p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 shadow-sm">
                                    <Sparkles size={18} className="text-blue-600 dark:text-blue-200" />
                                </div>
                                <div>
                                    <div className="text-[12px] uppercase tracking-[0.08em] text-blue-600 dark:text-blue-200 font-semibold">AI 薪资洞察</div>
                                    <div className="text-base font-semibold text-gray-900 dark:text-gray-50">智能薪资总结</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">融合用户爆料与网络薪资行情，快速锁定参考区间</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 text-xs text-gray-600 dark:text-gray-300">
                                    <span className="flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        本地 {reports.length} 条
                                    </span>
                                    <span className="h-4 w-px bg-gray-200 dark:bg-white/10" />
                                    <span className="flex items-center gap-1">
                                        <Globe2 size={14} className="text-blue-500" />
                                        网络行情
                                    </span>
                                </div>
                                <Button
                                    type="primary"
                                    size="small"
                                    className="flex items-center gap-1"
                                    loading={isSummarizing}
                                    disabled={!reports.length}
                                    onClick={() => generateSummary({ reports, total, companyName })}
                                >
                                    <Sparkles size={14} />
                                    {aiSummary ? '重新生成' : '生成总结'}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.15fr)]">
                            <div className="rounded-xl border border-white/80 dark:border-white/10 bg-white/90 dark:bg-[#0e1018]/80 shadow-sm px-4 py-3">
                                <Paragraph className="!mb-2 text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                                    {aiSummary || (isSummarizing ? 'AI 正在生成总结…' : '点击右上角的按钮，生成结合本地爆料与网络数据的薪资总结')}
                                </Paragraph>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    样本 {Math.min(reports.length, 25)} / {total}，将自动融合网络公开行情补全数据稀疏的岗位/城市。
                                </div>
                            </div>
                            <div className="rounded-xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                                    <Globe2 size={16} className="text-blue-600 dark:text-blue-300" />
                                    关注的岗位 / 城市
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {topPositions.length ? topPositions.map((item) => (
                                        <span key={item} className="px-2.5 py-1 rounded-full bg-[#eef3ff] text-[12px] text-blue-700 dark:bg-white/10 dark:text-blue-100">
                                            {item}
                                        </span>
                                    )) : (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">暂无岗位信息</span>
                                    )}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {topCities.length ? topCities.map((item) => (
                                        <span key={item} className="px-2.5 py-1 rounded-full bg-[#ecfdf3] text-[12px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100">
                                            {item}
                                        </span>
                                    )) : (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">暂无城市信息</span>
                                    )}
                                </div>
                                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                    每次仅取最近 25 条爆料作为样本，结合网络数据生成更稳健的区间。
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

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
