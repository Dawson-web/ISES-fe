import React, { useState, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Divider,
  Message,
  Select,
} from "@arco-design/web-react";
import { IconPlus, IconCamera, IconDelete } from "@arco-design/web-react/icon";
import { IUserInfo, ICompany } from "@/types/user";
import { isMobile } from "@/utils";
import { uploadAvatar } from "@/service/user";
import { apiConfig } from "@/config";

interface EditProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
  userInfo: IUserInfo;
  onSave: (updatedUserInfo: IUserInfo) => void;
}

// 表单项配置接口
interface FormItemConfig {
  label: string;
  field: string;
  type: "input" | "textarea" | "select" | "multiSelect";
  required?: boolean;
  placeholder?: string;
  rules?: any[];
  maxLength?: number;
  showWordLimit?: boolean;
  autoSize?: { minRows: number; maxRows: number };
}

// 公司表单项配置接口
interface CompanyFormItemConfig {
  label: string;
  field: keyof ICompany;
  placeholder?: string;
  required?: boolean;
  gridCol?: number; // 1 或 2，表示占据几列
  rules?: any[];
}

const GradeOptions = ["大一", "大二", "大三", "大四", "研究生", "博士", "毕业"];

// 表单项配置数据
const formItemConfigs: FormItemConfig[] = [
  {
    label: "用户名",
    field: "username",
    type: "input",
    required: true,
    placeholder: "请输入用户名",
    rules: [{ required: true, message: "请输入用户名" }],
  },
  {
    label: "个人介绍",
    field: "introduce",
    type: "textarea",
    placeholder: "请输入个人介绍",
    maxLength: 200,
    showWordLimit: true,
    autoSize: { minRows: 3, maxRows: 6 },
    rules: [{ maxLength: 200, message: "个人介绍不能超过200字" }],
  },
  {
    label: "学校",
    field: "school",
    type: "input",
    placeholder: "请输入学校名称",
  },
  {
    label: "专业",
    field: "major",
    type: "input",
    placeholder: "请输入专业名称",
  },
  {
    label: "年级",
    field: "grade",
    type: "select",
    placeholder: "选择您的年级",
  },
  {
    label: "技术方向",
    field: "techDirection",
    type: "multiSelect",
    placeholder: "请输入技术方向，按回车确认",
  },
  {
    label: "兴趣圈子",
    field: "circles",
    type: "multiSelect",
    placeholder: "请输入兴趣圈子，按回车确认",
  },
];

// 分组配置
const formSections = [
  {
    title: "基本信息",
    fields: ["username", "introduce", "school", "major", "grade"],
  },
  {
    title: "技能与兴趣",
    fields: ["techDirection", "circles"],
  },
];
// 渲染表单项的通用函数
const renderFormItem = (config: FormItemConfig) => {
  const {
    label,
    field,
    type,
    placeholder,
    rules,
    maxLength,
    showWordLimit,
    autoSize,
  } = config;

  return (
    <Form.Item key={field} label={label} field={field} rules={rules}>
      {type === "input" ? (
        <Input placeholder={placeholder} />
      ) : type === "textarea" ? (
        <Input.TextArea
          placeholder={placeholder}
          maxLength={maxLength}
          showWordLimit={showWordLimit}
          autoSize={autoSize}
        />
      ) : type === "select" ? (
        <Select options={GradeOptions.map((v) => ({ label: v, value: v }))} />
      ) : type === "multiSelect" ? (
        <Select
          mode="multiple"
          placeholder={placeholder}
          allowCreate
          allowClear
        />
      ) : null}
    </Form.Item>
  );
};

// 渲染公司表单项的通用函数

const EditProfileDrawer: React.FC<EditProfileDrawerProps> = ({
  visible,
  onClose,
  userInfo,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(userInfo.avatar || "");
  const companies = Form.useWatch("companies", form) || [];
  const renderCompanyFormItem = (
    config: CompanyFormItemConfig,
    index: number
  ) => {
    const { label, field, placeholder, rules, required = false } = config;
    const fieldPath = `companies.${index}.${field}`;
    return (
      <Form.Item
        key={field}
        label={label}
        field={fieldPath}
        rules={rules}
        required={required}
      >
        {/*
        <label className="block text-sm font-medium text-gray-700 mb-1"></label>
        */}
        <Input
          placeholder={placeholder}
        //onChange={(value) => {
        //  form.setFieldsValue({ [fieldPath]: value });
        //}}
        />
      </Form.Item>
    );
  };
  const startRule = (index: number) => ({
    validator: async (value: any, callback: Function) => {
      // 日期格式校验
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        callback("格式应为 YYYY-MM-DD");
        return;
      }
      else {
        // 不能与其他实习经历的开始日期相同
        const companies = form.getFieldValue("companies") || [];
        companies.map((item: ICompany, _index: number) => {
          if(_index !== index && new Date(item.startDate) <= new Date(value) && (new Date(item.endDate) >= new Date(value) || item.endDate === "至今")){
            // console.log(123,item.endDate,item.startDate,value)
            callback("开始日期不能与其他实习经历的日期重叠");
            return;
          }
        });

      }

      // 不能晚于今天
      if (new Date(value).getTime() > Date.now()) {
        callback("开始日期不能大于今天");
        return;
      }

      callback();
    },
  });

  const endRule = (index: number) => ({
    validator: async (value: any, callback: Function) => {
      const companies = form.getFieldValue("companies") || [];
      const start = companies[index]?.startDate;
      if (new Date(value) <= new Date(start)) {
        callback("结束日期必须晚于开始日期");
        return;
      }
      if (new Date(value).getTime() > Date.now()) {
        callback("开始日期不能大于今天");
        return;
      }
      if (value === "至今") {
        const cnt = companies.filter((item: ICompany) => item?.endDate === "至今").length;
        if (cnt > 1) {
          callback("只能有一个实习经历的结束时间为“至今”");
          return;
        }
        callback(); // 当前通过
        return;
      }
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        callback("格式应为 YYYY-MM-DD");
        return;
      }

    },
  });

  const companyFormItemConfigs = (index: number): CompanyFormItemConfig[] => [
    {
      label: "公司名称",
      field: "name",
      placeholder: "请输入公司名称",
      required: true,
      gridCol: 1,
    },
    {
      label: "职位",
      field: "position",
      placeholder: "请输入职位",
      required: true,
      gridCol: 1,
    },
    {
      label: "部门",
      field: "department",
      required: true,
      placeholder: "请输入部门",
      gridCol: 1,
    },
    {
      label: "工作地点",
      field: "location",
      required: true,
      placeholder: "请输入工作地点",
      gridCol: 1,
    },
    {
      label: "开始日期",
      field: "startDate",
      required: true,
      placeholder: "如：2023-06-01",
      gridCol: 1,
      rules: [{ required: true, message: "请输入开始日期" }, startRule(index)],
    },
    {
      label: "结束日期",
      field: "endDate",
      required: true,
      placeholder: "若仍在职请填：至今",
      gridCol: 1,
      rules: [{ required: true, message: "请输入结束日期" }, endRule(index)],
    },
  ];

  useEffect(() => {
    if (visible && userInfo) {
      form.setFieldsValue({
        username: userInfo.username,
        introduce: userInfo.introduce,
        school: userInfo.school,
        major: userInfo.major,
        grade: userInfo.grade,
        techDirection: Array.isArray(userInfo.techDirection)
          ? userInfo.techDirection
          : [],
        circles: Array.isArray(userInfo.circles) ? userInfo.circles : [],
        companies: userInfo.company || [],
      });
      setAvatarUrl(userInfo.avatar || "");
    }
  }, [visible, userInfo, form]);
  // console.log(form.getFieldValue("companies"));
  const handleSave = async () => {
    try {
      //await form.validate(["companies"]);
      await form.validate();
      setLoading(true);

      const values = form.getFieldsValue();
      const updatedUserInfo: IUserInfo = {
        ...userInfo,
        username: values.username,
        introduce: values.introduce,
        school: values.school,
        major: values.major,
        grade: values.grade,
        techDirection: values.techDirection || [],
        circles: values.circles || [],
        avatar: avatarUrl,
        company: companies,
        updatedAt: new Date(),
      };

      onSave(updatedUserInfo);
      Message.success("个人信息更新成功！");
      onClose();
    } catch (error) {
      Message.error("请检查表单信息");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (option: any) => {
    const { onSuccess, onError, file } = option;

    const formData = new FormData();
    formData.append("avatar", file);
    await uploadAvatar(formData)
      .then((res) => {
        setAvatarUrl(apiConfig.baseUrl + res.data.data.avatar);
        onSuccess();
      })
      .catch((err) => {
        onError(err);
      });
  };

  const addCompany = () => {
    const newCompany: ICompany = {
      id: `company_${Date.now()}`,
      name: "",
      position: "",
      department: "",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
    };
    const curCompany = form.getFieldValue("companies") || [];
    form.setFieldValue("companies", [...curCompany, newCompany]);
  };

  const removeCompany = (index: number) => {
    const curCompany = form.getFieldValue("companies") || [];
    const newCompanies = curCompany.filter((_: ICompany, i: number) => i !== index);
    form.setFieldValue("companies", newCompanies);
  };

  //const updateCompany = (
  //  index: number,
  //  field: keyof ICompany,
  //  value: string
  //) => {
  // const newCompanies = [...companies];
  // newCompanies[index] = { ...newCompanies[index], [field]: value };
  // setCompanies(newCompanies);
  //};

  return (
    <Drawer
      width={isMobile() ? "100%" : "500px"}
      title="编辑个人信息"
      visible={visible}
      onOk={handleSave}
      onCancel={onClose}
      confirmLoading={loading}
      okText="保存"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" scrollToFirstError>
        {/* 头像上传 */}
        <Form.Item label="头像">
          <div className="flex items-center gap-4">
            <Avatar size={80} className="bg-cover bg-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="头像"
                  className="w-full h-full object-cover"
                />
              ) : (
                userInfo.username?.charAt(0)
              )}
            </Avatar>
            <Upload
              showUploadList={false}
              customRequest={handleAvatarUpload}
              accept="image/*"
            >
              <Button icon={<IconCamera />} size="small">
                更换头像
              </Button>
            </Upload>
          </div>
        </Form.Item>

        {/* 动态渲染表单分组 */}
        {formSections.map((section) => (
          <div key={section.title}>
            <Divider>{section.title}</Divider>
            {section.fields.map((fieldName) => {
              const config = formItemConfigs.find(
                (item) => item.field === fieldName
              );
              return config ? renderFormItem(config) : null;
            })}
          </div>
        ))}

        {/* 实习经历 */}
        <Divider>
          <div className="flex items-center gap-2">
            <span>实习经历</span>
          </div>
        </Divider>

        {companies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暂无实习经历</p>
          </div>
        ) : (
          <div className="space-y-6">
            {companies.map((company: ICompany, index: number) => (
              <div
                key={company.id || index}
                className="border border-gray-200 rounded-md p-4 relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">
                    实习经历 {index + 1}
                  </h4>
                  <Button
                    type="text"
                    size="small"
                    status="danger"
                    icon={<IconDelete />}
                    onClick={() => removeCompany(index)}
                  >
                    删除
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {companyFormItemConfigs(index).map((config) =>
                    renderCompanyFormItem(config, index)
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <Button
          type="primary"
          className="mt-4 w-4/5 mx-auto"
          icon={<IconPlus />}
          onClick={addCompany}
        >
          添加实习经历
        </Button>
      </Form>
    </Drawer>
  );
};

export default EditProfileDrawer;
