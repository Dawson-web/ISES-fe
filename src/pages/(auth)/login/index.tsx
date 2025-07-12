import { Button, Input } from "@arco-design/web-react";
import { useRef, useState } from "react";
import AppLogo from "../../../components/public/app-logo";
import { Link, useNavigate } from "react-router-dom";
import CaptchaCode from "../../../components/public/captcha_code";
import { ILoginFileds } from "../../../types";
import { login } from "../../../service";
import { setToken, setUid } from "../../../api/token";
import { toast } from "sonner";

export default function Page() {
  const errorTimes = useRef(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ILoginFileds>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<ILoginFileds>>({});

  const code = useRef("");
  const getCaptchaCode = (value: string) => {
    code.current = value;
  };

  const validateForm = () => {
    const newErrors: Partial<ILoginFileds> = {};
    
    if (!formData.email) {
      newErrors.email = "请输入邮箱";
    } else if (!/^\S+@\S+$/.test(formData.email)) {
      newErrors.email = "请输入正确的邮箱";
    }
    
    if (!formData.password) {
      newErrors.password = "请输入密码";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const res = await login(formData, code.current);
      setToken(res.data.data.token);
      setUid(res.data.data.userInfoId);
      navigate("/navigator");
      toast.success("登录成功");
    } catch (error) {
      errorTimes.current++;
      toast.error(String(error));
    }
  };

  const handleInputChange = (field: keyof ILoginFileds, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div>
      
      <AppLogo size="18px" title="ISES" subtitle="登录" />

      <form
        onSubmit={handleSubmit}
        className="relative flex w-[30vw] min-w-[320px] max-w-[400px] flex-col gap-4 overflow-hidden rounded-md p-4 shadow-md mt-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">邮箱</label>
          <Input
            placeholder="请输入邮箱"
            value={formData.email}
            onChange={(value) => handleInputChange("email", value)}
            status={errors.email ? "error" : undefined}
          />
          {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">密码</label>
          <Input.Password
            placeholder="请输入密码"
            value={formData.password}
            onChange={(value) => handleInputChange("password", value)}
            status={errors.password ? "error" : undefined}
          />
          {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
        </div>

        <CaptchaCode getCaptchaCode={getCaptchaCode} />
        
        {errorTimes.current >= 2 ? (
          <Link to="/seekback" className="text-xs opacity-50 hover:opacity-75">
            忘记密码？前往找回
          </Link>
        ) : (
          <Link to="/register" className="text-xs opacity-50 hover:opacity-75">
            没有账号？前往注册
          </Link>
        )}

          <Button type="primary" htmlType="submit">
            登录
          </Button>

        <div className="absolute inset-x-0 top-0 h-1 bg-blue-500"></div>
      </form>
    </div>
  );
}
