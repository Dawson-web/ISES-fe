import { useEffect, useMemo, useState } from "react";
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
import {
  IconCheckCircle,
  IconCloseCircle,
  IconDelete,
  IconSearch,
  IconUserGroup,
  IconCalendar,
} from "@arco-design/web-react/icon";
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
  getCertificationsApi,
  rejectCertificationApi,
  approveCertificationApi,
} from "@/service/admin";
import {
  getCompanyApproveListApi,
  updateCompanyStatusApi,
} from "@/service/company";
import type { IAdminUser } from "@/types/admin/management";
import type { IArticle } from "@/types/article";
import type { ICompany, ICompanyStatus } from "@/types/company";
import type {
  CertificationStatus,
  ICertificationApplication,
  ICertificationCurrentCompany,
} from "@/types/certification";
import { apiConfig } from "@/config";

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
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 768);
  const [certPagination, setCertPagination] = useState({ current: 1, pageSize: 10 });
  const [certStatus, setCertStatus] = useState<CertificationStatus>("pending");
  const [certActionVisible, setCertActionVisible] = useState(false);
  const [certActionType, setCertActionType] = useState<"approve" | "reject">("approve");
  const [certRemark, setCertRemark] = useState("");
  const [currentCertification, setCurrentCertification] = useState<ICertificationApplication | null>(null);

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  const { data: approveListData, isLoading: approveListLoading } = useQuery({
    queryKey: ["companyApproveList"],
    queryFn: () => getCompanyApproveListApi().then((res) => res.data),
    enabled: userStore.role === 2,
  });

  const { data: certificationsData, isLoading: certificationsLoading } = useQuery({
    queryKey: ["getCertificationsApi", certPagination.current, certPagination.pageSize, certStatus],
    queryFn: () =>
      getCertificationsApi({
        page: certPagination.current,
        pageSize: certPagination.pageSize,
        status: certStatus,
      }).then((res) => res.data),
    enabled: userStore.role === 2,
  });
  console.log(123, certificationsData?.data);
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

  const { mutate: updateCompanyStatus, isPending: updatingCompanyStatus } = useMutation({
    mutationFn: (payload: ICompanyStatus) => updateCompanyStatusApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyApproveList"] });
      toast.success("更新公司状态成功");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "更新失败";
      toast.error(msg);
    },
  });

  const { mutate: approveCertification, isPending: approvingCertification } = useMutation({
    mutationFn: (data: { userInfoId: string; remark?: string }) => approveCertificationApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCertificationsApi", certPagination.current, certPagination.pageSize, certStatus],
      });
      setCertActionVisible(false);
      setCertRemark("");
      setCurrentCertification(null);
      toast.success("认证已通过");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "操作失败";
      toast.error(msg);
    },
  });

  const { mutate: rejectCertification, isPending: rejectingCertification } = useMutation({
    mutationFn: (data: { userInfoId: string; remark?: string }) => rejectCertificationApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCertificationsApi", certPagination.current, certPagination.pageSize, certStatus],
      });
      setCertActionVisible(false);
      setCertRemark("");
      setCurrentCertification(null);
      toast.success("认证已拒绝");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "操作失败";
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
              onOk={() => record.id && deleteCompany(record.id || "")}
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

  const certificationStatusColorMap: Record<CertificationStatus, string> = {
    none: "gray",
    pending: "orange",
    approved: "green",
    rejected: "red",
  };

  const certificationStatusTextMap: Record<CertificationStatus, string> = {
    none: "未认证",
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝",
  };

  const normalizeCurrentCompany = (value: unknown): ICertificationCurrentCompany | null => {
    if (!value) return null;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value) as unknown;
        if (
          parsed &&
          typeof parsed === "object" &&
          "name" in parsed &&
          typeof (parsed as { name?: unknown }).name === "string"
        ) {
          return parsed as ICertificationCurrentCompany;
        }
        return null;
      } catch {
        return null;
      }
    }
    if (
      typeof value === "object" &&
      "name" in value &&
      typeof (value as { name?: unknown }).name === "string"
    ) {
      return value as ICertificationCurrentCompany;
    }
    return null;
  };

  const companyApproveColumns = useMemo(
    () => [
      {
        title: "公司信息",
        dataIndex: "name",
        width: isCompact ? 280 : 400,
        render: (_: string, record: ICompany) => (
          <div className="flex gap-3 items-start">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100 flex items-center justify-center">
              {record.logo ? (
                <img
                  src={apiConfig.baseUrl + record.logo}
                  alt={record.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-500">{record.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <Text className="font-semibold">{record.name}</Text>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <IconCalendar />{" "}
                  {record.establishedDate ? new Date(record.establishedDate).toLocaleDateString() : "-"}
                </span>
                <span className="flex items-center gap-1">
                  <IconUserGroup /> {record.employeeCount || "-"}
                </span>
              </div>
              <Text type="secondary" className="block text-xs mt-1" ellipsis={{ rows: 2 }}>
                简介：{record.description || "-"}
              </Text>
            </div>
          </div>
        ),
      },
      {
        title: "主营业务",
        dataIndex: "mainBusiness",
        width: isCompact ? 160 : 200,
        render: (mainBusiness: string[]) => (
          <Space wrap size={6}>
            {(mainBusiness || []).map((biz) => (
              <Tag key={biz}>{biz}</Tag>
            ))}
          </Space>
        ),
      },
      {
        title: "办公地点",
        dataIndex: "address",
        width: isCompact ? 160 : 200,
        render: (address: string[]) =>
          address && Array.isArray(address) && address.length ? address.join(",") : "暂无",
      },
      ...(isCompact
        ? []
        : ([
          {
            title: "投递链接",
            dataIndex: "metadata",
            width: 200,
            render: (metadata: any) =>
              metadata?.website ? (
                <a href={metadata.website} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {metadata.website}
                </a>
              ) : (
                "暂无"
              ),
          },
          {
            title: "内推码",
            dataIndex: "metadata",
            width: 100,
            render: (metadata: any) => (metadata?.internalCode ? <Tag color="green">{metadata.internalCode}</Tag> : "暂无"),
          },
        ] as const)),
      {
        title: "操作",
        fixed: "right" as const,
        render: (_: unknown, record: ICompany) => (
          <Space size="large">
            <Button
              type="primary"
              size="small"
              icon={<IconCheckCircle />}
              loading={updatingCompanyStatus}
              onClick={() =>
                updateCompanyStatus({
                  companyId: record.id || "",
                  status: "approved",
                  isVerified: true,
                })
              }
            >
              通过
            </Button>
            <Button
              type="secondary"
              size="small"
              icon={<IconCloseCircle />}
              loading={updatingCompanyStatus}
              onClick={() =>
                updateCompanyStatus({
                  companyId: record.id || "",
                  status: "rejected",
                  isVerified: false,
                })
              }
            >
              拒绝
            </Button>
          </Space>
        ),
      },
    ],
    [isCompact, updateCompanyStatus, updatingCompanyStatus]
  );

  const certificationColumns = useMemo(
    () => [
      {
        title: "用户",
        dataIndex: "username",
        width: isCompact ? 200 : 220,
        render: (_: string, record: ICertificationApplication) => (
          <Space direction="vertical" size={2}>
            <Text>{record.username}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.user?.email || "-"}
            </Text>
          </Space>
        ),
      },
      {
        title: "在职公司",
        dataIndex: "currentCompany",
        width: isCompact ? 200 : 240,
        render: (currentCompanyValue: unknown, record: ICertificationApplication) => {
          const currentCompany =
            normalizeCurrentCompany(currentCompanyValue) || normalizeCurrentCompany(record.currentCompany);
          return (
            <Space direction="vertical" size={2}>
              <Text>{currentCompany?.name || "-"}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {currentCompany?.department || "-"}
                {currentCompany?.position ? `-${currentCompany.position}` : ""}
              </Text>
            </Space>
          );
        },
      },
      {
        title: "角色",
        dataIndex: "role",
        width: 120,
        render: (role: number) => {
          const roleTextMap: Record<number, string> = { 0: "普通用户", 1: "招聘者", 2: "管理员" };
          return <Tag color={role === 1 ? "red" : role === 2 ? "gold" : "blue"}>{roleTextMap[role] || role}</Tag>;
        },
      },
      {
        title: "状态",
        dataIndex: "certificationStatus",
        width: 120,
        render: (status: CertificationStatus) => (
          <Tag color={certificationStatusColorMap[status]}>{certificationStatusTextMap[status]}</Tag>
        ),
      },
      {
        title: "材料",
        dataIndex: "certificationFile",
        width: 140,
        render: (file: string) =>
          file ? (
            <a href={apiConfig.baseUrl + file} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              查看
            </a>
          ) : (
            "暂无"
          ),
      },
      ...(isCompact
        ? []
        : ([
          {
            title: "备注",
            dataIndex: "certificationRemark",
            width: 260,
            render: (remark: string | null) => <span className="line-clamp-2">{remark || "-"}</span>,
          },
          {
            title: "提交时间",
            dataIndex: "createdAt",
            width: 180,
            render: (createdAt: string) => <span>{createdAt ? new Date(createdAt).toLocaleString() : "-"}</span>,
          },
        ] as const)),
      {
        title: "操作",
        fixed: "right" as const,
        width: isCompact ? 180 : 220,
        render: (_: unknown, record: ICertificationApplication) => (
          <Space size="large">
            <Button
              type="primary"
              size="small"
              icon={<IconCheckCircle />}
              disabled={record.certificationStatus !== "pending"}
              onClick={() => {
                setCurrentCertification(record);
                setCertActionType("approve");
                setCertRemark("");
                setCertActionVisible(true);
              }}
            >
              通过
            </Button>
            <Button
              type="secondary"
              size="small"
              icon={<IconCloseCircle />}
              disabled={record.certificationStatus !== "pending"}
              onClick={() => {
                setCurrentCertification(record);
                setCertActionType("reject");
                setCertRemark("");
                setCertActionVisible(true);
              }}
            >
              拒绝
            </Button>
          </Space>
        ),
      },
    ],
    [isCompact]
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
                border
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
                border
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
                border
              />
            </Skeleton>
          </Card>
        </TabPane>

        <TabPane key="companyApprove" title="公司审批">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Title heading={5} style={{ margin: 0 }}>
                  公司审批
                </Title>
                <Tag color="arcoblue">待审核</Tag>
              </div>
              <Text type="secondary">共 {approveListData?.total ?? 0} 条</Text>
            </div>
            <Table
              loading={approveListLoading}
              columns={companyApproveColumns as any}
              data={approveListData?.companies || []}
              scroll={{ x: isCompact ? 820 : 1100 }}
              pagination={{
                total: approveListData?.total || 0,
                showTotal: true,
                sizeCanChange: true,
                showJumper: true,
              }}
              border
            />
          </Card>
        </TabPane>

        <TabPane key="certification" title="企业身份认证">
          <Card>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Title heading={5} style={{ margin: 0 }}>
                  企业身份认证
                </Title>
                <Tag color="arcoblue">审核</Tag>
              </div>
              <Space align="center">
                <Text type="secondary">状态筛选：</Text>
                <Select
                  style={{ width: 180 }}
                  value={certStatus}
                  onChange={(value) => {
                    setCertStatus(value as CertificationStatus);
                    setCertPagination((prev) => ({ ...prev, current: 1 }));
                  }}
                  options={[
                    { label: "待审核", value: "pending" },
                    { label: "已通过", value: "approved" },
                    { label: "已拒绝", value: "rejected" },
                    { label: "未认证", value: "none" },
                  ]}
                />
              </Space>
            </div>
            <Skeleton loading={certificationsLoading} animation>
              <Table
                loading={certificationsLoading}
                columns={certificationColumns as any}
                data={certificationsData?.data.items || []}
                scroll={{ x: isCompact ? 820 : 1100 }}
                pagination={{
                  current: certPagination.current,
                  pageSize: certPagination.pageSize,
                  total: certificationsData?.data.pagination.total || 0,
                  showTotal: true,
                  sizeCanChange: true,
                  showJumper: true,
                  onChange: (current) => setCertPagination((prev) => ({ ...prev, current })),
                  onPageSizeChange: (pageSize) => setCertPagination({ current: 1, pageSize }),
                }}
                border
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

      <Modal
        title={certActionType === "approve" ? "通过认证" : "拒绝认证"}
        visible={certActionVisible}
        confirmLoading={approvingCertification || rejectingCertification}
        onOk={() => {
          if (!currentCertification?.id) return;
          if (certActionType === "approve") {
            approveCertification({
              userInfoId: currentCertification.id,
              remark: certRemark.trim() ? certRemark.trim() : undefined,
            });
            return;
          }
          rejectCertification({
            userInfoId: currentCertification.id,
            remark: certRemark.trim() ? certRemark.trim() : "认证未通过",
          });
        }}
        onCancel={() => {
          setCertActionVisible(false);
          setCertRemark("");
          setCurrentCertification(null);
        }}
        autoFocus={false}
        maskClosable={false}
      >
        <Form layout="vertical">
          <Form.Item label="备注（可选）">
            <Input.TextArea
              value={certRemark}
              onChange={(value) => setCertRemark(value)}
              placeholder={certActionType === "approve" ? "通过原因（可选）" : "拒绝原因（默认：认证未通过）"}
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default Page;
