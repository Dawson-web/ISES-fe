import { useMemo, useState } from "react";
import {
  Card,
  Tabs,
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  Typography,
  Select,
  Skeleton,
  Empty,
  Modal,
  Form,
  Input,
  Checkbox,
} from "@arco-design/web-react";
import { IconDelete, IconSearch } from "@arco-design/web-react/icon";
import { observer } from "mobx-react-lite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";
import userStore from "@/store/User";
import {
  deleteAdminArticleApi,
  deleteAdminUserApi,
  getAdminArticlesApi,
  getAdminUsersApi,
  getAdminCompaniesApi,
  updateAdminCompanyApi,
  deleteAdminCompanyApi,
} from "@/service/admin";
import type { IAdminUser } from "@/types/admin/management";
import type { IArticle } from "@/types/article";
import type { ICompany } from "@/types/company";

const { Title, Text } = Typography;
const TabPane = Tabs.TabPane;

const roleMap = {
  0: { text: "普通用户", color: "blue" },
  1: { text: "招聘者", color: "gold" },
  2: { text: "管理员", color: "red" },
};

const Page = observer(() => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("users");
  const [userPagination, setUserPagination] = useState({ current: 1, pageSize: 10 });
  const [articlePagination, setArticlePagination] = useState({ current: 1, pageSize: 10 });
  const [articleType, setArticleType] = useState<string | undefined>(undefined);
  const [companyPagination, setCompanyPagination] = useState({ current: 1, pageSize: 10 });
  const [companyStatus, setCompanyStatus] = useState<"pending" | "approved" | "rejected" | undefined>();
  const [companyKeyword, setCompanyKeyword] = useState<string>("");
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState<ICompany | null>(null);
  const [companyForm] = Form.useForm();

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["adminUsers", userPagination],
    queryFn: () =>
      getAdminUsersApi({
        page: userPagination.current,
        pageSize: userPagination.pageSize,
      }).then((res) => res.data.data),
    enabled: userStore.role === 2,
  });

  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ["adminArticles", articlePagination, articleType],
    queryFn: () =>
      getAdminArticlesApi({
        page: articlePagination.current,
        pageSize: articlePagination.pageSize,
        type: articleType || undefined,
      }).then((res) => res.data.data),
    enabled: userStore.role === 2,
  });

  const { mutate: deleteUser, isPending: deletingUser } = useMutation({
    mutationFn: (id: string) => deleteAdminUserApi(id),
    onSuccess: (res) => {
      toast.success(res.data.message || "删除用户成功");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "删除失败";
      toast.error(msg);
    },
  });

  const { mutate: deleteArticle, isPending: deletingArticle } = useMutation({
    mutationFn: (id: string) => deleteAdminArticleApi(id),
    onSuccess: (res) => {
      toast.success(res.data.message || "删除内容成功");
      queryClient.invalidateQueries({ queryKey: ["adminArticles"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "删除失败";
      toast.error(msg);
    },
  });

  const { data: companiesData, isLoading: companiesLoading } = useQuery({
    queryKey: ["adminCompanies", companyPagination, companyStatus, companyKeyword],
    queryFn: () =>
      getAdminCompaniesApi({
        page: companyPagination.current,
        pageSize: companyPagination.pageSize,
        status: companyStatus,
        keyword: companyKeyword || undefined,
      }).then((res) => res.data.data),
    enabled: userStore.role === 2,
  });

  const { mutate: updateCompany, isPending: updatingCompany } = useMutation({
    mutationFn: (payload: { id: string; data: Partial<ICompany> }) =>
      updateAdminCompanyApi(payload.id, payload.data),
    onSuccess: (res) => {
      toast.success(res.data.message || "更新公司成功");
      setCompanyModalVisible(false);
      setEditingCompany(null);
      companyForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["adminCompanies"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "更新失败";
      toast.error(msg);
    },
  });

  const { mutate: deleteCompany, isPending: deletingCompany } = useMutation({
    mutationFn: (id: string) => deleteAdminCompanyApi(id),
    onSuccess: (res) => {
      toast.success(res.data.message || "删除公司成功");
      queryClient.invalidateQueries({ queryKey: ["adminCompanies"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "删除失败";
      toast.error(msg);
    },
  });

  const userColumns = useMemo(
    () => [
      {
        title: "用户名",
        dataIndex: "username",
        width: 160,
        render: (text: string) => <Text ellipsis={{ rows: 1 }}>{text || "-"}</Text>,
      },
      {
        title: "邮箱",
        dataIndex: "user",
        width: 200,
        render: (_: unknown, record: IAdminUser) =>
          record.user?.email || record.User?.email || "-",
      },
      {
        title: "角色",
        dataIndex: "role",
        width: 120,
        render: (role: number) => (
          <Tag color={roleMap[role as 0 | 1 | 2]?.color || "blue"}>
            {roleMap[role as 0 | 1 | 2]?.text || role}
          </Tag>
        ),
      },
      {
        title: "注册时间",
        dataIndex: "createdAt",
        width: 180,
        render: (_: unknown, record: IAdminUser) =>
          record.user?.createdAt || record.User?.createdAt
            ? dayjs(record.user?.createdAt || record.User?.createdAt).format("YYYY-MM-DD HH:mm")
            : "-",
      },
      {
        title: "操作",
        dataIndex: "actions",
        width: 120,
        render: (_: unknown, record: IAdminUser) => (
          <Popconfirm
            title="确定删除该用户？"
            okText="删除"
            cancelText="取消"
            okButtonProps={{ status: "danger" }}
            onOk={() => deleteUser(record.id)}
            disabled={deletingUser}
          >
            <Button size="small" status="danger" icon={<IconDelete />}>
              删除
            </Button>
          </Popconfirm>
        ),
      },
    ],
    [deletingUser]
  );

  const articleColumns = useMemo(
    () => [
      {
        title: "标题",
        dataIndex: "title",
        width: 220,
        render: (text: string) => (
          <Text ellipsis={{ rows: 1, showTooltip: true }}>{text || "-"}</Text>
        ),
      },
      {
        title: "类型",
        dataIndex: "contentType",
        width: 120,
        render: (text: string) => <Tag color="arcoblue">{text || "-"}</Tag>,
      },
      {
        title: "作者",
        dataIndex: "creator",
        width: 160,
        render: (_: unknown, record: IArticle) => (
          <Space size={6}>
            <span>{record.creator?.username || "-"}</span>
          </Space>
        ),
      },
      {
        title: "浏览",
        dataIndex: "metadata",
        width: 100,
        align: "right" as const,
        render: (metadata: IArticle["metadata"]) => metadata?.viewCount ?? 0,
      },
      {
        title: "点赞",
        dataIndex: "metadata",
        width: 100,
        align: "right" as const,
        render: (metadata: IArticle["metadata"]) => metadata?.likeCount ?? 0,
      },
      {
        title: "评论",
        dataIndex: "metadata",
        width: 100,
        align: "right" as const,
        render: (metadata: IArticle["metadata"]) => metadata?.commentCount ?? 0,
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        width: 180,
        render: (text: string) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "-"),
      },
      {
        title: "操作",
        dataIndex: "actions",
        width: 120,
        render: (_: unknown, record: IArticle) => (
          <Popconfirm
            title="确定删除该内容？"
            okText="删除"
            cancelText="取消"
            okButtonProps={{ status: "danger" }}
            onOk={() => deleteArticle(String(record.id))}
            disabled={deletingArticle}
          >
            <Button size="small" status="danger" icon={<IconDelete />}>
              删除
            </Button>
          </Popconfirm>
        ),
      },
    ],
    [deletingArticle]
  );

  const companyColumns = useMemo(
    () => [
      {
        title: "公司名",
        dataIndex: "name",
        width: 200,
        render: (text: string) => <Text ellipsis={{ rows: 1 }}>{text || "-"}</Text>,
      },
      {
        title: "地点",
        dataIndex: "address",
        width: 200,
        render: (address: string[]) => (address || []).join(" / "),
      },
      {
        title: "主营业务",
        dataIndex: "mainBusiness",
        width: 200,
        render: (biz: string[]) => (
          <Space wrap size={4}>
            {(biz || []).map((b) => (
              <Tag key={b}>{b}</Tag>
            ))}
          </Space>
        ),
      },
      {
        title: "人数规模",
        dataIndex: "employeeCount",
        width: 100,
      },
      {
        title: "状态",
        dataIndex: "status",
        width: 120,
        render: (status: ICompany["status"]) => {
          const color =
            status === "approved" ? "green" : status === "rejected" ? "red" : "orange";
          return <Tag color={color}>{status || "pending"}</Tag>;
        },
      },
      {
        title: "官网",
        dataIndex: "metadata",
        width: 180,
        render: (meta: ICompany["metadata"]) =>
          meta?.website ? (
            <a href={meta.website} target="_blank" rel="noopener noreferrer">
              {meta.website}
            </a>
          ) : (
            "-"
          ),
      },
      {
        title: "操作",
        dataIndex: "actions",
        width: 140,
        render: (_: unknown, record: ICompany) => (
          <Space>
            <Button
              size="small"
              type="outline"
              onClick={() => {
                setEditingCompany(record);
                companyForm.setFieldsValue({
                  name: record.name,
                  description: record.description,
                  address: (record.address || []).join(","),
                  mainBusiness: (record.mainBusiness || []).join(","),
                  employeeCount: record.employeeCount,
                  status: record.status,
                  website: record.metadata?.website,
                  internalCode: record.metadata?.internalCode,
                  isVerified: record.isVerified,
                });
                setCompanyModalVisible(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除该公司？"
              okText="删除"
              cancelText="取消"
              okButtonProps={{ status: "danger" }}
              onOk={() => record.id && deleteCompany(record.id)}
              disabled={deletingCompany}
            >
              <Button size="small" status="danger" icon={<IconDelete />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [companyForm, deleteCompany, deletingCompany]
  );

  if (userStore.role !== 2) {
    return (
      <div className="px-6 py-10">
        <Card>
          <Space direction="vertical" size={6}>
            <Title heading={4} style={{ margin: 0 }}>
              暂无权限
            </Title>
            <Text type="secondary">仅管理员可访问该页面。</Text>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 space-y-4 bg-[#f7f8fa]">
      <div className="flex items-center justify-between">
        <div>
          <Title heading={3} style={{ margin: 0 }}>
            管理员面板
          </Title>
          <Text type="secondary">用户 / 内容管理</Text>
        </div>
      </div>

      <Tabs activeTab={activeTab} onChange={setActiveTab}>
        <TabPane key="users" title="用户管理">
          <Card>
            <Skeleton loading={usersLoading} animation>
              <Table
                rowKey="id"
                columns={userColumns as any}
                data={usersData?.users || []}
                pagination={{
                  current: userPagination.current,
                  pageSize: userPagination.pageSize,
                  total: usersData?.pagination?.total || 0,
                  sizeCanChange: true,
                  showTotal: true,
                  onChange: (current) => setUserPagination((prev) => ({ ...prev, current })),
                  onPageSizeChange: (pageSize) =>
                    setUserPagination({ current: 1, pageSize }),
                }}
                tableLayout="fixed"
                bordered
                locale={{ emptyText: <Empty description="暂无用户" /> }}
              />
            </Skeleton>
          </Card>
        </TabPane>

        <TabPane key="articles" title="内容管理">
          <Card>
            <Space className="mb-3" align="center">
              <Text type="secondary">类型筛选</Text>
              <Select
                allowClear
                placeholder="全部类型"
                style={{ width: 180 }}
                value={articleType}
                onChange={(value) => {
                  setArticleType(value);
                  setArticlePagination((prev) => ({ ...prev, current: 1 }));
                }}
              >
                <Select.Option value="article">文章</Select.Option>
                <Select.Option value="video">视频</Select.Option>
                <Select.Option value="life">生活</Select.Option>
              </Select>
            </Space>
            <Skeleton loading={articlesLoading} animation>
              <Table
                rowKey="id"
                columns={articleColumns as any}
                data={articlesData?.articles || []}
                pagination={{
                  current: articlePagination.current,
                  pageSize: articlePagination.pageSize,
                  total: articlesData?.pagination?.total || 0,
                  sizeCanChange: true,
                  showTotal: true,
                  onChange: (current) =>
                    setArticlePagination((prev) => ({ ...prev, current })),
                  onPageSizeChange: (pageSize) =>
                    setArticlePagination({ current: 1, pageSize }),
                }}
                tableLayout="fixed"
                bordered
                locale={{ emptyText: <Empty description="暂无内容" /> }}
              />
            </Skeleton>
          </Card>
        </TabPane>

        <TabPane key="companies" title="公司管理">
          <Card>
            <Space className="mb-3" align="center">
              <Text type="secondary">状态</Text>
              <Select
                allowClear
                placeholder="全部"
                style={{ width: 140 }}
                value={companyStatus}
                onChange={(value) => {
                  setCompanyStatus(value as any);
                  setCompanyPagination((prev) => ({ ...prev, current: 1 }));
                }}
              >
                <Select.Option value="pending">待审核</Select.Option>
                <Select.Option value="approved">已通过</Select.Option>
                <Select.Option value="rejected">已拒绝</Select.Option>
              </Select>
              <Text type="secondary">关键词</Text>
              <Input
                allowClear
                placeholder="名称/简介"
                style={{ width: 200 }}
                prefix={<IconSearch />}
                value={companyKeyword}
                onChange={(value) => setCompanyKeyword(value)}
                onPressEnter={() => setCompanyPagination((prev) => ({ ...prev, current: 1 }))}
              />
              <Button
                type="primary"
                onClick={() => setCompanyPagination((prev) => ({ ...prev, current: 1 }))}
              >
                搜索
              </Button>
            </Space>
            <Skeleton loading={companiesLoading} animation>
              <Table
                rowKey="id"
                columns={companyColumns as any}
                data={companiesData?.companies || []}
                pagination={{
                  current: companyPagination.current,
                  pageSize: companyPagination.pageSize,
                  total: companiesData?.pagination?.total || 0,
                  sizeCanChange: true,
                  showTotal: true,
                  onChange: (current) => setCompanyPagination((prev) => ({ ...prev, current })),
                  onPageSizeChange: (pageSize) =>
                    setCompanyPagination({ current: 1, pageSize }),
                }}
                tableLayout="fixed"
                bordered
                locale={{ emptyText: <Empty description="暂无公司" /> }}
              />
            </Skeleton>
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title="编辑公司信息"
        visible={companyModalVisible}
        onOk={() => {
          companyForm.validate().then((values) => {
            if (!editingCompany?.id) return;
            updateCompany({
              id: editingCompany.id,
              data: {
                name: values.name,
                description: values.description,
                address: values.address ? values.address.split(",").map((v: string) => v.trim()) : [],
                mainBusiness: values.mainBusiness
                  ? values.mainBusiness.split(",").map((v: string) => v.trim())
                  : [],
                employeeCount: values.employeeCount,
                status: values.status,
                metadata: {
                  internalCode: values.internalCode || undefined,
                  website: values.website || undefined,
                },
                isVerified: values.isVerified,
              },
            });
          });
        }}
        onCancel={() => {
          setCompanyModalVisible(false);
          setEditingCompany(null);
          companyForm.resetFields();
        }}
        confirmLoading={updatingCompany}
        autoFocus={false}
        maskClosable={false}
      >
        <Form form={companyForm} layout="vertical">
          <Form.Item label="公司名" field="name" rules={[{ required: true, message: "必填" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="简介" field="description">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
          <Form.Item
            label="地址（逗号分隔）"
            field="address"
            rules={[{ required: true, message: "必填" }]}
          >
            <Input placeholder="如：北京,上海" />
          </Form.Item>
          <Form.Item
            label="主营业务（逗号分隔）"
            field="mainBusiness"
            rules={[{ required: true, message: "必填" }]}
          >
            <Input placeholder="如：AI,电商" />
          </Form.Item>
          <Form.Item label="人数规模" field="employeeCount">
            <Input placeholder="如：100-500人" />
          </Form.Item>
          <Form.Item label="状态" field="status">
            <Select placeholder="选择状态" allowClear>
              <Select.Option value="pending">待审核</Select.Option>
              <Select.Option value="approved">已通过</Select.Option>
              <Select.Option value="rejected">已拒绝</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="官网" field="website">
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item label="内推码" field="internalCode">
            <Input />
          </Form.Item>
          <Form.Item label="已认证" field="isVerified" triggerPropName="checked">
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default Page;
